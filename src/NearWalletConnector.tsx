import React, { useState, useEffect } from 'react';
import { setupWalletSelector , AccountState, WalletSelector } from "@near-wallet-selector/core";
import { setupModal, WalletSelectorModal} from "@near-wallet-selector/modal-ui";
import { setupNearWallet } from "@near-wallet-selector/near-wallet";
import "@near-wallet-selector/modal-ui/styles.css"
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
// import { setupWalletConnect } from "@near-wallet-selector/wallet-connect";
// import { setupMintbaseWallet } from "@near-wallet-selector/mintbase-wallet"; 
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import { setupMathWallet } from "@near-wallet-selector/math-wallet";
import { setupNarwallets } from "@near-wallet-selector/narwallets";
import CustomModal from './modal';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';


export const NearWalletConnector = () => {
  
  const [selector, setSelector] = useState<WalletSelector | null>(null);
  const [modal, setModal] = useState<WalletSelectorModal | null>(null);
  const [accounts, setAccounts] = useState<Array<AccountState>>([]);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [nick, setNick] = useState("");  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGroupCreated, setIsGroupCreated] = useState(false);
  // const mintbaseWallet =  setupMintbaseWallet({
  //   walletUrl: 'https://testnet.wallet.mintbase.xyz',
  //   callbackUrl: 'http://localhost:5173/',
  //   deprecated: false,
  //   contractId: "test.testnet"
  // });

  useEffect(() => {
    const initializeWallet = async () => {
      const selector = await setupWalletSelector({
        network: "testnet",
        modules: [setupNearWallet({walletUrl: "https://wallet.testnet.near.org",}),
                  setupMyNearWallet(),
                  setupMeteorWallet(),
                  setupMathWallet(),
                  setupNarwallets(),
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
                  // mintbaseWallet,
                  ],
      });
      const modal = setupModal(selector, {
        contractId: "dev-1706442202297-21944990165378",
      });
      setSelector(selector);
      setModal(modal);
      
    };
    initializeWallet();
  }, []);


  const signOut = async () => {
    if (!selector) return; // Проверка на наличие инициализированного selector
    const wallet = await selector.wallet("my-near-wallet");
    if (wallet) {
      await wallet.signOut();
      window.location.reload();
    }
  };

  useEffect(() => {
    if (selector) {
      setIsSignedIn(selector.isSignedIn());
      getAccounts();
    }
  }, [selector]);

  
  
  const getAccounts = async () => {
    if (!selector) return;
    const wallet = await selector.wallet("my-near-wallet");
    if (wallet) {
      const account = await wallet.getAccounts();
      const accountId = account[0].accountId;
      setNick(accountId);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleGroupCreate = () => {
    // logic for create group
    setIsGroupCreated(true);
  };
 

  return (
    <div>
      <div className="Header">
      {!isSignedIn && modal && (
        <div>
          <button onClick={() => modal.show()}>Authorize with NEAR Wallet</button>
        </div>
      )}
      {isSignedIn && !isGroupCreated && (
        <div>
          <button onClick={openModal}>Create Group</button>
          <CustomModal isOpen={isModalOpen} onClose={closeModal} onGroupCreate={handleGroupCreate} />
        </div>
      )}
      {isSignedIn && (
        <div>
          <button onClick={signOut}>Sign Out {nick}</button>  
        </div>
      )}
      </div>
      <div className="line"></div>
      <div className='Tabs'>
        {isSignedIn && isGroupCreated && (
          <>
          <Tabs>
            <TabList>
              <Tab>Add users to group</Tab>
              <Tab>Set permission to the user</Tab>
              <Tab>Delete user from group</Tab>
              <Tab>Create event</Tab>
              <Tab>Read event</Tab>
              <Tab>View groups</Tab>
            </TabList>
            <div>
              <TabPanel>
                <div className="start_module">
                    <h1>You can add users to the group</h1>
                </div>
                <div className="content_TabPanel">
                  <div>
                    <h3>Insert user name:</h3>
                  </div>
                  <form>
                    <input className="inputt" placeholder="Name"/>
                  </form>
                  <button className="button_in_TabPanel">Add</button>
                </div>
              </TabPanel>
              <TabPanel>
                <div className="start_module">
                    <h1>You can set permission to the user</h1>
                </div>
                <div className="content_TabPanel">
                  <div>
                    <h3>Insert user name:</h3>
                  </div>
                  <form>
                    <input className="inputt" placeholder="Name" />
                  </form>
                  <div>
                    <h3>Set permission:</h3>
                  </div>
                  <form>
                    <input className="inputt" placeholder="Permission" />
                  </form>
                  <button className="button_in_TabPanel">Add</button>
                </div>
              </TabPanel>
              <TabPanel>
                <div className="start_module">
                    <h1>You can delete user from group</h1>
                </div>
                <div className="content_TabPanel">
                  <div>
                    <h3>Insert user name:</h3>
                  </div>
                  <form>
                    <input className="inputt" placeholder="Name" />
                  </form>
                  <button className="button_in_TabPanel">Delete</button>
                </div>
              </TabPanel>
              <TabPanel>
                <div className="start_module">
                    <h1>You can create event</h1>
                </div>
                <div className="content_TabPanel">
                  <div>
                    <h3>Name of event:</h3>
                  </div>
                  <form>
                    <input className="inputt" placeholder="Name" />
                  </form>
                  <button className="button_in_TabPanel">Create</button>
                </div>
              </TabPanel>
              <TabPanel>
                <div className="start_module">
                    <h1>You can read event</h1>
                </div>
              </TabPanel>
              <TabPanel>
                <div className="start_module">
                  <h1>You can view groups</h1>
                </div>
              </TabPanel>
            </div>

          </Tabs>
        </>
      )}
      </div>
    </div>
  );
};