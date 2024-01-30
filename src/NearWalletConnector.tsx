import React, { useState, useEffect } from 'react';
import { setupWalletSelector , AccountState, WalletSelector } from "@near-wallet-selector/core";
import { setupModal, WalletSelectorModal} from "@near-wallet-selector/modal-ui";
import { setupNearWallet } from "@near-wallet-selector/near-wallet";
import "@near-wallet-selector/modal-ui/styles.css"
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupWalletConnect } from "@near-wallet-selector/wallet-connect";
import { setupMintbaseWallet } from "@near-wallet-selector/mintbase-wallet"; 
import { Buffer as BufferPolyfill } from 'buffer'
declare var Buffer: typeof BufferPolyfill;

export const NearWalletConnector = () => {
  const [selector, setSelector] = useState<WalletSelector | null>(null);
  const [modal, setModal] = useState<WalletSelectorModal | null>(null);
  const [accounts, setAccounts] = useState<Array<AccountState>>([]);
  const mintbaseWallet =  setupMintbaseWallet({
    walletUrl: 'https://testnet.wallet.mintbase.xyz',
    callbackUrl: 'http://localhost:5173/',
    deprecated: false,
    contractId: "test.testnet"
  });

  useEffect(() => {
    const initializeWallet = async () => {
      const selector = await setupWalletSelector({
        network: "testnet",
        modules: [setupNearWallet(),
                  setupMyNearWallet(),
                  // setupWalletConnect({
                  //   projectId: "c4f79cc...",
                  //   metadata: {
                  //     name: "NEAR Wallet Selector",
                  //     description: "Example dApp used by NEAR Wallet Selector",
                  //     url: "https://github.com/near/wallet-selector",
                  //     icons: ["https://avatars.githubusercontent.com/u/37784886"],
                  //   },
                  //   chainId: "near:testnet",
                  // }),
                  mintbaseWallet,
                  ],
      });
      const modal = setupModal(selector, {
        contractId: "test.testnet",
      });

      setSelector(selector);
      setModal(modal);
      
    };

    initializeWallet();
  }, []);

  // const signIn = async () => {
  //   if (!selector) return; // Проверка на наличие инициализированного selector
  //   const wallet = await selector.wallet("my-near-wallet");
  //   if (wallet) {
  //     const account = await wallet.signIn({ contractId: "test.testnet",});
  //     // Выполните необходимые действия после входа в кошелек
  //   }
  // };
  
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
      {/* <button onClick={signIn}>Sign in</button> */}
      <button onClick={signOut}>Sign Out</button>
      <button onClick={getAccounts}>Get Accounts</button>
      {modal && (
        <button onClick={() => modal.show()}>Authorize with NEAR Wallet</button>
      )}
    </div>
  );
};