const main = async () => {
    //get the address of the deployer
    const [deployer] = await hre.ethers.getSigners();
    //get balance
    let balance = await deployer.getBalance();
    
    console.log(`The deployer of this app : ${deployer.address}`);
    console.log(`deployer balance : ${balance}`);
    //get the contract

    var contractFactory = await hre.ethers.getContractFactory("RecommendationPortal");
    var contract = await contractFactory.deploy({value: hre.ethers.utils.parseEther("0.01")});
    await contract.deployed();
    
    console.log("WavePortal address: ", contract.address);
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