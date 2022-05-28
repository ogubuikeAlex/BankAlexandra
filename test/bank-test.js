const { expect } = require("chai");
const { ethers } = require("hardhat")


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
        await token.connect(buyerAddress).approve(bankAddress, 1000);
        await bank.connect(buyerAddress).bankDeposit(1000);
        //await token.decreaseAllowance(bankAddress, 1000 -20);

        console.log(await token.balanceOf(buyerAddress.address), "User1 token balance after seending to bank")

        let _depositedAmountx = await bank.getTotalDeposit();
        console.log(_depositedAmountx, "total amount in bank after user1 deposit");
        //user2 deposits
        console.log(await token.balanceOf(thirdAddress.address), "User token balance before seending to bank");
        let _depositedAmount2 = await bank.getTotalDeposit();
        console.log(_depositedAmount2, "total amount in bank before uswe2 deposit");
        await token.connect(thirdAddress).approve(bankAddress, 4000);
        await bank.connect(thirdAddress).bankDeposit(4000);

        console.log(await token.balanceOf(thirdAddress.address), "User2 token balance after seending to bank")

        let _depositedAmount = await bank.getTotalDeposit();
        console.log(_depositedAmount, "total amount in bank after user2 deposit");
        //await token.decreaseAllowance(bankAddress, 4000 - 20); 

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