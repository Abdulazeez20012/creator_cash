// FIX: Import React types to resolve issue with JSX intrinsic element definitions.
// FIX: Changed `import type` to `import` to ensure proper JSX type augmentation and resolve widespread intrinsic element errors.
import * as React from 'react';

export type Page = 'home' | 'explore' | 'mint' | 'detail' | 'dashboard' | 'about' | 'marketplace' | 'create-collection';

export interface NFT {
  id: number;
  title: string;
  artist: string;
  artistAvatar: string;
  priceHBAR: number;
  priceUSD: number;
  imageUrl: string;
  collection: string;
}

export interface Artist {
  id: number;
  name: string;
  avatarUrl: string;
  volumeHBAR: number;
}

export interface Collection {
  id: number;
  name: string;
  creator: string;
  imageUrl: string;
  floorPrice: number;
}

// Add type definition for the custom Lottie player element to satisfy TypeScript's JSX checker.
// This was causing the application to fail on load.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'dotlottie-player': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        background?: string;
        speed?: string;
        loop?: boolean;
        autoplay?: boolean;
      };
    }
  }
}