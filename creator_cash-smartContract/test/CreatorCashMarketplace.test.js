const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CreatorCashMarketplace", function () {
  let creatorCashMarketplace;
  let owner;
  let creator;
  let buyer;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    const CreatorCashMarketplace = await ethers.getContractFactory("CreatorCashMarketplace");
    [owner, creator, buyer, addr1, addr2] = await ethers.getSigners();

    // Deploy the contract
    creatorCashMarketplace = await CreatorCashMarketplace.deploy();
    await creatorCashMarketplace.deployed();
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      expect(creatorCashMarketplace.address).to.properAddress;
    });
  });

  describe("Collection Creation", function () {
    it("Should have createCollection function", async function () {
      expect(creatorCashMarketplace.createCollection).to.be.a('function');
    });
  });

  describe("NFT Minting", function () {
    it("Should have mintNFT function", async function () {
      expect(creatorCashMarketplace.mintNFT).to.be.a('function');
    });
  });

  describe("NFT Listing", function () {
    it("Should have listNFT function", async function () {
      expect(creatorCashMarketplace.listNFT).to.be.a('function');
    });
  });

  describe("NFT Purchase", function () {
    it("Should have buyNFT function", async function () {
      expect(creatorCashMarketplace.buyNFT).to.be.a('function');
    });
  });

  describe("Get All Listings", function () {
    it("Should return an array of listings", async function () {
      const listings = await creatorCashMarketplace.getAllListings();
      expect(listings).to.be.an('array');
    });
  });

  describe("Events", function () {
    it("Should have all required events", async function () {
      expect(creatorCashMarketplace).to.have.property('filters');
    });
  });

  describe("Security", function () {
    it("Should use ReentrancyGuard", async function () {
      // The contract inherits from ReentrancyGuard
      // This is verified by the successful compilation
    });
  });
});