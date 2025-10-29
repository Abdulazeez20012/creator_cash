import React, { useState } from 'react';
import { MOCK_NFTS } from '../../constants';
import EarningsChart from '../ui/EarningsChart';
import { LayoutGrid, BarChart2, List, Settings } from 'lucide-react';

const DashboardPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('nfts');

    const renderContent = () => {
        switch (activeTab) {
            case 'nfts':
                return (
                    <div>
                        <h2 className="font-heading text-2xl font-bold mb-6">My NFTs</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {MOCK_NFTS.slice(0, 4).map(nft => (
                               <div key={nft.id} className="group relative aspect-square rounded-lg overflow-hidden shadow-lg shadow-[var(--shadow-color-rgb)]/10">
                                   <img src={nft.imageUrl} alt={nft.title} className="w-full h-full object-cover"/>
                                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                                       <p className="font-bold text-sm text-white">{nft.title}</p>
                                   </div>
                               </div>
                            ))}
                        </div>
                    </div>
                );
            case 'earnings':
                return (
                    <div>
                        <h2 className="font-heading text-2xl font-bold mb-6">Earnings</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-[var(--background)] p-4 rounded-lg border border-[var(--border-color)]"><p className="text-sm text-[var(--text-secondary)]">Total Revenue</p><p className="text-2xl font-bold">15,250 HBAR</p></div>
                             <div className="bg-[var(--background)] p-4 rounded-lg border border-[var(--border-color)]"><p className="text-sm text-[var(--text-secondary)]">Last 30 Days</p><p className="text-2xl font-bold">7,000 HBAR</p></div>
                             <div className="bg-[var(--background)] p-4 rounded-lg border border-[var(--border-color)]"><p className="text-sm text-[var(--text-secondary)]">Balance</p><p className="text-2xl font-bold">8,100 HBAR</p></div>
                        </div>
                        <EarningsChart />
                    </div>
                );
            case 'transactions':
                return <div><h2 className="font-heading text-2xl font-bold">Transactions</h2><p className="text-[var(--text-secondary)] mt-4">Transaction history will be displayed here.</p></div>;
            case 'settings':
                return <div><h2 className="font-heading text-2xl font-bold">Settings</h2><p className="text-[var(--text-secondary)] mt-4">Account settings will be displayed here.</p></div>;
            default:
                return null;
        }
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col items-center mb-12">
                <img src="https://picsum.photos/seed/creator/128" alt="Creator" className="w-32 h-32 rounded-full border-4 border-[var(--brand-gold)] shadow-lg shadow-[var(--shadow-color-rgb)]/30"/>
                <h1 className="font-heading text-3xl font-bold mt-4">Creator Dashboard</h1>
                <p className="text-[var(--text-secondary)]">0.0.123456</p>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar */}
                <aside className="w-full lg:w-64">
                    <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-4 backdrop-blur-md shadow-lg shadow-[var(--shadow-color-rgb)]/10">
                        <nav className="flex flex-col space-y-2">
                             {[
                                { id: 'nfts', label: 'My NFTs', icon: LayoutGrid },
                                { id: 'earnings', label: 'Earnings', icon: BarChart2 },
                                { id: 'transactions', label: 'Transactions', icon: List },
                                { id: 'settings', label: 'Settings', icon: Settings },
                            ].map(({id, label, icon: Icon}) => (
                                <button key={id} onClick={() => setActiveTab(id)} className={`flex items-center space-x-3 p-3 rounded-lg text-left transition-all duration-200 group ${activeTab === id ? 'bg-white/10 dark:bg-white/5 text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:bg-white/5 dark:hover:bg-white/5'}`}>
                                    <Icon size={20} className={`transition-colors group-hover:text-[var(--accent-color)] ${activeTab === id ? 'text-[var(--accent-color)]' : ''}`}/>
                                    <span className="font-semibold">{label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>
                </aside>
                
                {/* Main Content */}
                <main className="flex-1 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-8 backdrop-blur-md shadow-lg shadow-[var(--shadow-color-rgb)]/10">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default DashboardPage;