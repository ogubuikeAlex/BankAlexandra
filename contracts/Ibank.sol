// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface Ibank {
    function bankDeposit(uint256 amount) external payable;

    function bankWithdraw() external;

    function bankRewardWithdraw(address sender, uint256 finalBalance) external;

    function withdrawRewardBalance() external;

    //gets the balance of user in the erc20 contrace
    function balanceOf(address sender) external view returns (uint256 balance);

    function getRewardPoolAmount() external view returns (uint256);

    //get how much the person deposited to the bank
    function getBankBalanceOf(address sender)
        external
        view
        returns (uint256 balance);

    //get total amount deposited to tjhe bank
    function getTotalDeposit() external view returns (uint256);

    //GET TIME IN SECONDS FOR DEPOSIT
    function getSetDepositTime() external view returns (uint256);

    // Private functions
    function setRewardContract(address reward) external;
}
