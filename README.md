# Onboarding Project for Origin-Trails
Case study: ```to create a bank smart contract which will enable anyone to deposit an amount X of XYZ ERC20 tokens to their savings (staking) account. The bank smart contract also contains an additional token reward pool of R XYZ tokens, deposited to the contract by the contract owner (bank owner) at
contract deployment. At deployment the bank owner sets a time period constant T, to be used for reward calculation. ```

# For note on contract Deployment: Look at scripts/deploy.js
Please use **rinkeby** network for this project!!!

# Note to deployer:
After deployment, 
If the bank and reward pool contract are using the custom xyz token 
    Then you must transfer some of this tokens to potential users of the reward pool.
    After transfering the tokens to the users, the users can then deposit to the bank to be eligible for the reward pool.
If the bank and reward pool contract are using the rinkeby atrac token
    Please visit https://docs.origintrail.io/developers/node-setup/testnet-installation for instructions on how to get the rinkeby-atrac token

    *The deployer would need to have some rinkeby-atrac to deploy the reward pool token
    * After deployment of bank contract, users that have rinkeby-atrac can deposit them to the bank to be eligible for the reward pool 

Contract address of Rinkeby-Atrac : "0x98d9a611ad1b5761bdc1daac42c48e4d54cf5882".
This basically means that the bank and reward pool can use the rinkeby atrac token as their native token for operation.

**before you interact with front end, please make sure the code is using the correct abi and contract address inside src/App.js**

# To run and interact with the deposit and withdraw functions:
- Clone project
- run "npm i" on your terminal
- run "npm start" on your terminal
or
- run "npx hardhat test" //to run test
