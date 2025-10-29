import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, Info, Tag, Eye, CheckCircle } from 'lucide-react';
import NFTCard from '../ui/NFTCard';
import { MOCK_NFTS } from '../../constants';

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

    const nextStep = () => setStep(s => Math.min(s + 1, 5));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));
    
    const stepVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 },
    };

    const renderStep = () => {
        switch(step) {
            case 1: // Upload
                return (
                    <motion.div key={1} variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
                        <h2 className="font-heading text-3xl font-bold mb-2">Upload Your Creation</h2>
                        <p className="text-[var(--text-secondary)] mb-8">Supports JPG, PNG, GIF, MP3, MP4. Max 100MB.</p>
                        <div className="border-2 border-dashed border-[var(--border-color)] rounded-2xl p-12 text-center cursor-pointer hover:border-[var(--brand-gold)] hover:bg-[var(--border-color)] transition-colors">
                            <UploadCloud size={48} className="mx-auto text-[var(--text-secondary)] mb-4"/>
                            <p className="font-semibold">Drag & drop files here</p>
                            <p className="text-sm text-[var(--text-secondary)]">or click to browse</p>
                        </div>
                    </motion.div>
                );
            case 2: // Details
                 return (
                    <motion.div key={2} variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="w-full space-y-6">
                        <h2 className="font-heading text-3xl font-bold mb-2">Describe Your NFT</h2>
                        <p className="text-[var(--text-secondary)] mb-8">Add the metadata that brings your art to life.</p>
                        <div>
                            <label className="font-semibold text-sm">Title</label>
                            <input type="text" placeholder="e.g., Cybernetic Griot" className="w-full mt-2 bg-[var(--background)] border border-[var(--border-color)] p-3 rounded-lg focus:border-[var(--brand-green)] focus:ring-0 outline-none transition-colors"/>
                        </div>
                        <div>
                            <label className="font-semibold text-sm">Description</label>
                            <textarea placeholder="A short story about your creation..." rows={4} className="w-full mt-2 bg-[var(--background)] border border-[var(--border-color)] p-3 rounded-lg focus:border-[var(--brand-green)] focus:ring-0 outline-none transition-colors"></textarea>
                        </div>
                         <div>
                            <label className="font-semibold text-sm">Collection</label>
                            <input type="text" placeholder="e.g., Afro-Futures" className="w-full mt-2 bg-[var(--background)] border border-[var(--border-color)] p-3 rounded-lg focus:border-[var(--brand-green)] focus:ring-0 outline-none transition-colors"/>
                        </div>
                    </motion.div>
                );
            case 3: // Price
                return (
                    <motion.div key={3} variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="w-full space-y-6">
                        <h2 className="font-heading text-3xl font-bold mb-2">Set Your Price</h2>
                        <p className="text-[var(--text-secondary)] mb-8">Choose a fixed price for your NFT.</p>
                        <div className="relative">
                            <label className="font-semibold text-sm">Price in HBAR</label>
                            <input type="number" placeholder="1000" className="w-full mt-2 bg-[var(--background)] border border-[var(--border-color)] p-3 rounded-lg pr-16 focus:border-[var(--brand-green)] focus:ring-0 outline-none transition-colors"/>
                            <span className="absolute right-4 top-11 text-[var(--text-secondary)]">HBAR</span>
                        </div>
                        <p className="text-center text-[var(--text-secondary)]">~ $84.00 USD</p>
                        <div className="bg-[var(--background)] border border-[var(--border-color)] p-4 rounded-lg text-sm space-y-2">
                            <div className="flex justify-between"><span>Service Fee</span><span>2.5%</span></div>
                            <div className="flex justify-between"><span>Creator Royalty</span><span>10%</span></div>
                            <div className="flex justify-between font-bold"><span>You will receive</span><span>975 HBAR</span></div>
                        </div>
                    </motion.div>
                );
            case 4: // Preview & Mint
                return (
                     <motion.div key={4} variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
                        <h2 className="font-heading text-3xl font-bold mb-2">Preview & Mint</h2>
                        <p className="text-[var(--text-secondary)] mb-8">Review your NFT details before minting on Hedera.</p>
                        <div className="max-w-xs mx-auto">
                            <NFTCard nft={MOCK_NFTS[0]} />
                        </div>
                        <div className="mt-8 bg-[var(--background)] border border-[var(--border-color)] p-4 rounded-lg text-sm space-y-2 text-[var(--text-secondary)]">
                            <p>You are about to mint <span className="font-bold text-[var(--text-primary)]">"Cybernetic Griot"</span>.</p>
                             <p>This action is irreversible. A small network fee will apply.</p>
                        </div>
                    </motion.div>
                );
             case 5: // Success
                return (
                     <motion.div key={5} variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="w-full text-center">
                        <CheckCircle size={64} className="mx-auto text-[var(--brand-green)] mb-4"/>
                        <h2 className="font-heading text-3xl font-bold mb-2">Mint Successful!</h2>
                        <p className="text-[var(--text-secondary)] mb-8">Your NFT is now live on the CreatorCash marketplace.</p>
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
                     <button onClick={nextStep} className="px-8 py-3 text-white font-semibold bg-gradient-to-r from-[var(--brand-gold)] via-[var(--brand-green)] to-[var(--brand-blue)] rounded-2xl hover:opacity-90 transition-opacity duration-300 shadow-lg shadow-[var(--shadow-color-rgb)]/30">
                        {step === 4 ? 'Confirm & Mint' : 'Continue'}
                    </button>
                </div>
            )}
             {step === 5 && (
                 <div className="flex justify-center mt-8">
                    <button onClick={() => setStep(1)} className="px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-[var(--brand-gold)] via-[var(--brand-green)] to-[var(--brand-blue)] rounded-2xl hover:opacity-90 transition-opacity duration-300 shadow-lg shadow-[var(--shadow-color-rgb)]/30">
                        Mint Another
                    </button>
                </div>
            )}
        </div>
    </div>
  );
};

export default MintPage;