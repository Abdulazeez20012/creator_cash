import { ethers, Signer } from 'ethers';
import { AccountId } from '@hashgraph/sdk';

// Wallet state interface
export interface WalletState {
  isConnected: boolean;
  address: string | null;
  signer: Signer | null;
  provider: ethers.providers.Provider | null;
}

// Initialize wallet state
let walletState: WalletState = {
  isConnected: false,
  address: null,
  signer: null,
  provider: null
};

// Get current wallet state
export const getWalletState = (): WalletState => {
  return { ...walletState };
};

// Debug function to check all possible wallet injection points
const debugWalletDetection = () => {
  if (typeof window === 'undefined') {
    console.log('Not in browser environment');
    return;
  }
  
  console.log('=== Wallet Detection Debug ===');
  
  const anyWindow = window as any;
  
  // Check for standard ethereum provider
  if (anyWindow.ethereum) {
    console.log('✓ window.ethereum detected:', {
      type: typeof anyWindow.ethereum,
      constructor: anyWindow.ethereum.constructor?.name,
      isMetaMask: anyWindow.ethereum.isMetaMask,
      isHashPack: anyWindow.ethereum.isHashPack,
      request: typeof anyWindow.ethereum.request,
      enable: typeof anyWindow.ethereum.enable
    });
  } else {
    console.log('✗ window.ethereum NOT detected');
  }
  
  // Check for HashPack specific providers
  if (anyWindow.hashpack) {
    console.log('✓ window.hashpack detected');
  } else {
    console.log('✗ window.hashpack NOT detected');
  }
  
  if (anyWindow.hedera) {
    console.log('✓ window.hedera detected');
  } else {
    console.log('✗ window.hedera NOT detected');
  }
  
  // Check for other possible wallet properties
  const walletIndicators = ['web3', 'Web3', 'ethereum', 'hashpack', 'hedera'];
  walletIndicators.forEach(indicator => {
    if (anyWindow[indicator] && indicator !== 'ethereum' && indicator !== 'hashpack' && indicator !== 'hedera') {
      console.log(`? window.${indicator} detected:`, typeof anyWindow[indicator]);
    }
  });
  
  // Check document for injected scripts
  try {
    const scripts = document.querySelectorAll('script');
    let injectedScripts = 0;
    scripts.forEach(script => {
      if (script.src && (script.src.includes('hashpack') || script.src.includes('wallet'))) {
        console.log(`? Found injected script: ${script.src}`);
        injectedScripts++;
      }
    });
    if (injectedScripts === 0) {
      console.log('? No obvious wallet injection scripts found');
    }
  } catch (e) {
    console.log('? Could not check for injected scripts:', e.message);
  }
  
  console.log('==============================');
};

// Try to detect wallet with a delay (sometimes extensions take time to inject)
const detectWalletWithDelay = async (delay = 1000): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const anyWindow = window as any;
      if (anyWindow.ethereum) {
        resolve(anyWindow.ethereum);
      } else if (anyWindow.hashpack) {
        resolve(anyWindow.hashpack);
      } else {
        resolve(null);
      }
    }, delay);
  });
};

// Manual wallet connection for cases where automatic detection fails
export const manualWalletConnect = async (rpcUrl: string = "https://testnet.hashio.io/api"): Promise<WalletState> => {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      throw new Error('This function can only be called in a browser environment');
    }

    // Prompt user for their Hedera account ID
    const accountId = prompt("Enter your Hedera Testnet Account ID (format: 0.0.x):");
    
    if (!accountId) {
      throw new Error('Account ID is required');
    }
    
    // Validate account ID format
    if (!accountId.match(/^0\.0\.\d+$/)) {
      throw new Error('Invalid account ID format. Please use format: 0.0.x');
    }
    
    // Create a basic provider for read operations only
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    
    // Create a mock signer (no private key, only for display purposes)
    const signer = new ethers.VoidSigner(accountId, provider);
    
    // Update wallet state
    walletState = {
      isConnected: true,
      address: accountId,
      signer,
      provider
    };
    
    console.log(`Manual wallet connection successful for account: ${accountId}`);
    console.warn('WARNING: Manual connection is for viewing only. You cannot perform transactions with this connection.');
    
    return { ...walletState };
  } catch (error: any) {
    console.error('Manual wallet connection failed:', error);
    throw new Error(`Manual connection failed: ${error.message || 'Unknown error'}`);
  }
};

// Connect to injected wallet (like HashPack extension)
export const connectWallet = async (): Promise<WalletState> => {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      throw new Error('This function can only be called in a browser environment');
    }

    // Run debug detection
    debugWalletDetection();
    
    const anyWindow = window as any;
    let providerToUse: any = null;
    
    // First try: immediate detection
    if (anyWindow.ethereum) {
      providerToUse = anyWindow.ethereum;
      console.log('Using immediately detected ethereum provider');
    } else if (anyWindow.hashpack) {
      providerToUse = anyWindow.hashpack;
      console.log('Using immediately detected hashpack provider');
    } else if (anyWindow.hedera) {
      providerToUse = anyWindow.hedera;
      console.log('Using immediately detected hedera provider');
    }
    
    // Second try: wait a bit and try again (extensions sometimes need time to inject)
    if (!providerToUse) {
      console.log('No provider found immediately, waiting 1 second and trying again...');
      providerToUse = await detectWalletWithDelay(1000);
      if (providerToUse) {
        console.log('Provider found after delay');
      }
    }
    
    // Third try: wait a bit longer
    if (!providerToUse) {
      console.log('Still no provider, waiting 2 more seconds...');
      providerToUse = await detectWalletWithDelay(2000);
      if (providerToUse) {
        console.log('Provider found after longer delay');
      }
    }
    
    // If we found a provider, try to connect
    if (providerToUse) {
      try {
        console.log('Attempting to connect via detected provider...');
        
        // Request accounts to trigger wallet connection
        const accounts = await providerToUse.request({ method: 'eth_requestAccounts' });
        
        if (!accounts || accounts.length === 0) {
          throw new Error('No accounts found in wallet');
        }
        
        // Create provider and signer
        const provider = new ethers.providers.Web3Provider(providerToUse);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        
        console.log(`✓ Wallet connected successfully`);
        console.log(`  Connected address: ${address}`);
        console.log(`  Accounts from request: [${accounts.join(', ')}]`);
        
        // Update wallet state
        walletState = {
          isConnected: true,
          address,
          signer,
          provider
        };
        
        return { ...walletState };
      } catch (err: any) {
        console.error('Wallet connection failed:', err);
        
        if (err.code === 4001) {
          throw new Error('Connection rejected by user. Please approve the connection in your wallet.');
        } else if (err.code === -32002) {
          throw new Error('Connection request already pending. Please check your wallet for pending requests.');
        }
        
        throw new Error(`Failed to connect to wallet: ${err.message || 'Unknown error'}`);
      }
    } else {
      // More detailed error message with specific troubleshooting steps
      const errorMessage = `
        No compatible wallet found. This is a common issue with browser extensions. Please try the following:
        
        IMMEDIATE SOLUTIONS:
        1. Refresh this page completely (Ctrl+F5 or Cmd+Shift+R)
        2. Close and reopen your browser
        3. Check that HashPack extension is enabled in Chrome Extensions (chrome://extensions/)
        
        HASHPACK SETUP:
        1. Make sure HashPack is installed from https://www.hashpack.app/
        2. Open HashPack extension and ensure it's unlocked
        3. Create or import a wallet if you haven't already
        4. Verify you're on Hedera Testnet network
        
        BROWSER REQUIREMENTS:
        - HashPack works best with Chrome, Firefox, or Brave
        - Avoid using incognito/private browsing mode
        - Disable other crypto wallet extensions temporarily
        
        ADVANCED TROUBLESHOOTING:
        1. Clear browser cache and cookies for localhost
        2. Try in a fresh Chrome profile
        3. Check if any browser extensions are blocking HashPack
        4. Try disabling ad blockers on this site
        
        If none of these work, HashPack may not be compatible with your browser version.
      `.trim();
      
      throw new Error(errorMessage);
    }
  } catch (error: any) {
    console.error('Error in connectWallet:', error);
    throw error;
  }
};

// Disconnect wallet
export const disconnectWallet = (): WalletState => {
  walletState = {
    isConnected: false,
    address: null,
    signer: null,
    provider: null
  };
  
  return { ...walletState };
};

// Format HBAR amount
export const formatHBAR = (amount: string | number): string => {
  try {
    const wei = ethers.utils.parseEther(amount.toString());
    return ethers.utils.formatEther(wei);
  } catch (error) {
    console.error('Error formatting HBAR:', error);
    return '0';
  }
};

// Convert HBAR to USD (using placeholder rate)
export const hbarToUSD = (hbarAmount: number): number => {
  // Placeholder exchange rate - in a real app, this would come from an API or environment variable
  const exchangeRate = 0.084; // $0.084 per HBAR
  return hbarAmount * exchangeRate;
};

// Convert Hedera address to Ethereum address
export const hederaToEthereumAddress = (hederaAddress: string): string => {
  try {
    // If it's already an Ethereum address, return as is
    if (hederaAddress.startsWith('0x') && hederaAddress.length === 42) {
      return hederaAddress;
    }
    
    // Parse the Hedera address
    const accountId = AccountId.fromString(hederaAddress);
    // Convert to Ethereum address format
    return `0x${accountId.toSolidityAddress()}`;
  } catch (error) {
    console.error('Error converting Hedera address to Ethereum address:', error);
    // Return a valid Ethereum address format as fallback to prevent ENS resolution attempts
    // This is a fallback and should not be used in production
    return '0x0000000000000000000000000000000000000000';
  }
};

// Check if wallet can perform transactions (true connection vs manual)
export const canPerformTransactions = (): boolean => {
  if (!walletState.isConnected || !walletState.signer) {
    return false;
  }
  
  // VoidSigner is used for manual connections and cannot perform transactions
  return walletState.signer.constructor.name !== 'VoidSigner';
};