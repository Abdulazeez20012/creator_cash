import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, HelpCircle, RefreshCw, AlertTriangle, Key } from 'lucide-react';
import { connectWallet, disconnectWallet, manualWalletConnect } from '../../services/walletService';

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWalletConnected: (address: string) => void;
}

const WalletConnectModal: React.FC<WalletConnectModalProps> = ({ isOpen, onClose, onWalletConnected }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [showManualConnect, setShowManualConnect] = useState(false);

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 50 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring' as const, damping: 20, stiffness: 200 } },
    exit: { opacity: 0, scale: 0.9, y: 50, transition: { duration: 0.2 } },
  };

  const handleWalletConnect = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      const walletState = await connectWallet();
      if (walletState.isConnected && walletState.address) {
        onWalletConnected(walletState.address);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect to wallet');
      console.error('Wallet connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleManualConnect = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      const walletState = await manualWalletConnect();
      if (walletState.isConnected && walletState.address) {
        onWalletConnected(walletState.address);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect manually');
      console.error('Manual wallet connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleInstallHashPack = () => {
    window.open('https://www.hashpack.app/', '_blank');
  };

  const toggleHelp = () => {
    setShowHelp(!showHelp);
  };

  const toggleManualConnect = () => {
    setShowManualConnect(!showManualConnect);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[var(--card-bg)] dark:bg-gradient-to-br from-[var(--card-bg)] to-[var(--background-gradient-start)] border border-[var(--border-color)] rounded-3xl w-full max-w-md p-8 shadow-2xl shadow-[var(--shadow-color-rgb)]/20"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              <X size={24} />
            </button>
            <div className="text-center">
               <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[var(--brand-green)] to-[var(--brand-gold)] rounded-full flex items-center justify-center animate-pulse">
                   <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 48C37.2548 48 48 37.2548 48 24C48 10.7452 37.2548 0 24 0C10.7452 0 0 10.7452 0 24C0 37.2548 10.7452 48 24 48Z" fill="white"></path><path d="M24 36C30.6274 36 36 30.6274 36 24C36 17.3726 30.6274 12 24 12C17.3726 12 12 17.3726 12 24C12 30.6274 17.3726 36 24 36Z" fill="#002B36"></path></svg>
                </div>
               </div>
              <h2 className="text-2xl font-bold font-heading mb-2">Connect Your Wallet</h2>
              <p className="text-[var(--text-secondary)] mb-8">Choose your preferred Hedera wallet to continue.</p>
              
              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                    <div className="text-left">
                      <p className="font-semibold mb-1">Connection Failed</p>
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                <button 
                  onClick={handleWalletConnect}
                  disabled={isConnecting}
                  className="w-full text-lg font-semibold py-4 bg-gradient-to-r from-[var(--brand-gold)] via-[var(--brand-green)] to-[var(--brand-blue)] text-white rounded-2xl hover:opacity-90 transition-opacity duration-300 shadow-lg shadow-[var(--shadow-color-rgb)]/30 transform hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isConnecting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      Connecting...
                    </>
                  ) : 'Connect Wallet'}
                </button>
                
                <button 
                  onClick={handleManualConnect}
                  disabled={isConnecting}
                  className="w-full text-lg font-semibold py-4 bg-[var(--border-color)] text-[var(--text-primary)] rounded-2xl hover:bg-[var(--border-color)]/50 transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <Key size={20} />
                  Manual Connect
                </button>
                
                <button 
                  onClick={handleInstallHashPack}
                  className="w-full text-lg font-semibold py-4 bg-[var(--border-color)] text-[var(--text-primary)] rounded-2xl hover:bg-[var(--border-color)]/50 transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  Install HashPack <ExternalLink size={20} />
                </button>
                
                <button 
                  onClick={handleRefresh}
                  className="w-full text-lg font-semibold py-4 bg-[var(--border-color)] text-[var(--text-primary)] rounded-2xl hover:bg-[var(--border-color)]/50 transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <RefreshCw size={20} />
                  Refresh Page
                </button>
                
                <button 
                  onClick={toggleHelp}
                  className="w-full text-lg font-semibold py-4 bg-transparent text-[var(--text-secondary)] rounded-2xl hover:bg-[var(--border-color)] transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <HelpCircle size={20} />
                  Troubleshooting Help
                </button>
                
                <button onClick={onClose} className="w-full text-lg font-semibold py-4 bg-transparent text-[var(--text-secondary)] rounded-2xl hover:bg-[var(--border-color)] transition-colors duration-300">
                  Try Demo Mode
                </button>
              </div>
              
              {showHelp && (
                <div className="mt-6 p-4 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-left text-sm">
                  <h3 className="font-bold mb-2 flex items-center gap-2">
                    <HelpCircle size={16} />
                    Troubleshooting Steps
                  </h3>
                  <ol className="list-decimal list-inside space-y-2">
                    <li><strong>Refresh Page:</strong> Click the "Refresh Page" button above</li>
                    <li><strong>Check Extension:</strong> Ensure HashPack is enabled in Chrome Extensions</li>
                    <li><strong>Unlock Wallet:</strong> Open HashPack and enter your password if locked</li>
                    <li><strong>Restart Browser:</strong> Completely close and reopen Chrome</li>
                    <li><strong>Clear Cache:</strong> Clear browser cache for localhost</li>
                  </ol>
                  <p className="mt-3 text-xs text-[var(--text-secondary)]">
                    <strong>Note:</strong> HashPack must be installed and configured before it can be detected.
                  </p>
                </div>
              )}
              
              <div className="mt-6 text-xs text-[var(--text-secondary)]">
                <p>Having trouble? Try the "Manual Connect" option if you know your account ID.</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WalletConnectModal;