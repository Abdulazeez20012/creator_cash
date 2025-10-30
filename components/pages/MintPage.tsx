import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, Info, Tag, Eye, CheckCircle } from 'lucide-react';
import { utils } from 'ethers';
import NFTCard from '../ui/NFTCard';
import { MOCK_NFTS } from '../../constants';
import { getWalletState, canPerformTransactions, hederaToEthereumAddress } from '../../services/walletService';
import { mintNFT, listNFT } from '../../services/contractService';

const MintProgressBar: React.FC<{ step: number }> = ({ step }) => {
    const steps = ['Upload', 'Details', 'Price', 'Mint'];
    return (
        <div className="w-full mb-12">
            <div className="flex justify-between items-center relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[var(--border-color)] transform -translate-y-1/2"></div>
                <div className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-[var(--brand-gold)] via-[var(--brand-green)] to-[var(--brand-blue)] transform -translate-y-1/2"
                     style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%`, transition: 'width 0.5s ease-out' }}></div>

                {steps.map((label, index) => (
                    <div key={label} className="relative z-10 flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                            step > index + 1 ? 'bg-[var(--brand-green)] border-[var(--brand-green)] text-white' : 
                            step === index + 1 ? 'border-[var(--brand-gold)] bg-[var(--background)]' : 'border-[var(--border-color)] bg-[var(--background)] text-[var(--text-secondary)]'
                        }`}>
                            {step > index + 1 ? <CheckCircle size={20}/> : (index === 0 ? <UploadCloud/> : index === 1 ? <Info/> : index === 2 ? <Tag/> : <Eye/>)}
                        </div>
                        <span className={`mt-2 text-xs font-semibold ${step >= index + 1 ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>{label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const MintPage: React.FC = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        collection: '',
        priceHBAR: '',
        file: null as File | null,
        previewUrl: '',
    });
    const [isMinting, setIsMinting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [mintedToken, setMintedToken] = useState<string | null>(null);
    const [mintedSerialNumber, setMintedSerialNumber] = useState<string | null>(null);
    const [transactionHash, setTransactionHash] = useState<string | null>(null);

    const nextStep = () => setStep(s => Math.min(s + 1, 5));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));
    
    const stepVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 },
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData(prev => ({
                ...prev,
                file,
                previewUrl: URL.createObjectURL(file)
            }));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleMintNFT = async () => {
        try {
            setIsMinting(true);
            setError(null);
            
            const walletState = getWalletState();
            if (!walletState.isConnected || !walletState.signer) {
                throw new Error('Please connect your wallet first');
            }
            
            if (!walletState.address) {
                throw new Error('Wallet address not found');
            }
            
            // Validate form data
            if (!formData.title || !formData.collection) {
                throw new Error('Please fill in all required fields');
            }
            
            // Check if wallet can perform transactions
            if (!canPerformTransactions()) {
                throw new Error('Current connection cannot perform transactions. Please use HashPack wallet for full functionality.');
            }
            
            // For a real implementation, we would:
            // 1. Upload the file to IPFS or another storage solution
            // 2. Create metadata JSON with the file URL and other details
            // 3. Upload the metadata to IPFS
            // 4. Call mintNFT with the metadata URI
            
            // For demo purposes, we'll use a mock metadata URI
            const mockMetadataURI = "https://example.com/metadata.json";
            
            // Use the contract address as the token address to avoid ENS resolution errors
            // In a real implementation, this would be the actual token address of the selected collection
            const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS || '0x96e441f5Db0E0C082674F8B24De9Bb37375bBc15';
            const collectionTokenAddress = contractAddress;
            
            // Convert Hedera address to Ethereum address to avoid ENS resolution errors
            const creatorAddress = hederaToEthereumAddress(walletState.address);
            
            // Validate addresses to ensure they're in proper Ethereum format
            if (!utils.isAddress(collectionTokenAddress)) {
                throw new Error('Invalid token address format');
            }
            
            if (!utils.isAddress(creatorAddress)) {
                throw new Error('Invalid creator address format');
            }
            
            // Call the actual mintNFT function
            console.log('Minting NFT with parameters:', {
                token: collectionTokenAddress,
                metadataURI: mockMetadataURI,
                creator: creatorAddress
            });
            
            // In a real implementation, you would:
            const tx = await mintNFT(walletState.signer, collectionTokenAddress, mockMetadataURI, creatorAddress);
            await tx.wait();
            setTransactionHash(tx.hash);
            
            // For now, we'll simulate the minting process since we don't have the actual collection token
            // await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Mock successful mint
            setMintedToken("0.0.123456"); // Mock token address
            setMintedSerialNumber("1"); // Mock serial number
            
            setSuccess(true);
            nextStep();
        } catch (err: any) {
            console.error('Minting error:', err);
            setError(err.message || 'Failed to mint NFT');
        } finally {
            setIsMinting(false);
        }
    };

    const renderStep = () => {
        switch(step) {
            case 1: // Upload
                return (
                    <motion.div key={1} variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
                        <h2 className="font-heading text-3xl font-bold mb-2">Upload Your Creation</h2>
                        <p className="text-[var(--text-secondary)] mb-8">Supports JPG, PNG, GIF, MP3, MP4. Max 100MB.</p>
                        <div className="border-2 border-dashed border-[var(--border-color)] rounded-2xl p-12 text-center cursor-pointer hover:border-[var(--brand-gold)] hover:bg-[var(--border-color)] transition-colors">
                            <input 
                                type="file" 
                                onChange={handleFileChange}
                                className="hidden" 
                                id="file-upload"
                                accept="image/*,audio/*,video/*"
                            />
                            <label htmlFor="file-upload" className="cursor-pointer">
                                {formData.previewUrl ? (
                                    <div className="relative">
                                        <img src={formData.previewUrl} alt="Preview" className="mx-auto max-h-64 rounded-lg" />
                                        <p className="mt-4 font-semibold">Click to change file</p>
                                    </div>
                                ) : (
                                    <>
                                        <UploadCloud size={48} className="mx-auto text-[var(--text-secondary)] mb-4"/>
                                        <p className="font-semibold">Drag & drop files here</p>
                                        <p className="text-sm text-[var(--text-secondary)]">or click to browse</p>
                                    </>
                                )}
                            </label>
                        </div>
                    </motion.div>
                );
            case 2: // Details
                 return (
                    <motion.div key={2} variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="w-full space-y-6">
                        <h2 className="font-heading text-3xl font-bold mb-2">Describe Your NFT</h2>
                        <p className="text-[var(--text-secondary)] mb-8">Add the metadata that brings your art to life.</p>
                        <div>
                            <label className="font-semibold text-sm">Title *</label>
                            <input 
                                type="text" 
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g., Cybernetic Griot" 
                                className="w-full mt-2 bg-[var(--background)] border border-[var(--border-color)] p-3 rounded-lg focus:border-[var(--brand-green)] focus:ring-0 outline-none transition-colors"
                                required
                            />
                        </div>
                        <div>
                            <label className="font-semibold text-sm">Description</label>
                            <textarea 
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="A short story about your creation..." 
                                rows={4} 
                                className="w-full mt-2 bg-[var(--background)] border border-[var(--border-color)] p-3 rounded-lg focus:border-[var(--brand-green)] focus:ring-0 outline-none transition-colors"
                            ></textarea>
                        </div>
                         <div>
                            <label className="font-semibold text-sm">Collection *</label>
                            <input 
                                type="text" 
                                name="collection"
                                value={formData.collection}
                                onChange={handleChange}
                                placeholder="e.g., Afro-Futures" 
                                className="w-full mt-2 bg-[var(--background)] border border-[var(--border-color)] p-3 rounded-lg focus:border-[var(--brand-green)] focus:ring-0 outline-none transition-colors"
                                required
                            />
                        </div>
                    </motion.div>
                );
            case 3: // Price
                return (
                    <motion.div key={3} variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="w-full space-y-6">
                        <h2 className="font-heading text-3xl font-bold mb-2">Set Your Price</h2>
                        <p className="text-[var(--text-secondary)] mb-8">Choose a fixed price for your NFT.</p>
                        <div className="relative">
                            <label className="font-semibold text-sm">Price in HBAR *</label>
                            <input 
                                type="number" 
                                name="priceHBAR"
                                value={formData.priceHBAR}
                                onChange={handleChange}
                                placeholder="1000" 
                                className="w-full mt-2 bg-[var(--background)] border border-[var(--border-color)] p-3 rounded-lg pr-16 focus:border-[var(--brand-green)] focus:ring-0 outline-none transition-colors"
                                required
                            />
                            <span className="absolute right-4 top-11 text-[var(--text-secondary)]">HBAR</span>
                        </div>
                        <p className="text-center text-[var(--text-secondary)]">~ ${(parseFloat(formData.priceHBAR || '0') * 0.084).toFixed(2)} USD</p>
                        <div className="bg-[var(--background)] border border-[var(--border-color)] p-4 rounded-lg text-sm space-y-2">
                            <div className="flex justify-between"><span>Service Fee</span><span>2.5%</span></div>
                            <div className="flex justify-between"><span>Creator Royalty</span><span>10%</span></div>
                            <div className="flex justify-between font-bold"><span>You will receive</span><span>{(parseFloat(formData.priceHBAR || '0') * 0.875).toFixed(2)} HBAR</span></div>
                        </div>
                    </motion.div>
                );
            case 4: // Preview & Mint
                return (
                     <motion.div key={4} variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
                        <h2 className="font-heading text-3xl font-bold mb-2">Preview & Mint</h2>
                        <p className="text-[var(--text-secondary)] mb-8">Review your NFT details before minting on Hedera.</p>
                        
                        {error && (
                            <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                                {error}
                            </div>
                        )}
                        
                        <div className="max-w-xs mx-auto">
                            {formData.previewUrl ? (
                                <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl overflow-hidden">
                                    <img src={formData.previewUrl} alt="Preview" className="w-full h-64 object-cover" />
                                    <div className="p-4">
                                        <h3 className="font-heading text-lg font-bold truncate">{formData.title || 'Untitled'}</h3>
                                        <p className="text-[var(--text-secondary)] text-sm mt-1">{formData.collection || 'No collection'}</p>
                                        <div className="flex justify-between items-center mt-3">
                                            <span className="text-sm font-semibold">{formData.priceHBAR || '0'} HBAR</span>
                                            <span className="text-xs text-[var(--text-secondary)]">~ ${(parseFloat(formData.priceHBAR || '0') * 0.084).toFixed(2)} USD</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <NFTCard nft={MOCK_NFTS[0]} />
                            )}
                        </div>
                        <div className="mt-8 bg-[var(--background)] border border-[var(--border-color)] p-4 rounded-lg text-sm space-y-2 text-[var(--text-secondary)]">
                            <p>You are about to mint <span className="font-bold text-[var(--text-primary)]">"{formData.title || 'Untitled'}"</span>.</p>
                             <p>This action is irreversible. A small network fee will apply.</p>
                             {!canPerformTransactions() && (
                                <p className="text-red-400 font-semibold">⚠️ Current connection cannot perform transactions. Please use HashPack wallet for full functionality.</p>
                            )}
                        </div>
                    </motion.div>
                );
             case 5: // Success
                return (
                     <motion.div key={5} variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="w-full text-center">
                        <CheckCircle size={64} className="mx-auto text-[var(--brand-green)] mb-4"/>
                        <h2 className="font-heading text-3xl font-bold mb-2">Mint Successful!</h2>
                        <p className="text-[var(--text-secondary)] mb-4">Your NFT is now live on the CreatorCash marketplace.</p>
                        {mintedToken && mintedSerialNumber && (
                            <div className="bg-[var(--background)] border border-[var(--border-color)] p-4 rounded-lg text-sm mt-4">
                                <p>Token: <span className="font-mono">{mintedToken}</span></p>
                                <p>Serial Number: <span className="font-mono">{mintedSerialNumber}</span></p>
                                {transactionHash && (
                                    <p className="mt-2">Transaction: <span className="font-mono text-xs">{transactionHash.substring(0, 10)}...{transactionHash.substring(transactionHash.length - 8)}</span></p>
                                )}
                            </div>
                        )}
                    </motion.div>
                );
            default: return null;
        }
    }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto">
            <MintProgressBar step={step}/>
            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] backdrop-blur-md rounded-2xl p-8 min-h-[450px] flex items-center justify-center shadow-lg shadow-[var(--shadow-color-rgb)]/10">
                <AnimatePresence mode="wait">
                    {renderStep()}
                </AnimatePresence>
            </div>
            {step < 5 && (
                 <div className="flex justify-between mt-8">
                    <button onClick={prevStep} disabled={step === 1} className="px-6 py-3 text-[var(--text-primary)] bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl hover:border-[var(--brand-green)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        Back
                    </button>
                     <button 
                        onClick={step === 4 ? handleMintNFT : nextStep}
                        disabled={
                            (step === 1 && !formData.file) || 
                            (step === 2 && (!formData.title || !formData.collection)) || 
                            (step === 3 && !formData.priceHBAR) ||
                            (step === 4 && isMinting) ||
                            (step === 4 && !canPerformTransactions())
                        }
                        className="px-8 py-3 text-white font-semibold bg-gradient-to-r from-[var(--brand-gold)] via-[var(--brand-green)] to-[var(--brand-blue)] rounded-2xl hover:opacity-90 transition-opacity duration-300 shadow-lg shadow-[var(--shadow-color-rgb)]/30 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {step === 4 ? (
                            isMinting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                    Minting...
                                </>
                            ) : 'Confirm & Mint'
                        ) : 'Continue'}
                    </button>
                </div>
            )}
             {step === 5 && (
                 <div className="flex justify-center mt-8">
                    <button 
                        onClick={() => {
                            setStep(1);
                            setFormData({
                                title: '',
                                description: '',
                                collection: '',
                                priceHBAR: '',
                                file: null,
                                previewUrl: '',
                            });
                            setSuccess(false);
                            setMintedToken(null);
                            setMintedSerialNumber(null);
                            setTransactionHash(null);
                        }}
                        className="px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-[var(--brand-gold)] via-[var(--brand-green)] to-[var(--brand-blue)] rounded-2xl hover:opacity-90 transition-opacity duration-300 shadow-lg shadow-[var(--shadow-color-rgb)]/30"
                    >
                        Mint Another
                    </button>
                </div>
            )}
        </div>
    </div>
  );
};

export default MintPage;