// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Volswap {

    IERC20 public volToken;
    
    constructor(address vToken) {
        volToken = IERC20(vToken);
    }

    uint256 public voltokensPerEth = 1000;

    function getBalance(address _address) public view returns (uint256) {
        return volToken.balanceOf(_address);
    }

    function getTotalSupply() public view returns (uint256) {
        return volToken.totalSupply();
    }

    function getTokenAddress() public view returns (address) {
        return address(volToken);
    }

    function getEthBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function swapEthToToken() public payable returns (uint256 tokenAmount) {
        require(msg.value > 0, "You need to send some ETH to proceed");

        uint256 amountToBuy = msg.value * voltokensPerEth;
        uint256 vendorTokenBalance = volToken.balanceOf(address(this));
        require(vendorTokenBalance >= amountToBuy, "Volswap contract doesn't have enough token balance");
        (bool sent) = volToken.transfer(msg.sender, amountToBuy);

        require(sent, "Failed to transfer tokens to user");

        return amountToBuy;
    }

    function swapTokenToEth(uint256 tokenAmountToSell) public {
        require(tokenAmountToSell > 0, "Specify an amount greater than 0");
        uint256 userBalance = volToken.balanceOf(msg.sender);
        require(userBalance >= tokenAmountToSell, "You have insufficient funds");
        uint256 amountOfEthToTransfer = tokenAmountToSell / voltokensPerEth;
        uint256 ownerEthBalance = address(this).balance;
        require(ownerEthBalance >= amountOfEthToTransfer, "Volswap contract doesn't have enough eth balance");
        (bool sent) = volToken.transferFrom(msg.sender, address(this), tokenAmountToSell);
        require(sent, "Failed to transfer tokens");
        (sent,) = msg.sender.call{value: amountOfEthToTransfer}("");
        require(sent, "Failed to transfer ETH");
    }
}