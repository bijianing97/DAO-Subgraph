// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract Getbalance {
    constructor()public{}
    function balance(address account)external view returns(uint256){
        return address(account).balance;
    }
}