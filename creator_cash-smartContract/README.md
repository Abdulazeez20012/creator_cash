# CreatorCash - Hedera NFT Marketplace

A decentralized NFT marketplace for African creators built on Hedera Hashgraph using Hedera Token Service (HTS) precompiles.

## 🌍 Overview

CreatorCash enables African creators and artists to mint and sell their digital art or music as NFTs with instant payouts, even when buyers use traditional payment methods.

## ⚙️ Core Features

1. **Create Collections** - Creators can create NFT collections using HTS
2. **Mint NFTs** - Mint art, audio, and video NFTs with metadata
3. **List for Sale** - Put NFTs up for sale in the marketplace
4. **Purchase NFTs** - Buy NFTs with HBAR payments
5. **Instant Payouts** - Creators receive immediate payments

## 📁 Project Structure

```
creator-cash/
├── contracts/
│   └── CreatorCashMarketplace.sol
├── scripts/
│   └── deploy.js
├── test/
│   └── CreatorCashMarketplace.test.js
├── .env.example
└── README.md
```

## 🛠️ Prerequisites

- Node.js v16+
- Hardhat
- Hedera Testnet Account

## 🚀 Deployment

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Copy `.env.example` to `.env` and fill in your Hedera credentials:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your values:
   ```
   HEDERA_OPERATOR_ID=0.0.xxxxxx
   HEDERA_OPERATOR_KEY=302e020100300506032b657004220420...
   NETWORK=testnet
   ```

3. **Compile Contracts**
   ```bash
   npx hardhat compile
   ```

4. **Deploy to Hedera Testnet**
   ```bash
   npx hardhat run scripts/deploy.js --network hedera-testnet
   ```

## 🧪 Testing

Run the test suite:
```bash
npx hardhat test
```

## 🔧 Contract Functions

### Create Collection
```solidity
function createCollection(
    string memory name,
    string memory symbol,
    string memory metadataURI,
    address creator
) external returns (address tokenAddress)
```

### Mint NFT
```solidity
function mintNFT(
    address token,
    string memory metadataURI,
    address creator
) external returns (int64 serialNumber)
```

### List NFT for Sale
```solidity
function listNFT(
    address token,
    int64 serialNumber,
    uint256 priceHBAR
) external
```

### Buy NFT
```solidity
function buyNFT(
    address token,
    int64 serialNumber
) external payable
```

## 📡 Integration Points

The smart contract is designed to work with:
- **Hedera JavaScript SDK** for frontend interactions
- **Ethers.js** with Hedera RPC endpoints
- **Hedera Mirror Nodes** for event indexing

## 🔐 Security Features

- Reentrancy protection using OpenZeppelin's ReentrancyGuard
- HTS response validation
- Creator-only minting restrictions
- Owner-only listing permissions

## 📈 Frontend Integration

Frontend applications can interact with the contract using:

1. **Create Collection**
   ```javascript
   const tx = await creatorCash.createCollection(
     "My Art Collection",
     "ART",
     "ipfs://metadata-uri",
     creatorAddress
   );
   ```

2. **Mint NFT**
   ```javascript
   const tx = await creatorCash.mintNFT(
     tokenAddress,
     "ipfs://nft-metadata-uri",
     creatorAddress
   );
   ```

3. **List NFT**
   ```javascript
   const tx = await creatorCash.listNFT(
     tokenAddress,
     serialNumber,
     priceInHbar
   );
   ```

4. **Buy NFT**
   ```javascript
   const tx = await creatorCash.buyNFT(
     tokenAddress,
     serialNumber,
     { value: priceInHbar }
   );
   ```

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit pull requests.

## 📞 Support

For support, please open an issue on GitHub or contact the development team.