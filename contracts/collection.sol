// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <=0.9.0;

contract collect {
    address public owner;

    struct provider {
        address payable providerAddr;
        string name;
    }

    provider public seller;

    struct image {
        string link;
        uint256 image_size;
        uint256 price;
        uint16 image_width;
        uint16 image_height;
        
    }

    image[] public providerImages;
    mapping(address => image[]) provider_to_images;
    mapping(uint256 => image) IdToImage;

    event proposalReceived (string name, uint id, string link);
    event priceSuggested (uint id, uint price);
    event proposalDeclined (uint id);
    event priceAccepted (uint id);
    event payedForProduct (uint id);

    constructor() payable {
        owner = payable(msg.sender);
    }

    function sendProposal (string memory _link, uint256 _id, uint256 _size, uint16 _width, uint16 _height, string memory _name) public {
        image memory new_image = image(_link, _size, 0, _width, _height);
        seller = provider(payable(msg.sender), _name);
        provider_to_images[msg.sender].push(new_image);
        IdToImage[_id] = new_image;
        emit proposalReceived(_name, _id, _link);
    }

    function assessProposal (bool _decision, uint256 _id, uint256 _price) public {
        if(_decision == true){
            suggestPrice(_id, _price);
        }
        else {
            emit proposalDeclined(_id);
        }
    }

    function suggestPrice (uint256 _id, uint256 _price) internal {
        require(msg.sender == owner);
        IdToImage[_id].price = _price;
        emit priceSuggested(_id, _price);
    }

    function providerDecision(bool decision, uint _id) public {
        if(decision == true)
            emit priceAccepted(_id);
        else emit proposalDeclined(_id);
    }

    function payForProduct(uint _id) external payable {
        require(msg.value == IdToImage[_id].price);
        withdraw();
        emit payedForProduct(_id);
    }

    function withdraw() internal {
        seller.providerAddr.transfer(address(this).balance);
    }

    function getImageInfo (uint256 _id) public view returns(string memory, uint16, uint16, uint256, uint256) {
        require(msg.sender == owner);
        return (
            IdToImage[_id].link,
            IdToImage[_id].image_width,
            IdToImage[_id].image_height,
            IdToImage[_id].image_size,
            IdToImage[_id].price
        );
    }

    function getPrice(uint _id) public view returns(uint) {
        return IdToImage[_id].price;
    }
}