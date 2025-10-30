import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye, Tag } from 'lucide-react';
import { getAllListings, Listing, buyNFT } from '../../services/contractService';
import { getWalletState } from '../../services/walletService';

interface MarketplaceNFT {
  id: string;
  title: string;
  artist: string;
  artistAvatar: string;
  priceHBAR: number;
  priceUSD: number;
  imageUrl: string;
  collection: string;
  token: string;
  serialNumber: number;
}

const MarketplacePage: React.FC = () => {
  const [listings, setListings] = useState<MarketplaceNFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  // Mock NFT data for display when we can't fetch real data
  const mockNFTs: MarketplaceNFT[] = [
    { id: '1', title: 'Cybernetic Griot', artist: 'Adekunle', artistAvatar: 'https://picsum.photos/seed/a1/64', priceHBAR: 1250, priceUSD: 105.00, imageUrl: 'https://picsum.photos/seed/nft1/600/800', collection: 'Afro-Futures', token: '0x123...', serialNumber: 1 },
    { id: '2', title: 'Nairobi Sunrise', artist: 'Amina', artistAvatar: 'https://picsum.photos/seed/a2/64', priceHBAR: 800, priceUSD: 67.20, imageUrl: 'https://picsum.photos/seed/nft2/600/600', collection: 'Digital Savannah', token: '0x456...', serialNumber: 2 },
    { id: '3', title: 'Kinetic Mask', artist: 'Jabari', artistAvatar: 'https://picsum.photos/seed/a3/64', priceHBAR: 2500, priceUSD: 210.00, imageUrl: 'https://picsum.photos/seed/nft3/600/900', collection: 'Ancestral Tech', token: '0x789...', serialNumber: 3 },
    { id: '4', title: 'Lagosian Rhapsody', artist: 'Chidinma', artistAvatar: 'https://picsum.photos/seed/a4/64', priceHBAR: 1500, priceUSD: 126.00, imageUrl: 'https://picsum.photos/seed/nft4/800/600', collection: 'Urban Beats', token: '0xabc...', serialNumber: 4 },
    { id: '5', title: 'Hedera Bloom', artist: 'Kwame', artistAvatar: 'https://picsum.photos/seed/a5/64', priceHBAR: 3000, priceUSD: 252.00, imageUrl: 'https://picsum.photos/seed/nft5/600/700', collection: 'CryptoFlora', token: '0xdef...', serialNumber: 5 },
    { id: '6', title: 'Digital Adire', artist: 'Folake', artistAvatar: 'https://picsum.photos/seed/a6/64', priceHBAR: 950, priceUSD: 79.80, imageUrl: 'https://picsum.photos/seed/nft6/700/600', collection: 'Woven Code', token: '0x123...', serialNumber: 6 },
  ];

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      // Fetch actual listings from the contract
      const contractListings = await getAllListings();
      
      // Transform contract listings to our format
      const transformedListings: MarketplaceNFT[] = contractListings.map((listing: Listing, index: number) => ({
        id: `${listing.token}-${listing.serialNumber.toString()}`,
        title: `NFT #${listing.serialNumber.toString()}`,
        artist: listing.seller.substring(0, 6) + '...' + listing.seller.substring(listing.seller.length - 4),
        artistAvatar: `https://picsum.photos/seed/${index}/64`,
        priceHBAR: parseFloat(listing.priceHBAR.toString()),
        priceUSD: parseFloat(listing.priceHBAR.toString()) * 0.084,
        imageUrl: `https://picsum.photos/seed/nft${index}/600/800`,
        collection: 'Collection',
        token: listing.token,
        serialNumber: parseInt(listing.serialNumber.toString())
      }));
      
      setListings(transformedListings.length > 0 ? transformedListings : mockNFTs);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching listings:', err);
      // Fallback to mock data if there's an error
      setListings(mockNFTs);
      setError('Failed to fetch marketplace listings. Showing sample data.');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (nft: MarketplaceNFT) => {
    try {
      setPurchasing(nft.id);
      
      const walletState = getWalletState();
      if (!walletState.isConnected || !walletState.signer) {
        throw new Error('Please connect your wallet first');
      }
      
      // Call the contract function to buy the NFT
      const tx = await buyNFT(walletState.signer, nft.token, nft.serialNumber, nft.priceHBAR);
      await tx.wait();
      
      alert(`Successfully purchased ${nft.title} for ${nft.priceHBAR} HBAR!`);
      
      // Refresh listings after purchase
      fetchListings();
    } catch (err: any) {
      console.error('Purchase error:', err);
      alert(err.message || 'Failed to purchase NFT');
    } finally {
      setPurchasing(null);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 text-center">
        <h1 className="font-heading text-4xl font-bold mb-4">CreatorCash Marketplace</h1>
        <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
          Discover and collect unique digital assets from creators around the world. All NFTs are minted and traded on the Hedera network.
        </p>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-center">
          <p className="text-red-300">{error}</p>
          <button 
            onClick={fetchListings}
            className="mt-2 px-4 py-2 bg-red-500/30 hover:bg-red-500/50 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--brand-green)]"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {listings.map((nft) => (
              <motion.div
                key={nft.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="relative">
                  <img 
                    src={nft.imageUrl} 
                    alt={nft.title} 
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-[var(--background)]/80 backdrop-blur-sm rounded-full p-2">
                    <Eye size={16} className="text-[var(--text-primary)]" />
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-heading text-xl font-bold truncate">{nft.title}</h3>
                    <div className="flex items-center bg-[var(--background)] px-2 py-1 rounded-lg">
                      <Tag size={14} className="text-[var(--brand-green)] mr-1" />
                      <span className="text-sm font-semibold">{nft.priceHBAR} HBAR</span>
                    </div>
                  </div>
                  <p className="text-[var(--text-secondary)] text-sm mb-4">by {nft.artist}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs px-2 py-1 bg-[var(--border-color)] rounded-full">{nft.collection}</span>
                    <button
                      onClick={() => handlePurchase(nft)}
                      disabled={purchasing === nft.id}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--brand-gold)] via-[var(--brand-green)] to-[var(--brand-blue)] text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      <ShoppingCart size={16} />
                      {purchasing === nft.id ? 'Purchasing...' : 'Buy Now'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {listings.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-[var(--text-secondary)]">No listings available at the moment.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MarketplacePage;