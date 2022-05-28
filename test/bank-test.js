const { expect } = require("chai");
const { ethers } = require("hardhat");



// describe("Bank", function () {
//     it("Should return the new greeting once it's changed", async function () {
//         //
//         const Bank = await ethers.getContractFactory("BankAlexandra");
//         const bank = await Bank.deploy("Hello, world!");
//         await bank.deployed();


//         //   var should = require('chai').should() //actually call the function
//         // , foo = 'bar'
//         // , beverages = { tea: [ 'chai', 'matcha', 'oolong' ] };

//         expect(await bank.greet()).to.equal("Hello, world!");

//         const setGreetingTx = await bank.setGreeting("Hola, mundo!");

//         // wait until the transaction is mined
//         await setGreetingTx.wait();

//         expect(await bank.greet()).to.equal("Hola, mundo!");
//     });
// });

// describe('the bankDeposit function', () => {
//     it('returns the staking balance of the depositor', async () => {
//         const [x, buyerAddress, thirdAddress, fourthAddress] = await ethers.getSigners()

//         //deploy xyz token
//         const Token = await ethers.getContractFactory("XYzToken");
//         const token = await Token.deploy();
//         await token.deployed();
//         const tokenAddress = token.address;
//         console.log(token.signer.address, "signer")

//         //transfer xyz token to two people
//         token.transfer(buyerAddress.address, 1000);
//         console.log(buyerAddress.address, "buyerAddress");
//         console.log(await token.balanceOf(buyerAddress.address), "buyerAddress")

//         token.transfer(thirdAddress.address, 4000);
//         console.log(thirdAddress.address, "thirdAddress");
//         console.log(await token.balanceOf(thirdAddress.address), "thirdAddress")

//         token.transfer(fourthAddress.address, 10000);
//         console.log(fourthAddress.address, "fourthAddress");
//         console.log(await token.balanceOf(fourthAddress.address), "fourthAddress")
//         //deploy bank

//         console.log(1)
//         const Bank = await ethers.getContractFactory("BankAlexandra");
//         console.log(2, tokenAddress)

//         const bank = await Bank.deploy(tokenAddress, 10, 10000);
//         console.log(3)

//         await bank.deployed();
//         const bankAddress = bank.address;

//         //approve money to bank        
//         await token.increaseAllowance(bankAddress, 10000);

//         //deploy Rewardpool
//         const Reward = await ethers.getContractFactory("RewardPool");
//         console.log(x.address, "x")
//         const reward = await Reward.deploy(bankAddress, 10000);
//         await reward.deployed();

//         const rewardAddress = reward.address;

//         //decrease allowance
//         //await token.decreaseAllowance(bankAddress, 10000);

//         //user deposits xyz token
//         await token.connect(buyerAddress).increaseAllowance(bankAddress, 1000);
//         await bank.connect(buyerAddress).bankDeposit(1000);

//         //await token.decreaseAllowance(bankAddress, 10000);

//         //user deposits xyz token
//         await token.connect(thirdAddress).increaseAllowance(bankAddress, 4000);
//         var thireddepo = await bank.connect(thirdAddress).bankDeposit(4000);
//         //await token.decreaseAllowance(bankAddress, 10000);       
//         //get users balance
//         expect(await bank.balanceOf(thirdAddress.address).toString()).to.equal("");
//     })

//     it('can only be called during deposit period (T)', async () => {
//         const [_, buyerAddress] = await ethers.getSigners()

//         //deploy xyz token
//         const Token = await ethers.getContractFactory("XYzToken");
//         const token = await Token.deploy();
//         await token.deployed();
//         const tokenAddress = token.address;

//         //transfer xyz token to two people
//         token.transfer(buyerAddress.address, 1000);
//         console.log(buyerAddress.address, "buyerAddress");
//         console.log(await token.balanceOf(buyerAddress.address), "buyerAddress")

//         const Bank = await ethers.getContractFactory("BankAlexandra");
//         console.log(2, tokenAddress)

//         //Set expiration time for 2seconds --for test purposes
//         const bank = await Bank.deploy(tokenAddress, 2, 10000);
//         await bank.deployed();
//         const bankAddress = bank.address;

//         //user deposits xyz token
//         await token.connect(buyerAddress).increaseAllowance(bankAddress, 1000);
//         await bank.connect(buyerAddress).bankDeposit(500);

//         //mock time expiration
//         // await setTimeout(async()=> {
//         //     await bank.connect(buyerAddress).bankDeposit(400);
//         // }, 10000000);

//         //user deposits xyz token
//         //await token.connect(buyerAddress).increaseAllowance(bankAddress, 1000);

//     })
// });

describe('the bankWithdrawReward function', () => {
    it('returns the final balance to be withdrawn at time of withdrawal', async () => {
        const [x, buyerAddress, thirdAddress, fourthAddress] = await ethers.getSigners()

        //deploy xyz token
        const Token = await ethers.getContractFactory("XYzToken");
        const token = await Token.deploy();
        await token.deployed();
        const tokenAddress = token.address;

        //transfer xyz token to two people
        token.transfer(buyerAddress.address, 1000);

        token.transfer(thirdAddress.address, 4000);
        console.log(thirdAddress.address, "thirdAddress");
        console.log(await token.balanceOf(thirdAddress.address), "thirdAddress")

        //deploy bank       
        const Bank = await ethers.getContractFactory("BankAlexandra");
        const bank = await Bank.deploy(tokenAddress, 7, 10000);
        await bank.deployed();

        const bankAddress = bank.address;

        //approve money to bank        
        await token.increaseAllowance(bankAddress, 10000);

        //deploy Rewardpool
        const Reward = await ethers.getContractFactory("RewardPool");
        const reward = await Reward.deploy(bankAddress, 10000);
        await reward.deployed();

        const rewardAddress = reward.address;

        //decrease allowance
        //await token.decreaseAllowance(bankAddress, 10000);
        console.log(1)
        //user deposits xyz token
        console.log(await token.balanceOf(buyerAddress.address), "User1 token balance before seending to bank");
        let _depositedAmount1 = await bank.getTotalDeposit();
        console.log(_depositedAmount1, "total amount in bank before user1 deposits 1000 tokens");
        await token.connect(buyerAddress).increaseAllowance(bankAddress, 1000);
        await bank.connect(buyerAddress).bankDeposit(1000);

        console.log(await token.balanceOf(buyerAddress.address), "User1 token balance after seending to bank")

        let _depositedAmountx = await bank.getTotalDeposit();
        console.log(_depositedAmountx, "total amount in bank after user1 deposit");
        //user2 deposits
        console.log(await token.balanceOf(thirdAddress.address), "User token balance before seending to bank");
        let _depositedAmount2 = await bank.getTotalDeposit();
        console.log(_depositedAmount2, "total amount in bank before uswe2 deposit");
        await token.connect(thirdAddress).increaseAllowance(bankAddress, 4000);
        await bank.connect(thirdAddress).bankDeposit(4000);

        console.log(await token.balanceOf(thirdAddress.address), "User2 token balance after seending to bank")

        let _depositedAmount = await bank.getTotalDeposit();
        console.log(_depositedAmount, "total amount in bank after user2 deposit");
        //await token.decreaseAllowance(bankAddress, 10000); 

        //user1 withdraws at time greater than t2 which is 
        await timeout(async () => {
            let txx = await bank.setRewardContract(reward.address);
            await txx.wait();
            console.log(await token.balanceOf(buyerAddress.address), "Balance of user two before bank withdrawl")

            let tx = await reward.connect(buyerAddress).Withdraw();
            await tx.wait()
            console.log(await token.balanceOf(buyerAddress.address), "Balance of user two before bank withdrawal")
           
        }, 12000);


        await timeout(async () => { }, 10000);

        //user2 withdraws at time greater than t4 which is 
        await timeout(async () => {
            //T3 Withdrawal;            
            console.log(await token.balanceOf(thirdAddress.address), "thirdAddressbal1")

            let tx = await reward.connect(thirdAddress).Withdraw();
            await tx.wait()
            console.log(await token.balanceOf(thirdAddress.address), "thirdAddressbal2")
        }, 10000);

       await timeout(async () => { }, 2000);       

    })
    it("can only be called when it is reward time (2T)", () => {

    })
});

function timeout(fn, delay) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                fn();
                resolve();
            } catch (err) {
                reject(err);
            }
        }, delay);
    });
}