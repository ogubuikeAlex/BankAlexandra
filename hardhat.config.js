require('dotenv').config();
require("@nomiclabs/hardhat-waffle");

const { API_URL, PRIVATE_KEY } = process.env;

 module.exports = {
   defaultNetwork: "hardhat",  
  networks:{
    hardhat: {
      chainId: 1337
    },
    rinkeby: {
      url: `${API_URL}`,
      accounts: [PRIVATE_KEY],
      gas: 2100000,
      gasPrice: 8000000000
    },
  },
  solidity: "0.8.11",
  paths: {
    artifacts : "./src/artifacts",
  }
}

