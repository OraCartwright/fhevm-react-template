import { useState } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, getDefaultConfig, connectorsForWallets } from '@rainbow-me/rainbowkit';
import { injectedWallet, metaMaskWallet, rainbowWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets';
import '@rainbow-me/rainbowkit/styles.css';

import { FhevmProvider } from '@fhevm/react';
import { EncryptedCounter } from './components/EncryptedCounter';
import { PrivateVoting } from './components/PrivateVoting';
import { ConfidentialAuction } from './components/ConfidentialAuction';
import { PrivateTransfer } from './components/PrivateTransfer';

// Wagmi configuration
const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [injectedWallet, metaMaskWallet, rainbowWallet, walletConnectWallet],
    },
  ],
  {
    appName: 'FHEVM SDK Example',
    projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo',
  }
);

const config = createConfig({
  chains: [sepolia],
  connectors,
  transports: {
    [sepolia.id]: http(),
  },
});

const queryClient = new QueryClient();

// Scenarios
type Scenario = 'counter' | 'voting' | 'auction' | 'transfer';

export default function App() {
  const [activeScenario, setActiveScenario] = useState<Scenario>('counter');

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider locale="en-US">
          <FhevmProvider
            config={{
              network: {
                chainId: 11155111,
                name: 'Sepolia',
                rpcUrl: import.meta.env.VITE_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_KEY',
              },
            }}
          >
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
              {/* Header */}
              <header className="border-b border-white/10 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-white">
                        🔐 FHEVM SDK Examples
                      </h1>
                      <p className="text-sm text-gray-300 mt-1">
                        Complete use cases with Fully Homomorphic Encryption
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <a
                        href="https://github.com/your-repo/fhevm-sdk"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-white transition-colors"
                      >
                        GitHub
                      </a>
                      <a
                        href="https://docs.zama.ai/fhevm"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-white transition-colors"
                      >
                        Docs
                      </a>
                      <div className="scale-90">
                        <w3m-button />
                      </div>
                    </div>
                  </div>
                </div>
              </header>

              {/* Scenario Tabs */}
              <div className="border-b border-white/10">
                <div className="container mx-auto px-4">
                  <div className="flex gap-2 overflow-x-auto py-4">
                    <ScenarioTab
                      active={activeScenario === 'counter'}
                      onClick={() => setActiveScenario('counter')}
                      icon="🔢"
                      title="Encrypted Counter"
                    />
                    <ScenarioTab
                      active={activeScenario === 'voting'}
                      onClick={() => setActiveScenario('voting')}
                      icon="🗳️"
                      title="Private Voting"
                    />
                    <ScenarioTab
                      active={activeScenario === 'auction'}
                      onClick={() => setActiveScenario('auction')}
                      icon="🏆"
                      title="Sealed Auction"
                    />
                    <ScenarioTab
                      active={activeScenario === 'transfer'}
                      onClick={() => setActiveScenario('transfer')}
                      icon="💸"
                      title="Private Transfer"
                    />
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <main className="container mx-auto px-4 py-8">
                {activeScenario === 'counter' && <EncryptedCounter />}
                {activeScenario === 'voting' && <PrivateVoting />}
                {activeScenario === 'auction' && <ConfidentialAuction />}
                {activeScenario === 'transfer' && <PrivateTransfer />}
              </main>

              {/* Footer */}
              <footer className="border-t border-white/10 mt-16">
                <div className="container mx-auto px-4 py-8">
                  <div className="text-center text-gray-400 text-sm">
                    <p>
                      Built with{' '}
                      <a
                        href="https://www.zama.ai/"
                        className="text-purple-400 hover:text-purple-300"
                      >
                        Zama FHEVM
                      </a>{' '}
                      | Open Source MIT License
                    </p>
                  </div>
                </div>
              </footer>
            </div>
          </FhevmProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

// Scenario Tab Component
interface ScenarioTabProps {
  active: boolean;
  onClick: () => void;
  icon: string;
  title: string;
}

function ScenarioTab({ active, onClick, icon, title }: ScenarioTabProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
        active
          ? 'bg-purple-600 text-white shadow-lg'
          : 'bg-white/5 text-gray-300 hover:bg-white/10'
      }`}
    >
      <span>{icon}</span>
      <span className="font-medium">{title}</span>
    </button>
  );
}
