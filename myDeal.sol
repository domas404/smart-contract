// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract myDeal{
    address public owner;
    address public buyerAddr;

    struct Buyer {
        address addr;
        string name;
    }

    struct Shipment {
        address courier;
        uint price;
        address payer;
        uint date;
    }

    struct Order {
        string items;
        uint quantity;
        uint number;
        uint price;
        Shipment shipment;
    }

    mapping (uint => Order) orders;

    uint orderseq;

    event OrderSent(address buyer, string items, uint quantity, uint orderseq);

    constructor(address _buyer){
        owner = msg.sender;
        buyerAddr = _buyer;
    }

    modifier checkIfOwner(){
        require(msg.sender == owner);
        _;
    }

    function sendOrder(string memory items, uint quantity) public {
        require(msg.sender == buyerAddr);
        orderseq++;
        orders[orderseq] = Order(items, quantity, orderseq, 0, Shipment(msg.sender, 0, buyerAddr, block.timestamp));
        emit OrderSent(msg.sender, items, quantity, orderseq);
    }

    function getOrderByNumber(uint _number) public view returns(string memory, uint, uint) {
        return (orders[_number].items, orders[_number].quantity, orders[_number].price);
    }

    function sendPrice(uint orderno, uint proce, int8 ttype) payable public {

    }
}