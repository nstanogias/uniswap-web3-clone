// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Volswap {

    IERC20 public volToken;
    
    constructor(address vToken) {
        volToken = IERC20(vToken);
    }

    // 1 VolToken = 0.0001 eth
    uint256 ethValue = 100000000000000;

    // 0.0001 eth = 1 VolToken

    function getBalance(address _address) public view returns (uint256) {
        return volToken.balanceOf(_address);
    }

    function getTotalSupply() public view returns (uint256) {
        return volToken.totalSupply();
    }

    function getName() public view returns (string memory) {
        return volToken.name();
    }

    function getTokenAddress() public view returns (address) {
        return address(volToken);
    }

    function getEthBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function swapEthToToken() public payable returns (uint256) {
        uint256 inputValue = msg.value;
        uint256 outputValue = (inputValue / ethValue) * 10 ** 18; // Convert to 18 decimal places
        require(volToken.transfer(msg.sender, outputValue));
        return outputValue;
    }

    function swapTokenToEth(uint256 _amount) public returns (uint256) {
        // Convert the token amount (ethValue) to exact amount (10)
        uint256 exactAmount = _amount / 10 ** 18;
        uint256 ethToBeTransferred = exactAmount * ethValue;
        require(address(this).balance >= ethToBeTransferred, "Dex is running low on balance.");

        payable(msg.sender).transfer(ethToBeTransferred);
        require(volToken.transferFrom(msg.sender, address(this), _amount));
        return ethToBeTransferred;
    }
}