//SPDX-License-Identifier: UNLICENSED 

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract RecommendationPortal {
       //Add reentracy modifier

       constructor() payable{}
    event AboutMeAdded (address sender, string aboutMe );
      uint totalAboutMes;
      uint seed;
      address public LastEmployee; //last perso that asent an aboutme
      uint public LastSentAboutMeTimeStamp;
      address[] public allSenderAddresses;

    struct Wave {
        address sender;
        string AboutMe;
        uint TimeStamp;
    }  

    Wave[] waves;
  
   mapping (address => string) employeeToAboutme;
    //Am an employer, this is a contract where you send info about your self and why i should employ u

    //I want a person to be able to send me an about me
    function sendAboutMe (string memory aboutme) public {
        LastSentAboutMeTimeStamp = block.timestamp;
        totalAboutMes += 1;
        LastEmployee = msg.sender;
        _saveAboutMe(msg.sender, aboutme);
        console.log("%s just sent you an about me %s", msg.sender, aboutme);

        seed = (block.difficulty + block.timestamp + seed) % 100;
        console.log("random number generated: %d", seed);

        if (seed <=50){
            console.log("Prize won", msg.sender);
            
            uint reward = 0.0001 ether;
            require(reward <= address(this).balance, "Insuffcient fundz");             

        (bool isSuccess, ) = (msg.sender).call{value: reward}("");
        require(isSuccess, "Reward not sent!");
        }
        allSenderAddresses.push(msg.sender);
        emit AboutMeAdded(msg.sender, aboutme);
    }
    
    // i want to be able to save peoples aboutme 
    function _saveAboutMe (address sender, string memory aboutme) private {
        //require that the person has not sent stuff ever before!!
        require(bytes(employeeToAboutme[msg.sender]).length == 0);
        
        employeeToAboutme[sender] = aboutme;
        waves.push(Wave(sender, aboutme, block.timestamp));
        emit AboutMeAdded(sender, aboutme); 
    }

    //I want to be able to get the number of about mes i have
    function getTotalAboutMes () public view returns (uint) {
        console.log("We have %d potential employees", totalAboutMes);
        return totalAboutMes;
    }

    function getAllAboutMes () public view returns (Wave[] memory) {
        return waves;
    }

    function getSendersList() public view returns (address[] memory){
        return allSenderAddresses;
    }

    function getLastWavedAddress() public view returns (address){
       return LastEmployee;
    }
    
    function getLastWavedTime() public view returns (uint) {
       return LastSentAboutMeTimeStamp;
    }
}