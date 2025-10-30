import React, { useRef, useState, useEffect } from 'react';
// FIX: Import types to load global JSX definitions for custom elements like 'dotlottie-player'.
import '../../types';
import { usePage } from '../../App';
import NFTCard from '../ui/NFTCard';
import { MOCK_ARTISTS, MOCK_COLLECTIONS, MOCK_NFTS } from '../../constants';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Zap, Gem, ShieldCheck, BarChart } from 'lucide-react';

const Section: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

    return (
        <motion.section 
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 }
            }}
            className="py-16 md:py-24"
        >
            {children}
        </motion.section>
    );
};

const HomePage: React.FC = () => {
  const { setCurrentPage } = usePage();
  const collectionsRef = useRef(null);
  const collectionsInView = useInView(collectionsRef, { once: true, margin: "-100px 0px" });
  const [lottieError, setLottieError] = useState(false);

  const staggerContainer = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.07
        }
    }
  };

  const staggerItem = {
      hidden: { y: 20, opacity: 0 },
      visible: { y: 0, opacity: 1 }
  };

  // Handle Lottie player error
  useEffect(() => {
    const handleError = () => {
      setLottieError(true);
    };

    // Add error listener to Lottie player if it exists
    const lottiePlayer = document.querySelector('dotlottie-player');
    if (lottiePlayer) {
      lottiePlayer.addEventListener('error', handleError);
    }

    return () => {
      if (lottiePlayer) {
        lottiePlayer.removeEventListener('error', handleError);
      }
    };
  }, []);

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--background)] z-10"></div>
        <div className="absolute inset-0 opacity-20 dark:opacity-30">
          {!lottieError ? (
            <dotlottie-player
                src="https://lottie.host/8051e737-1845-4246-953a-1430030c6a99/65W6E4J9b1.lottie"
                background="transparent"
                speed="0.5"
                style={{ width: '100%', height: '100%' }}
                loop
                autoplay
                onError={() => setLottieError(true)}
            ></dotlottie-player>
          ) : (
            // Fallback background if Lottie fails to load
            <div className="w-full h-full bg-gradient-to-br from-[var(--brand-gold)]/10 via-[var(--brand-green)]/10 to-[var(--brand-blue)]/10"></div>
          )}
        </div>
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
                },
            }}
            className="container mx-auto px-4 sm:px-6 lg:px-8 z-20"
        >
          <motion.h1 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 }}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-heading text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-tight"
          >
            The African Creative <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--brand-gold)] via-[var(--brand-green)] to-[var(--brand-blue)]">
              Renaissance is Here.
            </span>
          </motion.h1>
          <motion.p 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 }}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-[var(--text-secondary)]"
          >
            Empowering African Creators with Instant NFT Sales on Hedera.
          </motion.p>
          <motion.div 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 }}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button 
                onClick={() => setCurrentPage('mint')} 
                className="w-full sm:w-auto px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-[var(--brand-gold)] via-[var(--brand-green)] to-[var(--brand-blue)] rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[var(--shadow-color-rgb)]/40 hover:shadow-xl hover:shadow-[var(--brand-green)]/30"
            >
              Create NFT
            </button>
            <button 
                onClick={() => setCurrentPage('explore')} 
                className="w-full sm:w-auto px-8 py-4 text-lg font-semibold text-[var(--text-primary)] bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl transition-all duration-300 transform hover:scale-105 hover:border-[var(--brand-green)]"
            >
              Explore Art & Music
            </button>
          </motion.div>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trending Collections */}
        <Section>
            <div className="flex justify-between items-center mb-12">
                <h2 className="font-heading text-3xl md:text-4xl font-bold">Trending Collections</h2>
                <button onClick={() => setCurrentPage('explore')} className="flex items-center gap-2 text-[var(--accent-color)] hover:underline">
                    View All <ArrowRight size={16}/>
                </button>
            </div>
            <motion.div 
                ref={collectionsRef}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                variants={staggerContainer}
                initial="hidden"
                animate={collectionsInView ? "visible" : "hidden"}
            >
                {MOCK_COLLECTIONS.map(collection => (
                    <motion.div key={collection.id} variants={staggerItem}>
                        <motion.div whileHover={{ y: -5 }} className="bg-[var(--card-bg)] border border-[var(--border-color)] backdrop-blur-md rounded-2xl overflow-hidden group cursor-pointer shadow-lg shadow-[var(--shadow-color-rgb)]/10" onClick={() => setCurrentPage('explore')}>
                            <div className="overflow-hidden"><img src={collection.imageUrl} alt={collection.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"/></div>
                            <div className="p-5">
                                <h3 className="font-heading font-bold text-xl">{collection.name}</h3>
                                <p className="text-sm text-[var(--text-secondary)]">by {collection.creator}</p>
                                <div className="mt-4 flex justify-between items-center">
                                    <span className="text-xs text-[var(--text-secondary)]/80">Floor Price</span>
                                    <span className="font-bold text-[var(--text-primary)]">{collection.floorPrice} HBAR</span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                ))}
            </motion.div>
        </Section>
        
        {/* How It Works */}
        <Section>
            <h2 className="text-center font-heading text-3xl md:text-4xl font-bold mb-12">Create and Sell in Minutes</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="bg-[var(--card-bg)] border border-[var(--border-color)] backdrop-blur-md p-8 rounded-2xl shadow-lg shadow-[var(--shadow-color-rgb)]/10">
                    <h3 className="font-heading text-2xl font-bold mb-2">1. Mint Your NFT</h3>
                    <p className="text-[var(--text-secondary)]">Upload your art or music, add details, and mint it on the Hedera network with a few clicks.</p>
                </div>
                 <div className="bg-[var(--card-bg)] border border-[var(--border-color)] backdrop-blur-md p-8 rounded-2xl shadow-lg shadow-[var(--shadow-color-rgb)]/10">
                    <h3 className="font-heading text-2xl font-bold mb-2">2. List for Sale</h3>
                    <p className="text-[var(--text-secondary)]">Set your price in HBAR or USD. Your creation is instantly available on the global marketplace.</p>
                </div>
                 <div className="bg-[var(--card-bg)] border border-[var(--border-color)] backdrop-blur-md p-8 rounded-2xl shadow-lg shadow-[var(--shadow-color-rgb)]/10">
                    <h3 className="font-heading text-2xl font-bold mb-2">3. Get Paid Instantly</h3>
                    <p className="text-[var(--text-secondary)]">Receive payments directly to your wallet the moment your NFT is sold. No waiting periods.</p>
                </div>
            </div>
        </Section>

        {/* Top Artists */}
        <Section>
            <div className="flex justify-between items-center mb-12">
                <h2 className="font-heading text-3xl md:text-4xl font-bold">Top Artists</h2>
                <button onClick={() => setCurrentPage('explore')} className="flex items-center gap-2 text-[var(--accent-color)] hover:underline">
                    View All <ArrowRight size={16}/>
                </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {MOCK_ARTISTS.map(artist => (
                    <div key={artist.id} className="text-center group cursor-pointer" onClick={() => setCurrentPage('explore')}>
                        <img src={artist.avatarUrl} alt={artist.name} className="w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto border-2 border-[var(--border-color)] group-hover:border-[var(--brand-gold)] transition-colors duration-300"/>
                        <h3 className="mt-4 font-bold font-heading">{artist.name}</h3>
                        <p className="text-sm text-[var(--text-secondary)]">{artist.volumeHBAR.toLocaleString()} HBAR</p>
                    </div>
                ))}
            </div>
        </Section>

        {/* Why Hedera */}
        <Section>
            <h2 className="text-center font-heading text-3xl md:text-4xl font-bold mb-12">Powered by Hedera</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-[var(--brand-gold)]/10 text-[var(--brand-gold)] rounded-lg flex items-center justify-center"><Zap size={24}/></div>
                    <div>
                        <h3 className="font-heading font-bold text-xl mb-2">Lightning Fast</h3>
                        <p className="text-[var(--text-secondary)] text-sm">Transactions confirm in seconds, not minutes. Perfect for high-volume sales.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-[var(--brand-green)]/10 text-[var(--brand-green)] rounded-lg flex items-center justify-center"><Gem size={24}/></div>
                    <div>
                        <h3 className="font-heading font-bold text-xl mb-2">Low, Predictable Fees</h3>
                        <p className="text-[var(--text-secondary)] text-sm">Mint and trade for fractions of a cent, so more profit stays in your pocket.</p>
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-[var(--brand-blue)]/10 text-[var(--brand-blue)] rounded-lg flex items-center justify-center"><ShieldCheck size={24}/></div>
                    <div>
                        <h3 className="font-heading font-bold text-xl mb-2">Bank-Grade Security</h3>
                        <p className="text-[var(--text-secondary)] text-sm">Hedera's aBFT consensus provides the highest level of security for your assets.</p>
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-[var(--brand-coral)]/10 text-[var(--brand-coral)] rounded-lg flex items-center justify-center"><BarChart size={24}/></div>
                    <div>
                        <h3 className="font-heading font-bold text-xl mb-2">Carbon Negative</h3>
                        <p className="text-[var(--text-secondary)] text-sm">Create and trade sustainably on a network that is verifiably carbon negative.</p>
                    </div>
                </div>
            </div>
        </Section>
      </div>
    </div>
  );
};

export default HomePage;