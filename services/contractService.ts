import { ethers, Contract, Signer } from 'ethers';
import contractABI from './contractABI.json';

// Extend the ImportMeta interface to include env
declare global {
  interface ImportMeta {
    env: {
      VITE_CONTRACT_ADDRESS?: string;
      VITE_HEDERA_RPC_URL?: string;
    };
  }
}

// Contract address on Hedera Testnet
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x96e441f5Db0E0C082674F8B24De9Bb37375bBc15';
const RPC_URL = import.meta.env.VITE_HEDERA_RPC_URL || 'https://testnet.hashio.io/api';

// Listing interface
export interface Listing {
  token: string;
  serialNumber: ethers.BigNumber;
  priceHBAR: ethers.BigNumber;
  seller: string;
}

// NFT interface
export interface NFT {
  token: string;
  serialNumber: ethers.BigNumber;
  metadataURI: string;
  creator: string;
}

// Owned NFT interface
export interface OwnedNFT {
  token: string;
  serialNumber: ethers.BigNumber;
  metadataURI: string;
  owner: string;
}

// Initialize provider
export const getProvider = () => {
  return new ethers.providers.JsonRpcProvider(RPC_URL);
};

// Get contract instance
export const getContract = (signerOrProvider: Signer | ethers.providers.Provider) => {
  return new Contract(CONTRACT_ADDRESS, contractABI, signerOrProvider);
};

// Create collection
export const createCollection = async (
  signer: Signer,
  name: string,
  symbol: string,
  metadataURI: string,
  creator: string
): Promise<ethers.ContractTransaction> => {
  const contract = getContract(signer);
  return await contract.createCollection(name, symbol, metadataURI, creator);
};

// Mint NFT
export const mintNFT = async (
  signer: Signer,
  token: string,
  metadataURI: string,
  creator: string
): Promise<ethers.ContractTransaction> => {
  const contract = getContract(signer);
  return await contract.mintNFT(token, metadataURI, creator);
};

// List NFT
export const listNFT = async (
  signer: Signer,
  token: string,
  serialNumber: number,
  priceHBAR: number
): Promise<ethers.ContractTransaction> => {
  const contract = getContract(signer);
  return await contract.listNFT(token, serialNumber, ethers.utils.parseEther(priceHBAR.toString()));
};

// Buy NFT
export const buyNFT = async (
  signer: Signer,
  token: string,
  serialNumber: number,
  priceHBAR: number
): Promise<ethers.ContractTransaction> => {
  const contract = getContract(signer);
  return await contract.buyNFT(token, serialNumber, {
    value: ethers.utils.parseEther(priceHBAR.toString())
  });
};

// Transfer NFT
export const transferNFT = async (
  signer: Signer,
  token: string,
  serialNumber: number,
  toAddress: string
): Promise<ethers.ContractTransaction> => {
  const contract = getContract(signer);
  return await contract.transferNFT(token, serialNumber, toAddress);
};

// Get all listings
export const getAllListings = async (): Promise<Listing[]> => {
  const provider = getProvider();
  const contract = getContract(provider);
  return await contract.getAllListings();
};

// Get user's NFTs
export const getUserNFTs = async (userAddress: string): Promise<OwnedNFT[]> => {
  try {
    const provider = getProvider();
    const contract = getContract(provider);
    return await contract.getNFTsByOwner(userAddress);
  } catch (error) {
    console.error('Error fetching user NFTs:', error);
    return [];
  }
};

// Listen to events
export const listenToEvents = (signerOrProvider: Signer | ethers.providers.Provider, callback: (event: string, data: any) => void) => {
  const contract = getContract(signerOrProvider);
  
  contract.on('CollectionCreated', (token, name, symbol, creator) => {
    callback('CollectionCreated', { token, name, symbol, creator });
  });
  
  contract.on('NFTMinted', (token, serialNumber, metadataURI, creator) => {
    callback('NFTMinted', { token, serialNumber: serialNumber.toString(), metadataURI, creator });
  });
  
  contract.on('NFTListed', (token, serialNumber, priceHBAR, seller) => {
    callback('NFTListed', { token, serialNumber: serialNumber.toString(), priceHBAR: ethers.utils.formatEther(priceHBAR), seller });
  });
  
  contract.on('NFTPurchased', (token, serialNumber, priceHBAR, buyer, seller) => {
    callback('NFTPurchased', { token, serialNumber: serialNumber.toString(), priceHBAR: ethers.utils.formatEther(priceHBAR), buyer, seller });
  });
  
  contract.on('NFTTransfer', (token, serialNumber, from, to) => {
    callback('NFTTransfer', { token, serialNumber: serialNumber.toString(), from, to });
  });
};