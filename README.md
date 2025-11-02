is an NFT marketplace built on the Hedera blockchain, specializing in African digital art. It provides a platform for artists to showcase and sell their unique digital creations, and for collectors to discover and acquire these works.



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

## 📈 Frontend Stack
React.js with Vite for a fast and efficient development experience. Check out the [Vite documentation](https://vitejs.dev/guide/) for more information.
- TypeScript
- Tailwind CSS
- Vite
- HederaSDK for interacting with the Hedera network


## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit pull requests.

## 📞 Support

For support, please open an issue on GitHub or contact the development team.


- here is the Pitch Deck :- [creatorcash presentaion deck](https://drive.google.com/file/d/1TMM8HOoUVNPHBHCLpFdMM42swFCfeDhP/view?usp=sharing)
- here is the deployed project :- [creatorscash](https://creator-cash.vercel.app/)
- here is the certificate :- [hedera hashgraph certificate](https://drive.google.com/file/d/1TAjiAJvjMXMLOK4YzyoqjM6rCE3R3YSW/view?usp=sharing)
- here is the demo video :- [demo video](https://drive.google.com/file/d/1hH6Bk_HTIKvlJO9y5nKWUgDwiciRCJz0/view?usp=sharing)


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
