// const { expect } = require("chai");
// const { ethers } = require("hardhat");

// describe("Greeter", function () {
//   it("Should return the new greeting once it's changed", async function () {
//     const Greeter = await ethers.getContractFactory("Greeter");
//     const greeter = await Greeter.deploy("Hello, world!");
//     await greeter.deployed();

//     expect(await greeter.greet()).to.equal("Hello, world!");

//     const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

//     // wait until the transaction is mined
//     await setGreetingTx.wait();

//     expect(await greeter.greet()).to.equal("Hola, mundo!");
//   });
// });

// describe("Bank", function () {
//   it("Should return the new greeting once it's changed", async function () {
//     const Bank = await ethers.getContractFactory("Bank");
//     const bank = await Bank.deploy("Hello, world!");
//     await bank.deployed();


//   //   var should = require('chai').should() //actually call the function
//   // , foo = 'bar'
//   // , beverages = { tea: [ 'chai', 'matcha', 'oolong' ] };

//     expect(await bank.greet()).to.equal("Hello, world!");

//     const setGreetingTx = await bank.setGreeting("Hola, mundo!");

//     // wait until the transaction is mined
//     await setGreetingTx.wait();

//     expect(await bank.greet()).to.equal("Hola, mundo!");
//   });
// });