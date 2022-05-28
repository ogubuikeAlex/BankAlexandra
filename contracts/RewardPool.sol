// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./Ibank.sol";

import "hardhat/console.sol";

contract RewardPool is Ownable, ReentrancyGuard {
    // Library usage
    using SafeMath for uint256;

    // Contract owner
    address public _owner;

    //Time variables
    uint256 public _depositTimePeriod;
    uint256 public _deploymentTime;

    //Reward variables
    uint256 public _totalRewardPoolAmount;
    uint256 _rewardForWithdrawalPhaseOne;
    uint256 _rewardForWithdrawalPhaseTwo;
    uint256 _rewardForWithdrawalPhaseThree;
    uint256 _totalAmountInBank;
    bool totalDepositIsSet;

    // Interface instance of bank
    IBank _bank;

    // Events
    event TokensWithdrawn(address to, uint256 amount);

    modifier isWithdrawTime() {
        uint256 deploymentTime = _deploymentTime;
        uint256 time = _depositTimePeriod;

        uint256 timeSpent = block.timestamp - deploymentTime;
        uint256 t2 = time * 2;
        require(timeSpent > t2, "Not yet withdrawal time");
        _;
    }

    modifier onlyHolder() {
        uint256 balance = _bank.getBankBalanceOf(msg.sender);
        require(balance > 0, "Insufficient balance");
        _;
    }

    //Constructor
    //require that time is greated than block.timestamp
    constructor(address bankContractAddress, uint256 totalRewardPoolAmount) {
        require(
            address(bankContractAddress) != address(0),
            "bank contract address can not be zero"
        );

        require(bankContractAddress != tx.origin, "This is not a contract");

        require(
            totalRewardPoolAmount > 0,
            "Reward token amount must be greater than 0"
        );

        IBank bank = IBank(bankContractAddress);

        uint256 deployersBalance = bank.balanceOf(msg.sender);

        require(
            totalRewardPoolAmount <= deployersBalance,
            "Insufficient bank balance"
        );

        bank.bankDeposit(totalRewardPoolAmount);
        uint256 setDepositTime = bank.getSetDepositTime();

        _depositTimePeriod = setDepositTime;
        // Set contract owner
        _owner = msg.sender;
        // Set reward pool amount
        _totalRewardPoolAmount = totalRewardPoolAmount;
        // Set the bank contract address

        _deploymentTime = block.timestamp; //Should give the unix time of rn
        _bank = bank;
        totalDepositIsSet = false;

        _rewardForWithdrawalPhaseOne = (totalRewardPoolAmount * 20) / 100;
        _rewardForWithdrawalPhaseTwo = (totalRewardPoolAmount * 30) / 100;
        _rewardForWithdrawalPhaseThree = (totalRewardPoolAmount * 50) / 100;
    }

    // Public functions
    receive() external payable {}

    function Withdraw() public isWithdrawTime onlyHolder nonReentrant {
        _withdraw();
    }

    // Private functions
    function _withdraw() private returns (uint256 finalBalance) {
        if (!totalDepositIsSet) {
            _totalAmountInBank = _bank.getTotalDeposit();
        }
        uint256 time = _depositTimePeriod; //number of seconds set
        uint256 secondsPassed = (block.timestamp).sub(_deploymentTime); //
        // uint256 totalRewardPoolAmount = _totalRewardPoolAmount;
        // uint256 _depositedAmount = _bank.getTotalDeposit();

        uint256 t2 = time * 2;
        uint256 t3 = time * 3;
        uint256 t4 = time * 4;

        uint256 amount = _bank.getBankBalanceOf(msg.sender);

        if (secondsPassed > t2 && secondsPassed <= t3) {
            console.log("in one");
            uint256 stageReward = _rewardForWithdrawalPhaseOne;
            uint256 rewardOne = _getPercetageOfCurrentStakedBalance(
                msg.sender,
                stageReward
            );

            _rewardForWithdrawalPhaseOne -= rewardOne;
            _totalRewardPoolAmount -= rewardOne;
            _totalAmountInBank -= rewardOne;

            console.log(
                "total reward amount is",
                _totalRewardPoolAmount,
                "after subtracting reward one"
            );

            console.log(
                "stage one total reward amount is",
                _rewardForWithdrawalPhaseOne,
                "after subtracting reward two"
            );

            finalBalance = rewardOne + amount;
        }

        if (secondsPassed > t3 && secondsPassed <= t4) {
            console.log("in two");
            uint256 stageReward = _rewardForWithdrawalPhaseOne;

            uint256 rewardOne = _getPercetageOfCurrentStakedBalance(
                msg.sender,
                stageReward
            );

            _rewardForWithdrawalPhaseOne -= rewardOne;
            _totalRewardPoolAmount -= rewardOne;
            _totalAmountInBank -= rewardOne;

            console.log(
                "total reward amount is",
                _totalRewardPoolAmount,
                "after subtracting reward one"
            );

            stageReward = _rewardForWithdrawalPhaseTwo;

            uint256 rewardTwo = _getPercetageOfCurrentStakedBalance(
                msg.sender,
                stageReward
            );

            _rewardForWithdrawalPhaseTwo -= rewardTwo;
            _totalRewardPoolAmount -= rewardTwo;
            _totalAmountInBank -= rewardTwo;

            console.log(
                "total reward amount is",
                _totalRewardPoolAmount,
                "after subtracting reward two"
            );

            console.log(
                "stage twototal reward amount is",
                _rewardForWithdrawalPhaseTwo,
                "after subtracting reward two"
            );

            finalBalance = rewardOne + rewardTwo + amount;
        }

        if (secondsPassed > t4) {
            console.log("in three");

            uint256 stageReward = _rewardForWithdrawalPhaseOne;

            uint256 rewardOne = _getPercetageOfCurrentStakedBalance(
                msg.sender,
                stageReward
            );

            _rewardForWithdrawalPhaseOne -= rewardOne;
            _totalRewardPoolAmount -= rewardOne;
            _totalAmountInBank -= rewardOne;


            console.log(
                "total reward amount is",
                _totalRewardPoolAmount,
                "after subtracting reward one"
            );

            console.log(stageReward, "before");
            stageReward = _rewardForWithdrawalPhaseTwo;
            console.log(stageReward, "After");

            uint256 rewardTwo = _getPercetageOfCurrentStakedBalance(
                msg.sender,
                stageReward
            );

            _rewardForWithdrawalPhaseTwo -= rewardTwo;
            _totalRewardPoolAmount -= rewardTwo;
            _totalAmountInBank -= rewardTwo;


            console.log(
                "total reward amount is",
                _totalRewardPoolAmount,
                "after subtracting reward two"
            );

            console.log(
                "stage twototal reward amount is",
                _rewardForWithdrawalPhaseTwo,
                "after subtracting reward two"
            );

            stageReward = _rewardForWithdrawalPhaseThree;

            uint256 rewardThree = _getPercetageOfCurrentStakedBalance(
                msg.sender,
                stageReward
            );
            _rewardForWithdrawalPhaseThree -= rewardThree;
            _totalRewardPoolAmount -= rewardThree;
            _totalAmountInBank -= rewardThree;

            console.log(
                "total reward amount is",
                _totalRewardPoolAmount,
                "after subtracting reward three"
            );

            console.log(
                "stage three total reward amount is",
                _rewardForWithdrawalPhaseThree,
                "after subtracting reward two"
            );

            console.log(
                msg.sender,
                "reward one after calculations is",
                rewardOne
            );
            console.log(
                msg.sender,
                "reward two after calculations is",
                rewardTwo
            );
            console.log(
                msg.sender,
                "reward three after calculations is",
                rewardThree
            );
            console.log(
                "original reward for phase two",
                _rewardForWithdrawalPhaseTwo
            );
            console.log(
                "original reward for phase three",
                _rewardForWithdrawalPhaseThree
            );

            finalBalance = rewardOne + rewardTwo + rewardThree + amount;
        }
        uint256 reward = finalBalance - amount;

        console.log(
            "total reward pool amount after subtraction of",
            finalBalance
        );
        console.log("from", amount, "is", reward);

        _bank.bankRewardWithdraw(msg.sender, finalBalance);
        console.log(
            _bank.getTotalDeposit(),
            "balance after withdrawal of",
            finalBalance
        );
        emit TokensWithdrawn(msg.sender, finalBalance);
    }

    function _getPercetageOfCurrentStakedBalance(
        address sender,
        uint256 stageReward
    ) internal view returns (uint256 result) {
        //get amount owned by holder
        uint256 balance = _bank.getBankBalanceOf(sender);
        uint256 _totalAmountBank = _totalAmountInBank;
        uint256 totalRewardPoolAmount = _totalRewardPoolAmount;
        uint256 _amountDeposited = _totalAmountBank - totalRewardPoolAmount;

        console.log("balance", balance);
        console.log("total amount in bank", _totalAmountBank);
        console.log("total Reward pool", totalRewardPoolAmount);
        console.log("amount deposited", _amountDeposited); //4000

        //get percent of total staked amount
        uint256 percentOfCurrentBalance = (balance * 100).div(_amountDeposited);

        result = (stageReward * percentOfCurrentBalance).div(100);
        console.log(result, "result");
    }
}

interface IBank is Ibank{
    function bankDeposit(uint256 amount) external payable;

    function bankWithdraw() external;

    function bankRewardWithdraw(address sender, uint256 finalBalance) external;

    function withdrawRewardBalance() external;

    //gets the balance of user in the erc20 contrace
    function balanceOf(address sender) external view returns (uint256 balance);

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
