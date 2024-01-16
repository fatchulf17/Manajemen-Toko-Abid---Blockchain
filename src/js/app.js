App = {

    web3Provider: null,
    contracts: {},

    init: async function() {
        return await App.initWeb3();
    },

    initWeb3: function() {
        if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        } else {
            App.web3Provider = new Web3.proviers.HttpProvider('http://localhost:8545');
        }

        web3 = new Web3(App.web3Provider);
        return App.initContract();
    },

    initContract: function() {

        $.getJSON('product.json', function(data) {

            var productArtifact = data;
            App.contracts.product = TruffleContract(productArtifact);
            App.contracts.product.setProvider(App.web3Provider);
        });

        return App.bindEvents();
    },

    bindEvents: function() {

        $(document).on('click', '.btn-register', App.registerProduct);
    },

    registerProduct: function(event) {
        event.preventDefault();

        var productInstance;

        var productId = document.getElementById('productId').value;
        var pOwner = document.getElementById('pOwner').value;

        web3.eth.getAccounts(function(error, accounts) {
            if (error) {
                console.log(error);
            }

            var account = accounts[0];

            App.contracts.product.deployed().then(function(instance) {
                productInstance = instance;
                return productInstance.setProduct(web3.fromAscii(productId), web3.fromAscii(pOwner), { from: account });
            }).then(function(result) {
                console.log(result);

                // Show SweetAlert notification
                Swal.fire({
                    title: 'Sukses!',
                    text: 'Produk Berhasil Didata.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(function() {
                    // Reload the page after clicking 'OK' in SweetAlert
                    window.location.reload();
                });

                // Clear input fields
                document.getElementById('productId').value = '';
                document.getElementById('pOwner').value = '';
            }).catch(function(err) {
                console.log(err.message);
                // Show SweetAlert notification for failure
                Swal.fire({
                    title: 'Gagal!',
                    text: 'Gagal Mendata Produk, COba Lagi.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            });
        });
    }

};

$(function() {

    $(window).load(function() {
        App.init();
    })
})