// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";

contract BankAlexandra is Ownable, ReentrancyGuard {
    //banka Aleksandra -- croatia
    //banco alejandra -- spanish
    // Library usage
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    // Contract owner
    address public _owner;

    //Time variables
    uint256 public _depositTimePeriod;

    //Reward variables
    uint256 public _totalRewardPoolAmount;

    // Token amount variables
    mapping(address => uint256) public _balances;
    uint256 public _depositedAmount = 0;
    uint256 public _timeOfDeployment;

    // ERC20 contract address
    IERC20 public _erc20Contract;
    address public _rewardAddress;

    bool public rewardAddressSet;

    // Events
    event TokensDeposited(address from, uint256 amount);
    event TokensWithdrawn(address to, uint256 amount);

    //ModiisWithdrawTimefiers
    modifier isDepositTime() {
        uint256 timeSpent = block.timestamp - _timeOfDeployment;
        require(timeSpent <= _depositTimePeriod, "Deposit is period over!");
        _;
    }
    //must be within deposot time
    modifier isWithdrawTime() {
        uint256 deploymentTime = _timeOfDeployment;
        uint256 timeSpent = block.timestamp - deploymentTime;
        uint256 time = _depositTimePeriod;
        uint256 t2 = time * 2;
        require(timeSpent > t2, "Not yet withdrawal time");
        _;
    }

    modifier onlyHolder() {
        require(_balances[msg.sender] > 0, "Insufficient balance");
        _;
    }

    modifier rewardAddressIsSet() {
        require(rewardAddressSet, "Set reward contract first");
        _;
    }

    modifier onlyRewardPool() {
        require(msg.sender == _rewardAddress, "Set reward contract first");
        _;
    }

    //Constructor
    constructor(
        IERC20 erc20ContractAddress,
        uint256 depositTimePeriod,
        uint256 totalRewardPoolAmount
    ) payable {
        uint256 deployersBalance = erc20ContractAddress.balanceOf(msg.sender);

        require(
            totalRewardPoolAmount > 0,
            "Reward token amount must be greater than 0"
        );

        require(deployersBalance > 0, "You must own the reward token");

        require(
            totalRewardPoolAmount <= deployersBalance,
            "Insufficient balance"
        );

        require(
            address(erc20ContractAddress) != address(0),
            "_erc20ContractAddress address can not be zero"
        );

        // Set contract owner
        _owner = msg.sender;

        // Set deposit time frame
        _depositTimePeriod = depositTimePeriod;
        // Set reward pool amount
        _totalRewardPoolAmount = totalRewardPoolAmount;
        // Set the erc20 contract address
        _erc20Contract = erc20ContractAddress;

        _timeOfDeployment = block.timestamp;
    }

    // Public functions
    receive() external payable {
        _deposit(msg.value);
    }

    function bankDeposit(uint256 amount)
        external
        payable
        isDepositTime
        nonReentrant
    {
        _deposit(amount);
    }

    function bankWithdraw() public isWithdrawTime onlyHolder nonReentrant {
        _withdraw();
    }

    function bankRewardWithdraw(address sender, uint256 finalBalance)
        external
        isWithdrawTime
        rewardAddressIsSet
        onlyRewardPool
        nonReentrant
    {
        _withdrawReward(sender, finalBalance);
    }

    function withdrawRewardBalance() external onlyOwner nonReentrant {
        uint256 time = _depositTimePeriod;
        uint256 t4 = time * 4;
        require(
            block.timestamp > t4 && _depositedAmount == 0,
            "Can only withdraw reward balance when we are after stage four and staked amount is zero"
        );
        // require(address(token) != address(0), "Token address can not be zero");
        // require(token == erc20Contract, "Token address must be ERC20 address which was passed into the constructor");

        _erc20Contract.safeTransfer(_owner, _totalRewardPoolAmount);
    }

    //    function totalDeposit() external view returns (uint256 balance) {
    //          return _erc20Contract.balanceOf(address(this));
    //     }

    //gets the balance of user in the erc20 contrace
    function balanceOf(address sender) external view returns (uint256 balance) {
        balance = _erc20Contract.balanceOf(sender);
    }

    //get how much the person deposited to the bank
    function getBankBalanceOf(address sender)
        external
        view
        returns (uint256 balance)
    {
        balance = _balances[sender];
    }

    //get total amount deposited to tjhe bank
    function getTotalDeposit() external view returns (uint256) {
        return _depositedAmount;
    }

    //GET TIME IN SECONDS FOR DEPOSIT
    function getSetDepositTime() external view returns (uint256) {
        return _depositTimePeriod;
    }

    function getRewardPoolAmount() external view returns (uint256){
        return _totalRewardPoolAmount;
    }

    // Private functions
    function _deposit(uint256 amount) private {
        uint256 senderWalletBalance = _erc20Contract.balanceOf(tx.origin);

        require(
            senderWalletBalance > 0,
            "You are not currently a holder of the native token of this bank"
        );
        require(
            amount <= senderWalletBalance,
            " You do not have enough native tokens in your account, please try a lesser amount"
        );
        _erc20Contract.safeTransferFrom(tx.origin, address(this), amount);

        _balances[tx.origin] = _balances[tx.origin].add(amount);

        _depositedAmount += amount;
        emit TokensDeposited(tx.origin, amount);
    }

    function _withdraw() private {
        uint256 amount = _balances[msg.sender];
        _balances[msg.sender] = 0;
        _depositedAmount.sub(amount);
        _erc20Contract.transfer(msg.sender, amount);
        emit TokensWithdrawn(msg.sender, amount);
    }

    function _withdrawReward(address sender, uint256 finalBalance) private {
        uint256 amount = _balances[tx.origin];
        _balances[tx.origin] = 0;
        console.log("deposited amoutn before withdraw", _depositedAmount);
        console.log("amount to be subtracted", finalBalance);
        uint256 reward = finalBalance - amount;
        //final balance minus amount should
        unchecked {
            _depositedAmount -= finalBalance;
            _totalRewardPoolAmount -= reward;
        }
        console.log("deposited amoutn after withdraw", _depositedAmount);
        _erc20Contract.transfer(sender, finalBalance);
        emit TokensWithdrawn(sender, finalBalance);
    }

    function setRewardContract(address reward) external onlyOwner {
        require(!rewardAddressSet, "Already set");
        require(
            address(reward) != address(0),
            "bank contract address can not be zero"
        );

        require(reward != tx.origin, "Address is not a contract");
        _rewardAddress = reward;
        rewardAddressSet = true;
    }
}
