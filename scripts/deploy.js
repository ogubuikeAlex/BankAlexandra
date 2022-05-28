const { ethers } = require("hardhat");
const RinkebyAtrac = "0x98d9a611ad1b5761bdc1daac42c48e4d54cf5882";

const main = async () => {
    //get the address of the deployer
    const [deployer] = await ethers.getSigners();
    //get balance
    let balance = await deployer.getBalance();
    
    console.log(`The deployer of this app : ${deployer.address}`);
    console.log(`deployer balance : ${balance}`);
    //get the contract

    var tokenFactory = await ethers.getContractFactory("XYzToken");
    var tokenContract = await tokenFactory.deploy();
    await tokenContract.deployed();

    //get bank contract

    var bankFactory = await ethers.getContractFactory("BankAlexandra");
    var bankContract = await bankFactory.deploy(tokenContract.address, 1000, 10000);
    await bankContract.deployed();
    
    console.log("Bank address: ", bankContract.address);    
     
     //get the contract
 
     var rewardFactory = await ethers.getContractFactory("RewardPool");
     var rewardContract = await rewardFactory.deploy(bankContract.address, 1000);
     await rewardContract.deployed();
     
     console.log("Reward Pool address: ", rewardContract.address);
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