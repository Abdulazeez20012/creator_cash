// FIX: Changed import type to ensure types.ts is evaluated for its global declarations.
import { NFT, Artist, Collection } from './types';

export const MOCK_NFTS: NFT[] = [
  { id: 1, title: 'Cybernetic Griot', artist: 'Adekunle', artistAvatar: 'https://picsum.photos/seed/a1/64', priceHBAR: 1250, priceUSD: 105.00, imageUrl: 'https://picsum.photos/seed/nft1/600/800', collection: 'Afro-Futures' },
  { id: 2, title: 'Nairobi Sunrise', artist: 'Amina', artistAvatar: 'https://picsum.photos/seed/a2/64', priceHBAR: 800, priceUSD: 67.20, imageUrl: 'https://picsum.photos/seed/nft2/600/600', collection: 'Digital Savannah' },
  { id: 3, title: 'Kinetic Mask', artist: 'Jabari', artistAvatar: 'https://picsum.photos/seed/a3/64', priceHBAR: 2500, priceUSD: 210.00, imageUrl: 'https://picsum.photos/seed/nft3/600/900', collection: 'Ancestral Tech' },
  { id: 4, title: 'Lagosian Rhapsody', artist: 'Chidinma', artistAvatar: 'https://picsum.photos/seed/a4/64', priceHBAR: 1500, priceUSD: 126.00, imageUrl: 'https://picsum.photos/seed/nft4/800/600', collection: 'Urban Beats' },
  { id: 5, title: 'Hedera Bloom', artist: 'Kwame', artistAvatar: 'https://picsum.photos/seed/a5/64', priceHBAR: 3000, priceUSD: 252.00, imageUrl: 'https://picsum.photos/seed/nft5/600/700', collection: 'CryptoFlora' },
  { id: 6, title: 'Digital Adire', artist: 'Folake', artistAvatar: 'https://picsum.photos/seed/a6/64', priceHBAR: 950, priceUSD: 79.80, imageUrl: 'https://picsum.photos/seed/nft6/700/600', collection: 'Woven Code' },
  { id: 7, title: 'Accra Soundscape', artist: 'Ekow', artistAvatar: 'https://picsum.photos/seed/a7/64', priceHBAR: 1800, priceUSD: 151.20, imageUrl: 'https://picsum.photos/seed/nft7/600/600', collection: 'Urban Beats' },
  { id: 8, title: 'Spirit of the Baobab', artist: 'Nia', artistAvatar: 'https://picsum.photos/seed/a8/64', priceHBAR: 4200, priceUSD: 352.80, imageUrl: 'https://picsum.photos/seed/nft8/600/800', collection: 'Digital Savannah' },
];

export const MOCK_ARTISTS: Artist[] = [
  { id: 1, name: 'Adekunle', avatarUrl: 'https://picsum.photos/seed/a1/128', volumeHBAR: 150000 },
  { id: 2, name: 'Amina', avatarUrl: 'https://picsum.photos/seed/a2/128', volumeHBAR: 125000 },
  { id: 3, name: 'Jabari', avatarUrl: 'https://picsum.photos/seed/a3/128', volumeHBAR: 110000 },
  { id: 4, name: 'Chidinma', avatarUrl: 'https://picsum.photos/seed/a4/128', volumeHBAR: 95000 },
  { id: 5, name: 'Kwame', avatarUrl: 'https://picsum.photos/seed/a5/128', volumeHBAR: 80000 },
  { id: 6, name: 'Folake', avatarUrl: 'https://picsum.photos/seed/a6/128', volumeHBAR: 72000 },
];

export const MOCK_COLLECTIONS: Collection[] = [
    { id: 1, name: 'Afro-Futures', creator: 'Adekunle', imageUrl: 'https://picsum.photos/seed/c1/500/300', floorPrice: 1250 },
    { id: 2, name: 'Digital Savannah', creator: 'Amina', imageUrl: 'https://picsum.photos/seed/c2/500/300', floorPrice: 800 },
    { id: 3, name: 'Ancestral Tech', creator: 'Jabari', imageUrl: 'https://picsum.photos/seed/c3/500/300', floorPrice: 2500 },
    { id: 4, name: 'Urban Beats', creator: 'Chidinma', imageUrl: 'https://picsum.photos/seed/c4/500/300', floorPrice: 1500 },
];