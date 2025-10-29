import React, { useState, useEffect } from 'react';
import { usePage } from '../../App';
import { MOCK_NFTS } from '../../constants';
import type { NFT } from '../../types';
import { motion } from 'framer-motion';

const DetailPage: React.FC = () => {
    const { selectedNftId } = usePage();
    const [nft, setNft] = useState<NFT | null>(null);
    const [activeTab, setActiveTab] = useState('details');

    useEffect(() => {
        if (selectedNftId) {
            const foundNft = MOCK_NFTS.find(n => n.id === selectedNftId) || MOCK_NFTS[0];
            setNft(foundNft);
        } else {
            setNft(MOCK_NFTS[0]);
        }
    }, [selectedNftId]);

    if (!nft) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="aspect-[4/5] rounded-3xl overflow-hidden relative shadow-2xl shadow-[var(--shadow-color-rgb)]/20"
                >
                    <motion.img 
                        src={nft.imageUrl} 
                        alt={nft.title} 
                        className="absolute inset-0 w-full h-full object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.4 }}
                    />
                </motion.div>

                <div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <p className="text-[var(--brand-gold)] font-semibold">{nft.collection}</p>
                        <h1 className="font-heading text-4xl md:text-5xl font-bold my-3">{nft.title}</h1>
                        <div className="flex items-center space-x-3 text-lg">
                            <img src={nft.artistAvatar} alt={nft.artist} className="w-10 h-10 rounded-full"/>
                            <span className="text-[var(--text-secondary)]">Created by <span className="font-bold text-[var(--text-primary)]">{nft.artist}</span></span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="my-8 p-6 bg-[var(--card-bg)] backdrop-blur-md rounded-2xl border border-[var(--border-color)] shadow-lg shadow-[var(--shadow-color-rgb)]/10"
                    >
                        <p className="text-[var(--text-secondary)]">Current price</p>
                        <p className="text-4xl font-bold my-1">{nft.priceHBAR.toLocaleString()} HBAR</p>
                        <p className="text-[var(--text-secondary)]">${nft.priceUSD.toFixed(2)} USD</p>
                        <div className="flex flex-col sm:flex-row gap-4 mt-6">
                            <button className="w-full px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-[var(--brand-gold)] via-[var(--brand-green)] to-[var(--brand-blue)] rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[var(--shadow-color-rgb)]/40 hover:shadow-xl hover:shadow-[var(--brand-green)]/30">
                                Buy Now
                            </button>
                             <button className="w-full px-8 py-4 text-lg font-semibold text-[var(--text-primary)] bg-transparent border border-[var(--border-color)] rounded-2xl hover:border-[var(--brand-green)] transition-colors duration-300">
                                Make Offer
                            </button>
                        </div>
                    </motion.div>
                    
                     <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                     >
                        <div className="border-b border-[var(--border-color)] flex space-x-8">
                           {['Details', 'Creator', 'History'].map(tab => (
                               <button 
                                key={tab} 
                                onClick={() => setActiveTab(tab.toLowerCase())} 
                                className={`py-3 font-semibold relative transition-colors ${activeTab === tab.toLowerCase() ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                               >
                                   {tab}
                                   {activeTab === tab.toLowerCase() && <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--brand-gold)]" layoutId="tab-underline"/>}
                               </button>
                           ))}
                        </div>
                        <div className="py-6 text-sm">
                           {activeTab === 'details' && <div>
                                <p className="text-[var(--text-secondary)] leading-relaxed">This piece, part of the '{nft.collection}' collection, is a unique digital asset minted on the Hedera network. It represents a fusion of traditional African motifs with futuristic digital art techniques, a hallmark of {nft.artist}'s work.</p>
                                <div className="mt-4 space-y-2 text-[var(--text-secondary)]">
                                    <p><span className="font-semibold text-[var(--text-primary)]">Token ID:</span> 0.0.123456</p>
                                    <p><span className="font-semibold text-[var(--text-primary)]">Mint Hash:</span> 0xabc...def</p>
                                    <p><span className="font-semibold text-[var(--text-primary)]">Owner:</span> 0.0.987654</p>
                                </div>
                            </div>}
                             {activeTab === 'creator' && <div><p className="text-[var(--text-secondary)] leading-relaxed">{nft.artist} is a visionary digital artist from Lagos, Nigeria, known for their vibrant and dynamic explorations of Afro-futurism. Their work challenges perceptions and celebrates the rich tapestry of African culture in the digital age.</p></div>}
                             {activeTab === 'history' && <div><p className="text-[var(--text-secondary)]">Transaction history will be displayed here.</p></div>}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default DetailPage;