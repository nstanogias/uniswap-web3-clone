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

    function getTokenAddress() public view returns (address) {
        return address(volToken);
    }

    function getEthBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function swapEthToToken() public payable returns (uint256) {
        require(msg.value > 0, "You need to send some ETH to proceed");

        uint256 inputValue = msg.value;
        uint256 amountToBuy = (inputValue / ethValue) * 10 ** 18; // Convert to 18 decimal places
        uint256 vendorTokenBalance = volToken.balanceOf(address(this));
        require(vendorTokenBalance >= amountToBuy, "Volswap contract doesn't have enough token balance");
        (bool sent) = volToken.transfer(msg.sender, amountToBuy);

        require(sent, "Failed to transfer tokes to user");

        return amountToBuy;
    }

    function swapTokenToEth(uint256 _amount) public returns (uint256) {
        require(_amount > 0, "Specify an amount greater than 0");
        
        uint256 userBalance = volToken.balanceOf(msg.sender);
        require(userBalance >= _amount, "You have insufficient funds");
        // Convert the token amount (ethValue) to exact amount (10)
        uint256 exactAmount = _amount / 10 ** 18;
        uint256 ethToBeTransferred = exactAmount * ethValue;
        uint256 vendorETHBalance = address(this).balance;
        require(vendorETHBalance >= ethToBeTransferred, "Volswap contract doesn't have enough eth balance");
        (bool sent) = volToken.transferFrom(msg.sender, address(this), _amount);
        require(sent, "Failed to transfer tokes to user");

        payable(msg.sender).transfer(ethToBeTransferred);
        
        return ethToBeTransferred;
    }
}