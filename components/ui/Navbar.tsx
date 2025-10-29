import React, { useState, useEffect } from 'react';
import { usePage, useTheme } from '../../App';
import type { Page } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Logo } from './Logo';

interface NavbarProps {
  onConnectWallet: () => void;
}

const NavLink: React.FC<{ page: Page; children: React.ReactNode }> = ({ page, children }) => {
  const { currentPage, setCurrentPage } = usePage();
  const isActive = currentPage === page;
  return (
    <button
      onClick={() => setCurrentPage(page)}
      className={`relative px-3 py-2 text-sm font-medium transition-colors duration-300 ${
        isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
      }`}
    >
      {children}
      {isActive && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--brand-gold)] via-[var(--brand-green)] to-[var(--brand-blue)]"
          layoutId="underline"
        />
      )}
    </button>
  );
};

const MobileNavLink: React.FC<{ page: Page; children: React.ReactNode; onClick: () => void }> = ({ page, children, onClick }) => {
  const { setCurrentPage } = usePage();
  return (
    <button
      onClick={() => {
        setCurrentPage(page);
        onClick();
      }}
      className="block w-full text-left py-4 text-3xl font-heading"
    >
      {children}
    </button>
  );
};

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    const sunRays = [0, 45, 90, 135, 180, 225, 270, 315].map(rot => ({
        rot,
        path: "M 12 4 L 12 1",
        variants: {
            dark: { opacity: 0, scale: 0.5 },
            light: { opacity: 1, scale: 1 }
        }
    }));

    const moonCraters = [
      { cx: 16, cy: 8, r: 1.5 },
      { cx: 12, cy: 17, r: 1 },
      { cx: 18, cy: 16, r: 0.75 },
    ].map(crater => ({
      ...crater,
      variants: {
        dark: { opacity: 1 },
        light: { opacity: 0 }
      }
    }));
    
    return (
        <motion.button 
          onClick={toggleTheme} 
          className="relative w-10 h-10 flex items-center justify-center rounded-full text-[var(--text-primary)] hover:bg-[var(--border-color)] transition-colors"
          aria-label={isDark ? "Activate light mode" : "Activate dark mode"}
          whileHover={{ scale: 1.1 }}
          style={{ filter: `drop-shadow(0 0 3px var(--accent-color))` }}
        >
            <motion.svg
                key={theme}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, type: 'spring', stiffness: 150 }}
                className="absolute"
            >
                <motion.circle 
                    cx="12" cy="12" r="6" 
                    fill="currentColor"
                    variants={{ dark: { scale: 1}, light: { scale: 0.9 } }}
                    animate={isDark ? "dark" : "light"}
                />
                
                {/* Sun Rays */}
                <motion.g animate={isDark ? "dark" : "light"} transition={{ staggerChildren: 0.05 }}>
                    {sunRays.map((ray, i) => (
                        <motion.path 
                            key={i} 
                            d={ray.path} 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            transform={`rotate(${ray.rot} 12 12)`} 
                            variants={ray.variants}
                        />
                    ))}
                </motion.g>

                {/* Moon Mask */}
                <motion.path
                  d="M 12 2 a 10 10 0 0 1 0 20 Z"
                  fill="var(--background)"
                  variants={{
                    dark: { x: 0 },
                    light: { x: 15 }
                  }}
                  animate={isDark ? "dark" : "light"}
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                />

                 {/* Moon Craters */}
                <motion.g animate={isDark ? "dark" : "light"} transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}>
                    {moonCraters.map((crater, i) => (
                        <motion.circle
                            key={i}
                            cx={crater.cx}
                            cy={crater.cy}
                            r={crater.r}
                            fill="currentColor"
                            variants={crater.variants}
                        />
                    ))}
                </motion.g>
            </motion.svg>
        </motion.button>
    );
};

const Navbar: React.FC<NavbarProps> = ({ onConnectWallet }) => {
  const { setCurrentPage } = usePage();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleMenu = () => setIsOpen(!isOpen);
  
  const mobileMenuVariants = {
    hidden: { opacity: 0, y: '-100%' },
    // FIX: Corrected Framer Motion type error by using `as const` on the ease array.
    visible: { opacity: 1, y: '0%', transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] as const } },
    // FIX: Corrected Framer Motion type error by casting ease string to a literal type.
    exit: { opacity: 0, y: '-100%', transition: { duration: 0.3, ease: 'easeOut' as const } },
  };


  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[var(--navbar-bg)] backdrop-blur-lg border-b border-[var(--border-color)]' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0">
              <button onClick={() => setCurrentPage('home')} className="flex items-center space-x-2">
                <Logo className="h-8 w-8" />
                <span className="text-2xl font-bold font-heading">CreatorCash</span>
              </button>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <NavLink page="explore">Explore</NavLink>
                <NavLink page="mint">Mint NFT</NavLink>
                <NavLink page="dashboard">Dashboard</NavLink>
                <NavLink page="about">About</NavLink>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
               <ThemeToggle />
               <button 
                onClick={onConnectWallet} 
                className="px-5 py-2.5 text-sm font-semibold text-[var(--text-primary)] bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl hover:border-[var(--brand-green)] transition-colors duration-300 transform hover:scale-105"
               >
                Connect Wallet
              </button>
            </div>
            <div className="md:hidden flex items-center">
              <ThemeToggle />
              <button onClick={toggleMenu} className="inline-flex items-center justify-center p-2 rounded-md text-[var(--text-primary)] hover:text-[var(--text-secondary)] focus:outline-none">
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
           <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-40 bg-[var(--background)] md:hidden"
           >
            <div className="h-full flex flex-col justify-center items-center px-8 pt-20">
              <div className="flex flex-col items-center space-y-6 text-center">
                <MobileNavLink page="explore" onClick={toggleMenu}>Explore</MobileNavLink>
                <MobileNavLink page="mint" onClick={toggleMenu}>Mint NFT</MobileNavLink>
                <MobileNavLink page="dashboard" onClick={toggleMenu}>Dashboard</MobileNavLink>
                <MobileNavLink page="about" onClick={toggleMenu}>About</MobileNavLink>
                 <button onClick={() => { onConnectWallet(); toggleMenu(); }} 
                 className="mt-8 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-[var(--brand-gold)] via-[var(--brand-green)] to-[var(--brand-blue)] rounded-2xl hover:opacity-90 transition-opacity duration-300 shadow-lg shadow-[var(--shadow-color-rgb)]/30"
                 >
                  Connect Wallet
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;