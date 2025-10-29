import React, { useState } from 'react';
import NFTCard from '../ui/NFTCard';
import { MOCK_NFTS } from '../../constants';
import { LayoutGrid, List } from 'lucide-react';

const FilterSidebar: React.FC = () => {
    return (
        <div className="w-full lg:w-72 lg:flex-shrink-0 bg-[var(--card-bg)] border border-[var(--border-color)] p-6 rounded-2xl backdrop-blur-md shadow-lg shadow-[var(--shadow-color-rgb)]/10">
            <h2 className="font-heading text-2xl font-bold mb-6">Filters</h2>
            
            <div className="space-y-6">
                <div>
                    <h3 className="font-semibold mb-3 text-lg">Categories</h3>
                    <div className="space-y-2 text-[var(--text-secondary)]">
                        <label className="flex items-center space-x-2 cursor-pointer hover:text-[var(--text-primary)]"><input type="checkbox" className="w-4 h-4 rounded"/> <span>Art</span></label>
                        <label className="flex items-center space-x-2 cursor-pointer hover:text-[var(--text-primary)]"><input type="checkbox" className="w-4 h-4 rounded"/> <span>Music</span></label>
                        <label className="flex items-center space-x-2 cursor-pointer hover:text-[var(--text-primary)]"><input type="checkbox" className="w-4 h-4 rounded"/> <span>Photography</span></label>
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold mb-3 text-lg">Price Range (HBAR)</h3>
                    <div className="flex items-center space-x-2">
                        <input type="number" placeholder="Min" className="w-full bg-[var(--background)] border border-[var(--border-color)] p-2 rounded-lg text-sm" />
                        <span className="text-[var(--text-secondary)]">-</span>
                        <input type="number" placeholder="Max" className="w-full bg-[var(--background)] border border-[var(--border-color)] p-2 rounded-lg text-sm" />
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold mb-3 text-lg">Sort By</h3>
                    <select className="w-full bg-[var(--background)] border border-[var(--border-color)] p-2 rounded-lg text-sm">
                        <option>Trending</option>
                        <option>Price: Low to High</option>
                        <option>Price: High to Low</option>
                        <option>Recently Listed</option>
                    </select>
                </div>
            </div>
        </div>
    );
};


const ExplorePage: React.FC = () => {
    const [layout, setLayout] = useState('grid');
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Explore NFTs</h1>
      <p className="text-lg text-[var(--text-secondary)] mb-12">Discover the pulse of African creativity.</p>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-72">
            <FilterSidebar />
        </aside>

        <main className="flex-1">
            <div className="flex justify-end mb-4">
                 <div className="flex items-center bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-1">
                    <button onClick={() => setLayout('grid')} className={`p-2 rounded ${layout === 'grid' ? 'bg-[var(--border-color)]' : ''}`}><LayoutGrid size={20}/></button>
                    <button onClick={() => setLayout('list')} className={`p-2 rounded ${layout === 'list' ? 'bg-[var(--border-color)]' : ''}`}><List size={20}/></button>
                 </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {MOCK_NFTS.map(nft => (
                    <NFTCard key={nft.id} nft={nft} />
                ))}
            </div>
        </main>
      </div>
    </div>
  );
};

export default ExplorePage;