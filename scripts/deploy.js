const { ethers } = require("hardhat");
const RinkebyAtrac = "0x98d9a611ad1b5761bdc1daac42c48e4d54cf5882";

const main = async () => {

    //get the address of the deployer
    const [deployer] = await ethers.getSigners();
    //get eth balance of deployer
    let balance = await deployer.getBalance();
    console.log(`The deployer of this app : ${deployer.address}`);
    console.log(`deployer balance : ${balance}`);

    //Deploy custom token contract or use Rinkeby ATRAC
    //if  using rinkeby-atrac, please comment out lines 15-18
    var tokenFactory = await ethers.getContractFactory("XYzToken");
    var tokenContract = await tokenFactory.deploy();
    await tokenContract.deployed();
    console.log("token address: ", tokenContract.address);

    //Deploy bank contract
    //If using rinkeby-Atrac please replace "tokenContract.address" in line 23 with "RinkebyAtrac"
    //Parameters for deployment of bank contract are
    //=> address of ERC-20 token to be used in bank (tokenContract.address)
    //=> Total time for deposit of bank in seconds (1000) 
    //=> Total amount of ERC20 token set for reward pool (10000)
    var bankFactory = await ethers.getContractFactory("BankAlexandra");
    var bankContract = await bankFactory.deploy(tokenContract.address, 1000, 10000);
    await bankContract.deployed();

    console.log("Bank address: ", bankContract.address);

    //Owner Increase allowance for bank contract
    let txn = await tokenContract.increaseAllowance(bankContract.address, 10000);
    await txn.wait();

    //Deploy reward contract
    //Parameters for deployment of reward contract are
    //=> address of bank contrcat token to be used in reward pool (bankContract.address)
    //=> Total amount of ERC20 token set for reward pool (10000)
    var rewardFactory = await ethers.getContractFactory("RewardPool");
    var rewardContract = await rewardFactory.deploy(bankContract.address, 10000);
    await rewardContract.deployed();
    console.log("Reward Pool address: ", rewardContract.address);

    // Finally set reward contract for bank
    var setRewardTxn = bankContract.setRewardContract(rewardContract.address);
    await setRewardTxn.wait();
}

const run = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(0);
    }
}

run();