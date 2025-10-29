import React from 'react';
import { usePage } from '../../App';
import { Twitter, Instagram, Send } from 'lucide-react';
import { Logo } from './Logo';

const Footer: React.FC = () => {
  const { setCurrentPage } = usePage();

  return (
    <footer className="bg-[var(--card-bg)] border-t border-[var(--border-color)] mt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <button onClick={() => setCurrentPage('home')} className="flex items-center space-x-2">
              <Logo className="h-9 w-9" />
              <span className="text-2xl font-bold font-heading">CreatorCash</span>
            </button>
            <p className="text-sm text-[var(--text-secondary)]">The African Creative Renaissance on Hedera.</p>
            <div className="flex space-x-4 pt-2">
                <a href="#" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"><Twitter size={20}/></a>
                <a href="#" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"><Instagram size={20}/></a>
                <a href="#" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"><Send size={20}/></a>
            </div>
          </div>

          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div>
                <h3 className="font-heading font-semibold tracking-wider text-[var(--text-primary)]">Marketplace</h3>
                <ul className="mt-4 space-y-3">
                  <li><button onClick={() => setCurrentPage('explore')} className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Art</button></li>
                  <li><button onClick={() => setCurrentPage('explore')} className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Music</button></li>
                  <li><button onClick={() => setCurrentPage('explore')} className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Collections</button></li>
                </ul>
              </div>
               <div>
                <h3 className="font-heading font-semibold tracking-wider text-[var(--text-primary)]">Resources</h3>
                <ul className="mt-4 space-y-3">
                  <li><button onClick={() => setCurrentPage('about')} className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">About Us</button></li>
                  <li><a href="#" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Docs</a></li>
                   <li><a href="#" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Contact</a></li>
                </ul>
              </div>
               <div>
                <h3 className="font-heading font-semibold tracking-wider text-[var(--text-primary)]">My Account</h3>
                <ul className="mt-4 space-y-3">
                  <li><button onClick={() => setCurrentPage('dashboard')} className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Dashboard</button></li>
                  <li><button onClick={() => setCurrentPage('mint')} className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Mint NFT</button></li>
                </ul>
              </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-[var(--border-color)] text-center text-xs text-[var(--text-secondary)]/70">
          <p>&copy; {new Date().getFullYear()} CreatorCash. All Rights Reserved. Built on Hedera.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;