import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/portal.json";

export default function App() {

  const [userHasMetaMask, setUserHasMetaMask] = useState("loading");
  const [currentAccount, setCurrentAccount] = useState("");
  const [currentAboutMe, setAboutMe] = useState("");
  const [currentAboutMeList, setCurrentAboutMeList] = useState([]);

  const contractAddress = "0xf9Df5e9543D3717FfE45486C0AB8333817266119";
  const contractAbi = abi.abi;

  const checkUserHasAccount = async () => {
    try {
      const { ethereum } = window;
      //Check that user has meta mask
      if (!ethereum) {
        console.log("Do you have metamask installed ?");
        setUserHasMetaMask("failed")
        return;
      }
      else {
        console.log("We have metamask", ethereum);
        setUserHasMetaMask("sucessful");
      }

      //Check if an ethereum account exists in wallet
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        console.log("found an authorized account,", accounts[0]);
        setCurrentAccount(accounts[0]);
        await getAllAboutMes();
      } else {
        console.log("No account found")
      }
    } catch (err) {
      console.log("Error", err);
    }
  }
  //Connect a wallet
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Do you have meta mask");
      }
      else {
        console.log("We have metamask", ethereum);
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        console.log("connected", accounts[0]);
        setCurrentAccount(accounts[0]);
      }
    } catch (error) { console.log(`error : ${error}`); }
  }

  //Send about me
  const sendAboutMe = async () => {
    
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const recommendationContract = new ethers.Contract(contractAddress, contractAbi, signer);

        let recommendTxn = await recommendationContract.sendAboutMe(currentAboutMe);
        console.log("Sending About Me now!");
        console.log("Mining", recommendTxn.hash);
        recommendTxn.wait();

        let count = await recommendationContract.getTotalAboutMes();
        setAboutMe("");
        console.log("Retrieved total AboutMe count...", count.toNumber());

      } else {
        console.log("Ethereum object doesnt exist");
      }
      
    } catch (err) {
      console.log(`error : ${err}`);
    }

  }

  const getAllAboutMes = async () => {
    
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractAbi, signer);

      let aboutMes = await contract.getAllAboutMes();
      
      //next store it in an array
      let allaboutMes = [];
      console.log(aboutMes);
      aboutMes.forEach(aboutMe => {
        console.log("the messge:" + aboutMe.AboutMe);
        allaboutMes.push({
          sender: aboutMe.sender,
          aboutMe: aboutMe.AboutMe,
          timeStamp: aboutMe.TimeStamp
        })
      })
      setCurrentAboutMeList(allaboutMes);

    } else {
      console.log("ethereum object is not available");
    }
    
  }

  useEffect(() => { checkUserHasAccount(); });

  return (
    <div>
      <React.Fragment>
        {userHasMetaMask === 'loading' ? (
          <div className="onBoardingScreen">
            <h2>Starting Recommendation portal, Feel free to think about the best description of yourself!</h2>
          </div>
        ) : userHasMetaMask === 'failed' ? (
          <div className="onBoardingScreen">
            <span className="header" aria-label="Greeting" role="img">
              😥
            </span>
            <h2 style={{ maxWidth: '600px', textAlign: 'center' }}>
              You must <a href="https://metamask.io/">install Metamax</a> to  send an about me for a JOB recommendation
            </h2>
          </div>
        ) : (
          <React.Fragment>
            {!currentAccount ? (
              <section className="onBoardingScreen">
                <div className="onboardingContainer">
                  <span className="header" aria-label="Greeting" role="img">
                    😘 Hi! Welcome to the Recommendation Portal!
                  </span>
                  <p className="bio">Send me a short and impressive info about yourself<br />If it is impressive enough, I will recommend you <br />and probably give you some ETH🙂 as a tip for a job well done</p>
                  
                  <button className="waveButton-inverted" onClick={connectWallet}>
                    Connect and Lets GO!
                  </button>
                </div>
              </section>
            ) : (
              <React.Fragment>
                <section className="dataWrapper">
                  <div className="dataContainer">
                    <span className="header" aria-label="Greeting" role="img">
                      😎 Hey {currentAccount.slice(0, 6)}...{currentAccount.slice(-3)}!
                    </span>

                    <p className="bio">
                      I am 👑Alexandra. I love to meet impressive people like you. I am what you will describe as a foodie😋<br /> I love to write a lot of full stack codes!
                    </p>

                    <textarea
                      className="waveMessageInput"
                      onChange={e => setAboutMe(e.target.value)}
                      value={currentAboutMe}
                      name="waveMessage"
                      placeholder="I would love to meet you, tell me something cool😋"
                      cols="30"
                      rows="5"
                    ></textarea>

                    <button className="waveButton" onClick={sendAboutMe}>
                      Send about me
                    </button>
                  </div>

                  <div className="wavesSendersInfo">
                  <h2> What have other people been saying?</h2>
                    <React.Fragment>
                      {
                        
                        currentAboutMeList?.length < 1 ? <h1>No about me found.</h1> :
                        
                          currentAboutMeList.reverse().map((aboutme, index) => {
                            return (
                              <div key={index} className='waveSenderContainer'>
                                <div className="waverAddressList">
                                  <span>Address: {aboutme.sender}</span>
                                  <span> Time: {aboutme.timeStamp.toString()}</span>
                                  <span>Message: {aboutme.aboutMe}</span>
                                </div>
                              </div>
                            )
                          })
                          
                      }

                    </React.Fragment>

                  </div>
                </section>
              </React.Fragment>
            )}

          </React.Fragment>
        )}
      </React.Fragment>
    </div>
  )
}
