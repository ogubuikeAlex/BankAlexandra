import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import rewardAbi from "./artifacts/contracts/RewardPool.sol/RewardPool.json";
import bankAbi from "./artifacts/contracts/Bank.sol/BankAlexandra.json"
import tokenAbi from "./artifacts/contracts/XYZ.sol/XYzToken.json"
import rinkebyAtracAbi from "./artifacts/contracts/IRinkebyAtrac.sol/IRinkebyAtrac.json";

export default function App({ isAuthenticated, connect, currentUser, currentNetwork, userHasConnected, currentProvider }) {

  const [depositAmount, setDepositAmount] = useState("");

  const [userHasConnectedccount, setUserHasConnectedAccount] = useState(false);
  const rewardPoolContractAddress = "0x81a1EeF5B231880A77D1a7d027fC1296C169b7F3";
  const bankContractAddress = "0x81a1EeF5B231880A77D1a7d027fC1296C169b7F3";
  const tokenContractAddress = ""; 
  //const rinkebyAtrac ="0x98d9a611ad1b5761bdc1daac42c48e4d54cf5882

  const contractAbi = rewardAbi.abi;
  const bankContractAbi = bankAbi.abi;
  const tokenContractAbi = tokenAbi.abi;
  const rinkebyAtracContractAbi = rinkebyAtracAbi.abi;

  const connecting = async () => {
    console.log("pressing")
    await connect();
  }
  //Send about me
  const withdraw = async () => {
    try {      
      const signer = currentProvider.getSigner();
      const rewardContract = new ethers.Contract(rewardPoolContractAddress, contractAbi, signer);

      let withdrawalTxn = await rewardContract.Withdraw();
      await withdrawalTxn.wait();
    }

    catch (err) {
      console.log("An error occured : \n", err);
    }
  }

  const deposit = async () => {
    if (!depositAmount){
      return;
    }
    try {
      const signer = currentProvider.getSigner();
      const contract = new ethers.Contract(bankContractAddress, bankContractAbi, signer);
      const tokenContract = new ethers.Contract(tokenContractAddress, tokenContractAbi, signer);
      //const rinkebyContract = new ethers.Contract(rinkebyAtrac, rinkebyAtracContractAbi, signer);

      let allowTxn = tokenContract.approve(bankContractAddress, depositAmount);
      await allowTxn.wait();

      let depositTxn = await contract.bankDeposit(depositAmount);
      await depositTxn.wait();
    }
    catch (err) {
      console.log("An error occured : \n", err);
    }
    finally {
      setDepositAmount("")
    }
  }  

  useEffect(() => {
    const authenticated = localStorage.getItem("isAuthenticated");
    if (authenticated && JSON.parse(authenticated)) {
      setUserHasConnectedAccount(true);
      //connect();
    }
    connect();
  }, [])

  useEffect(() => {
    localStorage.setItem("isAuthenticated", userHasConnectedccount)

  }, [userHasConnectedccount])

  return (
    <div>
      <React.Fragment>
        {userHasConnected === 'loading' ? (
          <div className="onBoardingScreen">
            <h1>Welcome To Banco Alejandra!<br /><br /></h1>
            <h2>Scan the QR code to connect your wallet and Be a part of the reward pool<br />
              or you could <a style={{ color: "white" }} href="https://metamask.io/">install Metamask</a> to Proceed
            </h2>
            <button className="waveButton-inverted" onClick={connecting}>
              Connect and Lets GO!
            </button>
          </div>
        ) : userHasConnected === 'failed' ? (
          <div className="onBoardingScreen">
            <span className="header" aria-label="Greeting" role="img">
              Hi! Welcome to <br /> Banco Alejandra!
            </span>
            <span className="header" aria-label="Greeting" role="img">
              😥
            </span>
            <h2 style={{ maxWidth: '600px', textAlign: 'center' }}>
              You must connect a wallet to  be able to Proceed
            </h2>
            <button className="waveButton-inverted" onClick={connecting}>
              Connect and Lets GO!
            </button>
          </div>
        ) : (
          <React.Fragment>
            <section className="dataWrapper">
              <div className="dataContainer">
                <span className="header" aria-label="Greeting" role="img">
                  😎 Hey {currentUser.slice(0, 6)}...{currentUser.slice(-3)}!
                </span>

                <h3 className="bio">
                  At Banco Alejandra when you stake tokens, you become part of the great Alexandra pool
                  <br /><br />
                  Its a game of patience<br />
                  <span style={{ color: "white" }}> The rule is simple : THE LONGER YOUR STAKE THE HIGHER YOUR REWARD
                  </span>
                </h3>


                <input
                  className="waveMessageInput"
                  onChange={e => setDepositAmount(+(e.target.value))}
                  value={depositAmount}
                  name="tokenAmount"
                  placeholder="How much token would you like to stake"
                  cols="30"
                  rows="5"
                />

                <button className="waveButton" onClick={() => deposit(depositAmount)}>
                  <span>Stake 'Em Tokens</span>
                </button>

                <button className="waveButton" onClick={withdraw}>
                  <span>UnStake 'Em Tokens</span>
                </button>
              </div>

              <div className="wavesSendersInfo">
                <h2> Current Network: {currentNetwork}<br /><br />Current Staking Balance: {"0"}</h2>
              </div>
            </section>
          </React.Fragment>
        )}

      </React.Fragment>

    </div>
  )
}
