const main = async () => {
    const [owner, randomPerson] = await hre.ethers.getSigners();
    //compile our contact and create the files we need to work with our contract under the artifacts directory 
    const recommendationContractFactory = await hre.ethers.getContractFactory("RecommendationPortal");
    //Here hardhat will create a local ethereum network for us and deploy our contract
    //It will destroy the blockchain after the script finishes
    //and create a fresh blockchain for everytime we run the contract
    const recommendationContract = await recommendationContractFactory.deploy({value: hre.ethers.utils.parseEther("0.1")}); //this willl deploy the contract and fund it with ether from my wallet
     
    await recommendationContract.deployed(); //we will wait until our cintract finishes deploying
   //recommendation Contract.adress gives us the actual address our contract was deployed to
    console.log(`contract deployed to ${recommendationContract.address}`);
    console.log(`contract deployed by ${owner.address}`);

    //Get total about mes 
    let aboutMeCount = await recommendationContract.getTotalAboutMes();
    let lastemployee = await recommendationContract.getLastWavedAddress();
    let getLastEmloyeeTimeStamp = await recommendationContract.getLastWavedTime()

    console.log(`lastemployee: ${lastemployee}`);
    console.log(`lastTimeSTmp:${getLastEmloyeeTimeStamp.toNumber()}`);

    //Get contract balance
    let contractBalance = await hre.ethers.provider.getBalance(recommendationContract.address); //get the balance of a contract
    //format the balnce well
    console.log(`contract balance ${hre.ethers.utils.formatEther(contractBalance)}`);

    //send an about me
    let aboutMeTxn = await recommendationContract.sendAboutMe("I write beautiful and secure contracts");
    await aboutMeTxn.wait(); // Wait for the transactcion to be mined

    //get total about me
    aboutMeCount = await recommendationContract.getTotalAboutMes();

    //Get contract balance
    contractBalance = await hre.ethers.provider.getBalance(recommendationContract.address); //get the balance of a contract
    //format the balnce well
    console.log(`contract balance ${hre.ethers.utils.formatEther(contractBalance)}`);

    //Send second about me
    console.log("simulating a random person sending an about me\n");
    aboutMeTxn = await recommendationContract.connect(randomPerson).sendAboutMe("I love to eat beans");

    //Get total about mes
    aboutMeCount = await recommendationContract.getTotalAboutMes();
    console.log("Get total about mes", aboutMeCount.toNumber());

    //Get contract balance
    contractBalance = await hre.ethers.provider.getBalance(recommendationContract.address); //get the balance of a contract
    //format the balnce well
    console.log(`contract balance ${hre.ethers.utils.formatEther(contractBalance)}`);

    console.log("simulating a second random person sending an about me Two\n");
    aboutMeTxn = await recommendationContract.connect(randomPerson).sendAboutMe("I love my XPS");
    aboutMeCount = await recommendationContract.getTotalAboutMes();
    console.log("Get total about mes", aboutMeCount.toNumber());

    contractBalance = await hre.ethers.provider.getBalance(recommendationContract.address); //get the balance of a contract
    //format the balance well
    console.log(`contract balance ${hre.ethers.utils.formatEther(contractBalance)}`);

    let newTxn = await recommendationContract.getAllAboutMes();
    console.log(newTxn);

   lastemployee = await recommendationContract.getLastWavedAddress();
   getLastEmloyeeTimeStamp = await recommendationContract.getLastWavedTime()

    console.log(lastemployee);
    console.log(getLastEmloyeeTimeStamp.toNumber());
}

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(0);
    }
}

runMain();