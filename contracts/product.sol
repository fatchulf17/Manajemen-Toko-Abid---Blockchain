pragma solidity ^0.8.19;

contract product {

    bytes32[] products;
    bytes32[] owners;
    bytes32[] pStatus;

    mapping(bytes32 => bool) public vProducts;

    function setProduct(bytes32 productId,bytes32 pOwner) public{

        require(!vProducts[productId]);
        vProducts[productId] = true;

        products.push(productId);
        owners.push(pOwner);
        pStatus.push("Tersedia");
                
    }

    function viewProducts () public view returns(bytes32[] memory, bytes32[] memory,bytes32[] memory) {
        return(products,owners,pStatus);
    }

    function sellProduct (bytes32 sProductId) public {
        bytes32 status;
        uint i;
        uint j=0;

        if(products.length>0) {
            for(i=0;i<products.length;i++) {
                if(products[i]==sProductId) {
                    j=i;
                }
            }
        }

        status=pStatus[j];
        if(status=="Tersedia") {
            pStatus[j]="Tidak Tersedia";
        }
    }
}
