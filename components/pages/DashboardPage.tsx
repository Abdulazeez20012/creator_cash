import React, { useState, useEffect } from 'react';
import { LayoutGrid, BarChart2, List, Settings } from 'lucide-react';
import { getWalletState } from '../../services/walletService';
import { getAllListings } from '../../services/contractService';

interface UserNFT {
  id: string;
  title: string;
  imageUrl: string;
  collection: string;
  token: string;
  serialNumber: string;
}

const DashboardPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('nfts');
    const [userNFTs, setUserNFTs] = useState<UserNFT[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch user's NFTs
    useEffect(() => {
        fetchUserNFTs();
    }, []);

    const fetchUserNFTs = async () => {
        try {
            setLoading(true);
            const walletState = getWalletState();
            
            if (!walletState.isConnected || !walletState.address) {
                throw new Error('Please connect your wallet first');
            }
            
            // In a real implementation, we would fetch the user's actual NFTs
            // For now, we'll simulate with mock data
            const mockNFTs: UserNFT[] = [
                { id: '1', title: 'Cybernetic Griot', imageUrl: 'https://picsum.photos/seed/nft1/600/800', collection: 'Afro-Futures', token: '0x123...', serialNumber: '1' },
                { id: '2', title: 'Nairobi Sunrise', imageUrl: 'https://picsum.photos/seed/nft2/600/600', collection: 'Digital Savannah', token: '0x456...', serialNumber: '2' },
                { id: '3', title: 'Kinetic Mask', imageUrl: 'https://picsum.photos/seed/nft3/600/900', collection: 'Ancestral Tech', token: '0x789...', serialNumber: '3' },
                { id: '4', title: 'Lagosian Rhapsody', imageUrl: 'https://picsum.photos/seed/nft4/800/600', collection: 'Urban Beats', token: '0xabc...', serialNumber: '4' },
            ];
            
            setUserNFTs(mockNFTs);
            setError(null);
        } catch (err: any) {
            console.error('Error fetching user NFTs:', err);
            setError(err.message || 'Failed to fetch your NFTs');
        } finally {
            setLoading(false);
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'nfts':
                return (
                    <div>
                        <h2 className="font-heading text-2xl font-bold mb-6">My NFTs</h2>
                        {loading ? (
                            <div className="flex justify-center items-center h-32">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--brand-green)]"></div>
                            </div>
                        ) : error ? (
                            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-300">
                                {error}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {userNFTs.map(nft => (
                                   <div key={nft.id} className="group relative aspect-square rounded-lg overflow-hidden shadow-lg shadow-[var(--shadow-color-rgb)]/10">
                                       <img src={nft.imageUrl} alt={nft.title} className="w-full h-full object-cover"/>
                                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                                           <div>
                                               <p className="font-bold text-sm text-white">{nft.title}</p>
                                               <p className="text-xs text-white/80">#{nft.serialNumber}</p>
                                           </div>
                                       </div>
                                   </div>
                                ))}
                            </div>
                        )}
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
                        <div className="bg-[var(--background)] border border-[var(--border-color)] rounded-lg p-6">
                            <h3 className="font-heading text-xl font-bold mb-4">Recent Transactions</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-[var(--border-color)]">
                                    <div>
                                        <p className="font-semibold">NFT Sale</p>
                                        <p className="text-sm text-[var(--text-secondary)]">Cybernetic Griot</p>
                                    </div>
                                    <p className="font-bold text-green-500">+1,250 HBAR</p>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-[var(--border-color)]">
                                    <div>
                                        <p className="font-semibold">NFT Sale</p>
                                        <p className="text-sm text-[var(--text-secondary)]">Kinetic Mask</p>
                                    </div>
                                    <p className="font-bold text-green-500">+2,500 HBAR</p>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <div>
                                        <p className="font-semibold">Platform Fee</p>
                                        <p className="text-sm text-[var(--text-secondary)]">Lagosian Rhapsody</p>
                                    </div>
                                    <p className="font-bold text-red-500">-37.5 HBAR</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'transactions':
                return (
                    <div>
                        <h2 className="font-heading text-2xl font-bold mb-6">Transaction History</h2>
                        <div className="bg-[var(--background)] border border-[var(--border-color)] rounded-lg overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-[var(--border-color)]">
                                    <tr>
                                        <th className="text-left p-4 font-semibold">Transaction</th>
                                        <th className="text-left p-4 font-semibold">Date</th>
                                        <th className="text-left p-4 font-semibold">Amount</th>
                                        <th className="text-left p-4 font-semibold">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-[var(--border-color)] hover:bg-[var(--border-color)]/50">
                                        <td className="p-4">NFT Sale - Cybernetic Griot</td>
                                        <td className="p-4">2023-06-15</td>
                                        <td className="p-4 font-bold text-green-500">+1,250 HBAR</td>
                                        <td className="p-4"><span className="px-2 py-1 bg-green-500/20 text-green-500 rounded-full text-xs">Completed</span></td>
                                    </tr>
                                    <tr className="border-b border-[var(--border-color)] hover:bg-[var(--border-color)]/50">
                                        <td className="p-4">NFT Sale - Kinetic Mask</td>
                                        <td className="p-4">2023-06-10</td>
                                        <td className="p-4 font-bold text-green-500">+2,500 HBAR</td>
                                        <td className="p-4"><span className="px-2 py-1 bg-green-500/20 text-green-500 rounded-full text-xs">Completed</span></td>
                                    </tr>
                                    <tr className="border-b border-[var(--border-color)] hover:bg-[var(--border-color)]/50">
                                        <td className="p-4">Platform Fee - Lagosian Rhapsody</td>
                                        <td className="p-4">2023-06-05</td>
                                        <td className="p-4 font-bold text-red-500">-37.5 HBAR</td>
                                        <td className="p-4"><span className="px-2 py-1 bg-green-500/20 text-green-500 rounded-full text-xs">Completed</span></td>
                                    </tr>
                                    <tr className="hover:bg-[var(--border-color)]/50">
                                        <td className="p-4">NFT Purchase - Digital Adire</td>
                                        <td className="p-4">2023-05-28</td>
                                        <td className="p-4 font-bold text-red-500">-950 HBAR</td>
                                        <td className="p-4"><span className="px-2 py-1 bg-green-500/20 text-green-500 rounded-full text-xs">Completed</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'settings':
                return (
                    <div>
                        <h2 className="font-heading text-2xl font-bold mb-6">Account Settings</h2>
                        <div className="bg-[var(--background)] border border-[var(--border-color)] rounded-lg p-6">
                            <div className="mb-6">
                                <h3 className="font-heading text-lg font-bold mb-4">Profile Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Display Name</label>
                                        <input 
                                            type="text" 
                                            defaultValue="Creator Name" 
                                            className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg px-4 py-2 focus:border-[var(--brand-green)] focus:ring-0 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Wallet Address</label>
                                        <input 
                                            type="text" 
                                            defaultValue="0.0.123456" 
                                            className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg px-4 py-2 focus:border-[var(--brand-green)] focus:ring-0 outline-none"
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mb-6">
                                <h3 className="font-heading text-lg font-bold mb-4">Notification Preferences</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span>Sale Notifications</span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-[var(--border-color)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--brand-green)]"></div>
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>Purchase Notifications</span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-[var(--border-color)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--brand-green)]"></div>
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>Platform Updates</span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-11 h-6 bg-[var(--border-color)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--brand-green)]"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button className="px-6 py-2 bg-gradient-to-r from-[var(--brand-gold)] via-[var(--brand-green)] to-[var(--brand-blue)] text-white rounded-lg hover:opacity-90 transition-opacity">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col items-center mb-12">
                <img src="https://picsum.photos/seed/creator/128" alt="Creator" className="w-32 h-32 rounded-full border-4 border-[var(--brand-gold)] shadow-lg shadow-[var(--shadow-color-rgb)]/30"/>
                <h1 className="font-heading text-3xl font-bold mt-4">Creator Dashboard</h1>
                <p className="text-[var(--text-secondary)]">
                    {getWalletState().address ? `${getWalletState().address.substring(0, 6)}...${getWalletState().address.substring(getWalletState().address.length - 4)}` : '0.0.000000'}
                </p>
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