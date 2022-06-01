import './App.css';
import { ethers } from 'ethers';
import React, { useState, useEffect } from 'react';
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import App from './App';

const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider,
        options: {
            infuraId: "t-srm7MtDdWCoJDtTH0i8QikmsD-yZKz" // hide
        },
    },
};

const web3Modal = new Web3Modal({
    theme: "dark",
    cacheProvider: true,
    providerOptions
});

const Main = () => {
    const [userHasConnectedccount, setUserHasConnectedAccount] = useState("loading");
    const [userAccount, setUserAccount] = useState("");
    const [userNetwork, setNetwork] = useState("");
    const [userProvider, setUserProvider] = useState();

    const connectWallet = async () => {
        console.log("In here")
        try {
            const instance = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(instance);
            const accounts = await provider.listAccounts();
            const network = await provider.getNetwork();

            setUserAccount(accounts[0]);
            setNetwork(network.name)
            setUserHasConnectedAccount("true");
            setUserProvider(provider);
        } catch (error) {
            console.error(error);
        }
    };   

    return (

        <div className='App'>

            <App
                isAuthenticated={userHasConnectedccount}
                connect={connectWallet}
                currentUser={userAccount}
                currentNetwork={userNetwork}
                currentProvider={userProvider}
                userHasConnected={userHasConnectedccount}
            />
        </div>
    )
}
export default Main;