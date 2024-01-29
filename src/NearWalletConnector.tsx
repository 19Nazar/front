import React, { useState, useEffect } from 'react';
import { setupWalletSelector , SignInParams, WalletSelector } from "@near-wallet-selector/core";
import { setupModal, WalletSelectorModal} from "@near-wallet-selector/modal-ui";
import { setupNearWallet } from "@near-wallet-selector/near-wallet";
import "@near-wallet-selector/modal-ui/styles.css"
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupWalletConnect } from "@near-wallet-selector/wallet-connect";
import { setupMintbaseWallet } from "@near-wallet-selector/mintbase-wallet"; 


export const NearWalletConnector = () => {
  const [selector, setSelector] = useState<WalletSelector | null>(null);
  const [modal, setModal] = useState<WalletSelectorModal | null>(null);

  useEffect(() => {
    const initializeWallet = async () => {
      const selector = await setupWalletSelector({
        network: "testnet",
        modules: [setupNearWallet(),
                  setupMyNearWallet({
                    walletUrl: "https://testnet.mynearwallet.com/",
                  }),
                  setupWalletConnect({
                    projectId: "c4f79cc...",
                    metadata: {
                      name: "NEAR Wallet Selector",
                      description: "Example dApp used by NEAR Wallet Selector",
                      url: "https://github.com/near/wallet-selector",
                      icons: ["https://avatars.githubusercontent.com/u/37784886"],
                    },
                  }),
                //   setupMintbaseWallet({
                //     contractId: "hellovirtualworld.mintspace2.testnet",
                //     successUrl: "http://localhost:5173",
                //     walletUrl: "https://wallet.mintbase.xyz",
                //     callbackUrl: "http://localhost:5173",
                // }),
                  ],
      });
      const modal = setupModal(selector, {
        contractId: "test.testnet",
      });

        const wallet = await selector.wallet("my-near-wallet");
        if (wallet) {
          const accounts = await wallet.getAccounts();
          const account = await wallet.signIn({ contractId: "test.testnet"});
          // Выполните необходимые действия после входа в кошелек
        };

      setSelector(selector);
      setModal(modal);
      
    };

    initializeWallet();
  }, []);

  const signIn = async () => {
    if (!selector) return; // Проверка на наличие инициализированного selector
    const wallet = await selector.wallet("my-near-wallet");
    if (wallet) {
      const accounts = await wallet.getAccounts();
      const account = await wallet.signIn({ contractId: "test.testnet",});
      // Выполните необходимые действия после входа в кошелек
    }
  };
  
  const signOut = async () => {
    if (!selector) return; // Проверка на наличие инициализированного selector
    const wallet = await selector.wallet("my-near-wallet");
    if (wallet) {
      await wallet.signOut();
    }
  };
  
  const getAccounts = async () => {
    if (!selector) return; // Проверка на наличие инициализированного selector
    const wallet = await selector.wallet("my-near-wallet");
    if (wallet) {
      const accounts = await wallet.getAccounts();
      console.log(accounts); // [{ accountId: "test.testnet" }]
    }
  };

  return (
    <div>
      <h1>NEAR Wallet Authorization</h1>
      <button onClick={signIn}>Sign in</button>
      <button onClick={signOut}>Sign Out</button>
      <button onClick={getAccounts}>Get Accounts</button>
      {modal && (
        <button onClick={() => modal.show()}>Authorize with NEAR Wallet</button>
      )}
    </div>
  );
};