// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title IHederaTokenService
 * @dev Interface for Hedera Token Service precompiles
 */
interface IHederaTokenService {
    function createNonFungibleToken(
        address treasury,
        string memory name,
        string memory symbol,
        string memory memo,
        bool freezeDefault
    ) external returns (int responseCode, address tokenAddress);

    function mintToken(
        address token,
        uint64 amount,
        bytes[] memory metadata
    ) external returns (int responseCode, int64[] memory serialNumbers);

    function transferNFT(
        address token,
        address sender,
        address receiver,
        int64 serialNumber
    ) external returns (int responseCode);
}

/**
 * @title CreatorCashMarketplace
 * @dev Hedera NFT Marketplace using HTS precompiles for African creators
 * This contract enables creators to mint and sell NFTs with instant payouts
 */
contract CreatorCashMarketplace is ReentrancyGuard {
    // Hedera Token Service precompile address
    address constant HEDERA_TOKEN_SERVICE = address(0x167);

    // Data structure for NFT listings
    struct Listing {
        address token;
        int64 serialNumber;
        address payable seller;
        uint256 priceHBAR;
        bool sold;
    }

    // Data structure for NFT ownership tracking
    struct OwnedNFT {
        address token;
        int64 serialNumber;
        string metadataURI;
    }

    // Mapping of listings by token address and serial number
    mapping(bytes32 => Listing) public listings;
    
    // Mapping of token addresses to their creators
    mapping(address => address) public tokenCreators;
    
    // Array to store all listing keys for enumeration
    bytes32[] private listingKeys;

    // Events
    event CollectionCreated(address indexed creator, address indexed tokenAddress, string name, string symbol);
    event NFTMinted(address indexed creator, address indexed tokenAddress, int64 serialNumber, string metadataURI);
    event NFTListed(address indexed seller, address indexed tokenAddress, int64 serialNumber, uint256 priceHBAR);
    event NFTPurchased(address indexed buyer, address indexed tokenAddress, int64 serialNumber, uint256 priceHBAR);
    event NFTTransfer(address indexed from, address indexed to, address indexed tokenAddress, int64 serialNumber);

    /**
     * @dev Create a new NFT collection using HTS
     * @param name Name of the collection
     * @param symbol Symbol of the collection
     * @param metadataURI URI for collection metadata (IPFS recommended)
     * @param creator Address of the creator
     * @return tokenAddress Address of the newly created token
     */
    function createCollection(
        string memory name,
        string memory symbol,
        string memory metadataURI,
        address creator
    ) external returns (address tokenAddress) {
        // Create NFT collection using HTS precompile
        (int responseCode, address newTokenAddress) = IHederaTokenService(HEDERA_TOKEN_SERVICE)
            .createNonFungibleToken(
                creator, // Treasury is the creator
                name,
                symbol,
                metadataURI,
                false // freezeDefault
            );
        
        require(responseCode == 22, "Collection creation failed"); // 22 = SUCCESS
        
        tokenCreators[newTokenAddress] = creator;
        tokenAddress = newTokenAddress;
        
        emit CollectionCreated(creator, tokenAddress, name, symbol);
    }

    /**
     * @dev Mint a new NFT in an existing collection
     * @param token Address of the token collection
     * @param metadataURI URI for the NFT metadata (IPFS recommended)
     * @param creator Address of the creator
     * @return serialNumber Serial number of the minted NFT
     */
    function mintNFT(
        address token,
        string memory metadataURI,
        address creator
    ) external returns (int64 serialNumber) {
        // Only the creator can mint NFTs in their collection
        require(tokenCreators[token] == creator, "Only creator can mint");
        
        // Convert metadata URI to bytes for HTS
        bytes[] memory metadata = new bytes[](1);
        metadata[0] = bytes(metadataURI);
        
        // Mint NFT using HTS precompile
        (int responseCode, int64[] memory serialNumbers) = IHederaTokenService(HEDERA_TOKEN_SERVICE)
            .mintToken(
                token,
                1, // amount
                metadata
            );
        
        require(responseCode == 22, "Minting failed"); // 22 = SUCCESS
        require(serialNumbers.length > 0, "No serial numbers returned");
        
        serialNumber = serialNumbers[0];
        
        emit NFTMinted(creator, token, serialNumber, metadataURI);
        emit NFTTransfer(address(0), creator, token, serialNumber);
    }

    /**
     * @dev List an NFT for sale
     * @param token Address of the token
     * @param serialNumber Serial number of the NFT
     * @param priceHBAR Price in HBAR
     */
    function listNFT(
        address token,
        int64 serialNumber,
        uint256 priceHBAR
    ) external {
        // Transfer NFT to contract as escrow using HTS precompile
        (int response) = IHederaTokenService(HEDERA_TOKEN_SERVICE)
            .transferNFT(
                token,
                msg.sender, // sender is current owner
                address(this), // receiver is this contract
                serialNumber
            );
        
        require(response == 22, "Transfer to escrow failed"); // 22 = SUCCESS
        
        // Create listing
        bytes32 key = keccak256(abi.encodePacked(token, serialNumber));
        listings[key] = Listing({
            token: token,
            serialNumber: serialNumber,
            seller: payable(msg.sender),
            priceHBAR: priceHBAR,
            sold: false
        });
        
        // Store the key for enumeration
        listingKeys.push(key);
        
        emit NFTListed(msg.sender, token, serialNumber, priceHBAR);
    }

    /**
     * @dev Buy an NFT listed for sale
     * @param token Address of the token
     * @param serialNumber Serial number of the NFT
     */
    function buyNFT(address token, int64 serialNumber) external payable nonReentrant {
        bytes32 key = keccak256(abi.encodePacked(token, serialNumber));
        Listing storage listing = listings[key];

        // Validate listing
        require(!listing.sold, "NFT already sold");
        require(msg.value == listing.priceHBAR, "Incorrect payment");
        
        // Transfer NFT from contract escrow to buyer using HTS precompile
        (int response) = IHederaTokenService(HEDERA_TOKEN_SERVICE)
            .transferNFT(
                token,
                address(this), // sender is this contract (escrow)
                msg.sender, // receiver is buyer
                serialNumber
            );
        
        require(response == 22, "Transfer to buyer failed"); // 22 = SUCCESS

        // Pay creator
        listing.seller.transfer(msg.value);
        listing.sold = true;

        emit NFTPurchased(msg.sender, token, serialNumber, msg.value);
        emit NFTTransfer(address(this), msg.sender, token, serialNumber);
    }

    /**
     * @dev Get all active listings
     * @return activeListings Array of all unsold listings
     */
    function getAllListings() external view returns (Listing[] memory) {
        // Count active listings
        uint256 activeCount = 0;
        for (uint256 i = 0; i < listingKeys.length; i++) {
            bytes32 key = listingKeys[i];
            if (!listings[key].sold) {
                activeCount++;
            }
        }
        
        // Create array with exact size needed
        Listing[] memory activeListings = new Listing[](activeCount);
        uint256 currentIndex = 0;
        
        // Populate array with active listings
        for (uint256 i = 0; i < listingKeys.length; i++) {
            bytes32 key = listingKeys[i];
            if (!listings[key].sold) {
                activeListings[currentIndex] = listings[key];
                currentIndex++;
            }
        }
        
        return activeListings;
    }

    /**
     * @dev Get NFTs owned by a specific address
     * Note: This is a simplified version. In practice, off-chain indexing is recommended
     * for production applications as on-chain enumeration can be expensive.
     * @param owner Address of the owner
     * @return ownedNFTs Array of NFTs owned by the address
     */
    function getNFTsByOwner(address owner) external view returns (OwnedNFT[] memory) {
        // This is a placeholder implementation
        // In a real implementation, you would need to track ownership off-chain
        // or implement a more complex on-chain tracking mechanism
        OwnedNFT[] memory ownedNFTs = new OwnedNFT[](0);
        return ownedNFTs;
    }

    /**
     * @dev Transfer an NFT directly between users (not through marketplace)
     * @param token Address of the token
     * @param receiver Address of the receiver
     * @param serialNumber Serial number of the NFT
     */
    function transferNFT(
        address token,
        address receiver,
        int64 serialNumber
    ) external {
        // Transfer NFT using HTS precompile
        (int response) = IHederaTokenService(HEDERA_TOKEN_SERVICE)
            .transferNFT(
                token,
                msg.sender, // sender is current owner
                receiver, // receiver is specified address
                serialNumber
            );
        
        require(response == 22, "Transfer failed"); // 22 = SUCCESS
        
        emit NFTTransfer(msg.sender, receiver, token, serialNumber);
    }
}