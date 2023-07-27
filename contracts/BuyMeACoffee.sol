// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract BuyMeACoffee {
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    Memo[] memos;
    
    address payable owner;

    constructor() {
        owner = payable(msg.sender);
    }

    /**
    * @dev buy a coffee for the contract owner
    * @param _name name of the buyer of the coffee
    * @param _message a message left for us by the buyer of the coffee
    **/

    function buyCoffee(string memory _name, string memory _message) public payable {
        require(msg.value > 0, "You can't buy me a coffee with <=0 money!");

        memos.push(Memo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        ));

        emit NewMemo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        );
    }

    /** 
     * @dev transfer the entire balance stored in this smart contract to the owner  
     */

    function withdrawTips() public {
        require(owner.send(address(this).balance));
    }

    /** 
     * @dev retrieve all the memos received by this smart contract 
     */

    function getMemos() public view returns(Memo[] memory) {
        return memos;
    }   
}
