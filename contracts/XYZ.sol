//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract XYzToken is ERC20 {
    constructor() ERC20("ExWhyZee", "XYZ") {
        _mint(msg.sender, 10000000 *(10 ** 18));        
    }
}