import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletConnectModal: React.FC<WalletConnectModalProps> = ({ isOpen, onClose }) => {
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 50 },
    // FIX: Corrected Framer Motion transition type error by casting `type` to a literal type.
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring' as const, damping: 20, stiffness: 200 } },
    exit: { opacity: 0, scale: 0.9, y: 50, transition: { duration: 0.2 } },
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
              <div className="space-y-4">
                <button className="w-full text-lg font-semibold py-4 bg-gradient-to-r from-[var(--brand-gold)] via-[var(--brand-green)] to-[var(--brand-blue)] text-white rounded-2xl hover:opacity-90 transition-opacity duration-300 shadow-lg shadow-[var(--shadow-color-rgb)]/30 transform hover:scale-105">
                  Connect HashPack
                </button>
                <button className="w-full text-lg font-semibold py-4 bg-[var(--border-color)] text-[var(--text-primary)] rounded-2xl hover:bg-[var(--border-color)]/50 transition-colors duration-300">
                  Connect Wallet
                </button>
                <button onClick={onClose} className="w-full text-lg font-semibold py-4 bg-transparent text-[var(--text-secondary)] rounded-2xl hover:bg-[var(--border-color)] transition-colors duration-300">
                  Try Demo Mode
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WalletConnectModal;