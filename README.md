# BankAlexandra
Time based staking bank combined with the benefits of a time based reward staking pool.  

Case study: ```to create a bank smart contract which will enable anyone to deposit an amount X of XYZ ERC20 tokens to their savings (staking) account. The bank smart contract also contains an additional token reward pool of R XYZ tokens, deposited to the contract by the contract owner (bank owner) at
contract deployment. At deployment the bank owner sets a time period constant T, to be used for reward calculation. ```

# For note on contract Deployment: Look at scripts/deploy.js
Please use **rinkeby** network for this project!!!

# Note to deployer:
After deployment, 
Using the custom xyz token 
    Then deployer must transfer some of this tokens to potential users of the reward pool.
    After transfering the tokens to the users, the users can then deposit to the bank to be eligible for the reward pool.

**before you interact with front end, please make sure the code is using the correct abi and contract address inside src/App.js**

# To run and interact with the deposit and withdraw functions:
- Clone project
- run "npm i" on your terminal
- run "npm start" on your terminal
or
- run "npx hardhat test" //to run test
