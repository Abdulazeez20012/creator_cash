import React, { useRef } from 'react';
import type { NFT } from '../../types';
import { usePage } from '../../App';
import { motion, useMotionValue, useTransform } from 'framer-motion';

interface NFTCardProps {
  nft: NFT;
}

const NFTCard: React.FC<NFTCardProps> = ({ nft }) => {
  const { setCurrentPage, setSelectedNftId } = usePage();
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-150, 150], [10, -10]);
  const rotateY = useTransform(x, [-150, 150], [-10, 10]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      const xPct = mouseX / width - 0.5;
      const yPct = mouseY / height - 0.5;
      x.set(xPct * 100);
      y.set(yPct * 100);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleCardClick = () => {
    setSelectedNftId(nft.id);
    setCurrentPage('detail');
  };

  return (
    <motion.div
      ref={cardRef}
      onClick={handleCardClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative block aspect-[3/4] w-full cursor-pointer"
      style={{ perspective: "1000px" }}
      whileHover="hover"
      variants={{
        rest: { scale: 1 },
        hover: { scale: 1.03 }
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
        <motion.div
            className="absolute inset-0 rounded-2xl shadow-lg shadow-[var(--shadow-color-rgb)]/10 overflow-hidden glowing-border opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ 
                rotateX, 
                rotateY,
                y: -8 
            }}
        />
        <motion.div
            style={{ 
                rotateX, 
                rotateY,
                y: 0 
            }}
            variants={{
              rest: { y: 0 },
              hover: { y: -8 }
            }}
            className="relative h-full w-full transform-style-preserve-3d rounded-2xl shadow-lg shadow-[var(--shadow-color-rgb)]/10"
        >
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            <motion.img
              src={nft.imageUrl}
              alt={nft.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
              variants={{
                rest: { scale: 1.05 },
                hover: { scale: 1.15 },
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white" style={{ transform: "translateZ(20px)"}}>
            <motion.div 
                className="absolute inset-0 bg-black/10 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                style={{ maskImage: 'linear-gradient(to top, black 50%, transparent 100%)' }}
            />
            <div className="relative flex items-center space-x-3">
              <img src={nft.artistAvatar} alt={nft.artist} className="h-10 w-10 rounded-full border-2 border-white/50"/>
              <div>
                <h3 className="font-heading font-bold text-lg leading-tight">{nft.title}</h3>
                <p className="text-sm text-white/80">{nft.artist}</p>
              </div>
            </div>
            <motion.div
                className="relative mt-4 overflow-hidden"
                variants={{
                    rest: { height: 0, opacity: 0, y: 10 },
                    hover: { height: 'auto', opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
            >
                <div className="flex justify-between items-center text-sm bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                    <span className="text-white/70">Price</span>
                    <div className="text-right">
                        <p className="font-bold text-white">{nft.priceHBAR.toLocaleString()} HBAR</p>
                        <p className="text-xs text-white/50">${nft.priceUSD.toFixed(2)}</p>
                    </div>
                </div>
            </motion.div>
          </div>
      </motion.div>
    </motion.div>
  );
};

export default NFTCard;