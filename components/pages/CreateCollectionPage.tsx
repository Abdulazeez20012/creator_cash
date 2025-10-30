import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, CheckCircle } from 'lucide-react';
import { getWalletState } from '../../services/walletService';
import { createCollection } from '../../services/contractService';

const CreateCollectionPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    description: '',
    royaltyPercentage: 10,
    coverImage: '',
  });
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));
  
  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateCollection = async () => {
    try {
      setIsCreating(true);
      setError(null);
      
      const walletState = getWalletState();
      if (!walletState.isConnected || !walletState.signer) {
        throw new Error('Please connect your wallet first');
      }
      
      if (!walletState.address) {
        throw new Error('Wallet address not found');
      }
      
      // In a real implementation, we would call the contract function
      // await createCollection(
      //   walletState.signer,
      //   formData.name,
      //   formData.symbol,
      //   formData.coverImage, // This would be the metadata URI
      //   walletState.address
      // );
      
      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
    } catch (err: any) {
      console.error('Collection creation error:', err);
      setError(err.message || 'Failed to create collection');
    } finally {
      setIsCreating(false);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1: // Collection Details
        return (
          <motion.div key={1} variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="w-full space-y-6">
            <h2 className="font-heading text-3xl font-bold mb-2">Collection Details</h2>
            <p className="text-[var(--text-secondary)] mb-8">Tell us about your NFT collection.</p>
            
            <div>
              <label className="font-semibold text-sm">Collection Name *</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Afro-Futures" 
                className="w-full mt-2 bg-[var(--background)] border border-[var(--border-color)] p-3 rounded-lg focus:border-[var(--brand-green)] focus:ring-0 outline-none transition-colors"
                required
              />
            </div>
            
            <div>
              <label className="font-semibold text-sm">Collection Symbol *</label>
              <input 
                type="text" 
                name="symbol"
                value={formData.symbol}
                onChange={handleChange}
                placeholder="e.g., AFUT" 
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
                placeholder="Describe your collection..." 
                rows={4} 
                className="w-full mt-2 bg-[var(--background)] border border-[var(--border-color)] p-3 rounded-lg focus:border-[var(--brand-green)] focus:ring-0 outline-none transition-colors"
              ></textarea>
            </div>
          </motion.div>
        );
        
      case 2: // Royalties & Cover Image
        return (
          <motion.div key={2} variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="w-full space-y-6">
            <h2 className="font-heading text-3xl font-bold mb-2">Royalties & Cover</h2>
            <p className="text-[var(--text-secondary)] mb-8">Set your creator royalties and upload a cover image.</p>
            
            <div>
              <label className="font-semibold text-sm">Royalty Percentage</label>
              <div className="flex items-center mt-2">
                <input 
                  type="range" 
                  name="royaltyPercentage"
                  min="0"
                  max="20"
                  value={formData.royaltyPercentage}
                  onChange={handleChange}
                  className="w-full h-2 bg-[var(--border-color)] rounded-lg appearance-none cursor-pointer"
                />
                <span className="ml-4 w-12 text-center font-semibold">{formData.royaltyPercentage}%</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-2">You'll earn this percentage every time an NFT from this collection is sold.</p>
            </div>
            
            <div>
              <label className="font-semibold text-sm">Cover Image</label>
              <div className="border-2 border-dashed border-[var(--border-color)] rounded-2xl p-8 text-center cursor-pointer hover:border-[var(--brand-gold)] hover:bg-[var(--border-color)] transition-colors mt-2">
                {formData.coverImage ? (
                  <img src={formData.coverImage} alt="Cover" className="mx-auto h-32 object-contain" />
                ) : (
                  <>
                    <UploadCloud size={48} className="mx-auto text-[var(--text-secondary)] mb-4"/>
                    <p className="font-semibold">Upload Cover Image</p>
                    <p className="text-sm text-[var(--text-secondary)]">JPG, PNG, GIF. Max 10MB.</p>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        );
        
      case 3: // Review & Create
        return (
          <motion.div key={3} variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
            <h2 className="font-heading text-3xl font-bold mb-2">Review & Create</h2>
            <p className="text-[var(--text-secondary)] mb-8">Review your collection details before creating on Hedera.</p>
            
            {error && (
              <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}
            
            {success ? (
              <div className="text-center py-8">
                <CheckCircle size={64} className="mx-auto text-[var(--brand-green)] mb-4"/>
                <h3 className="font-heading text-2xl font-bold mb-2">Collection Created!</h3>
                <p className="text-[var(--text-secondary)] mb-6">Your collection has been successfully created on the Hedera network.</p>
                <button 
                  onClick={() => {
                    setStep(1);
                    setFormData({
                      name: '',
                      symbol: '',
                      description: '',
                      royaltyPercentage: 10,
                      coverImage: '',
                    });
                    setSuccess(false);
                  }}
                  className="px-6 py-3 text-white font-semibold bg-gradient-to-r from-[var(--brand-gold)] via-[var(--brand-green)] to-[var(--brand-blue)] rounded-2xl hover:opacity-90 transition-opacity duration-300"
                >
                  Create Another Collection
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-[var(--background)] border border-[var(--border-color)] rounded-xl p-6">
                  <h3 className="font-heading text-xl font-bold mb-4">Collection Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-[var(--text-secondary)]">Name</span>
                      <span className="font-semibold">{formData.name || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-secondary)]">Symbol</span>
                      <span className="font-semibold">{formData.symbol || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-secondary)]">Royalty</span>
                      <span className="font-semibold">{formData.royaltyPercentage}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[var(--background)] border border-[var(--border-color)] rounded-xl p-6">
                  <h3 className="font-heading text-xl font-bold mb-4">Description</h3>
                  <p className="text-[var(--text-secondary)]">
                    {formData.description || 'No description provided'}
                  </p>
                </div>
                
                <div className="bg-[var(--background)] border border-[var(--border-color)] rounded-xl p-6">
                  <h3 className="font-heading text-xl font-bold mb-4">Cover Image</h3>
                  {formData.coverImage ? (
                    <img src={formData.coverImage} alt="Cover" className="w-full h-48 object-cover rounded-lg" />
                  ) : (
                    <p className="text-[var(--text-secondary)] text-center py-8">No cover image uploaded</p>
                  )}
                </div>
                
                <div className="bg-[var(--background)] border border-[var(--border-color)] rounded-xl p-4 text-sm text-[var(--text-secondary)]">
                  <p>Creating this collection will require a small network fee. This action is irreversible once confirmed.</p>
                </div>
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
        <div className="w-full mb-12">
          <div className="flex justify-between items-center relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[var(--border-color)] transform -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-[var(--brand-gold)] via-[var(--brand-green)] to-[var(--brand-blue)] transform -translate-y-1/2"
                 style={{ width: `${((step - 1) / 2) * 100}%`, transition: 'width 0.5s ease-out' }}></div>

            {['Details', 'Royalties', 'Create'].map((label, index) => (
              <div key={label} className="relative z-10 flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  step > index + 1 ? 'bg-[var(--brand-green)] border-[var(--brand-green)] text-white' : 
                  step === index + 1 ? 'border-[var(--brand-gold)] bg-[var(--background)]' : 'border-[var(--border-color)] bg-[var(--background)] text-[var(--text-secondary)]'
                }`}>
                  {step > index + 1 ? <CheckCircle size={20}/> : index + 1}
                </div>
                <span className={`mt-2 text-xs font-semibold ${step >= index + 1 ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>{label}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] backdrop-blur-md rounded-2xl p-8 min-h-[450px] flex items-center justify-center shadow-lg shadow-[var(--shadow-color-rgb)]/10">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>
        
        {!success && (
          <div className="flex justify-between mt-8">
            <button 
              onClick={prevStep} 
              disabled={step === 1} 
              className="px-6 py-3 text-[var(--text-primary)] bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl hover:border-[var(--brand-green)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Back
            </button>
            
            {step < 3 ? (
              <button 
                onClick={nextStep}
                disabled={!formData.name || !formData.symbol}
                className="px-8 py-3 text-white font-semibold bg-gradient-to-r from-[var(--brand-gold)] via-[var(--brand-green)] to-[var(--brand-blue)] rounded-2xl hover:opacity-90 transition-opacity duration-300 shadow-lg shadow-[var(--shadow-color-rgb)]/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            ) : (
              <button 
                onClick={handleCreateCollection}
                disabled={isCreating}
                className="px-8 py-3 text-white font-semibold bg-gradient-to-r from-[var(--brand-gold)] via-[var(--brand-green)] to-[var(--brand-blue)] rounded-2xl hover:opacity-90 transition-opacity duration-300 shadow-lg shadow-[var(--shadow-color-rgb)]/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    Creating...
                  </>
                ) : 'Create Collection'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateCollectionPage;