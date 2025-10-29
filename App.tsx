import React, { useState, createContext, useContext, useEffect, useMemo } from 'react';
// FIX: Changed import type to ensure types.ts is evaluated for its global declarations.
import { Page } from './types';
import Navbar from './components/ui/Navbar';
import Footer from './components/ui/Footer';
import HomePage from './components/pages/HomePage';
import ExplorePage from './components/pages/ExplorePage';
import MintPage from './components/pages/MintPage';
import DetailPage from './components/pages/DetailPage';
import DashboardPage from './components/pages/DashboardPage';
import AboutPage from './components/pages/AboutPage';
import WalletConnectModal from './components/ui/WalletConnectModal';
import ChatBot from './components/ui/ChatBot';
import { motion, AnimatePresence } from 'framer-motion';

// Page Navigation Context
interface PageContextType {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  selectedNftId: number | null;
  setSelectedNftId: (id: number | null) => void;
}
const PageContext = createContext<PageContextType | undefined>(undefined);
export const usePage = () => {
  const context = useContext(PageContext);
  if (!context) throw new Error('usePage must be used within a PageProvider');
  return context;
};

// Theme Context
type Theme = 'light' | 'dark';
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('dark');
  
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };
  
  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};


const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedNftId, setSelectedNftId] = useState<number | null>(null);
  const [isWalletModalOpen, setWalletModalOpen] = useState(false);
  
  const pageContextValue = {
    currentPage,
    setCurrentPage: (page: Page) => {
      window.scrollTo(0, 0);
      setCurrentPage(page);
    },
    selectedNftId,
    setSelectedNftId,
  };
  
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const pageTransition = {
    type: "tween" as const,
    // FIX: Corrected Framer Motion type error by adding `as const` to the ease array.
    ease: [0.4, 0, 0.2, 1] as const,
    duration: 0.5
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage />;
      case 'explore': return <ExplorePage />;
      case 'mint': return <MintPage />;
      case 'detail': return <DetailPage />;
      case 'dashboard': return <DashboardPage />;
      case 'about': return <AboutPage />;
      default: return <HomePage />;
    }
  };

  return (
    <ThemeProvider>
      <PageContext.Provider value={pageContextValue}>
        <div className="min-h-screen">
          <Navbar onConnectWallet={() => setWalletModalOpen(true)} />
          <main className="pt-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                {renderPage()}
              </motion.div>
            </AnimatePresence>
          </main>
          <Footer />
          <WalletConnectModal
            isOpen={isWalletModalOpen}
            onClose={() => setWalletModalOpen(false)}
          />
          <ChatBot />
        </div>
      </PageContext.Provider>
    </ThemeProvider>
  );
};

export default App;