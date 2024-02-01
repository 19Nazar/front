import React, { useState, useEffect } from 'react';
import { setupWalletSelector , AccountState, WalletSelector } from "@near-wallet-selector/core";
import { setupModal, WalletSelectorModal} from "@near-wallet-selector/modal-ui";
import { setupNearWallet } from "@near-wallet-selector/near-wallet";
import "@near-wallet-selector/modal-ui/styles.css"
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import { setupMathWallet } from "@near-wallet-selector/math-wallet";
import { setupNarwallets } from "@near-wallet-selector/narwallets";
import CustomModal from './modal';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import {Contract, WalletConnection } from 'near-api-js';


export const NearWalletConnector = () => {
  
  const [selector, setSelector] = useState<WalletSelector | null>(null);
  const [modal, setModal] = useState<WalletSelectorModal | null>(null);
  const [accounts, setAccounts] = useState<Array<AccountState>>([]);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [nick, setNick] = useState("");  
  const [publicKey, setPublicKey] = useState("");  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGroupCreated, setIsGroupCreated] = useState(false);


  useEffect(() => {
    const initializeWallet = async () => {
      const selector = await setupWalletSelector({
        network: "testnet",
        modules: [setupNearWallet({walletUrl: "https://wallet.testnet.near.org",}),
                  setupMyNearWallet(),
                  setupMeteorWallet(),
                  setupMathWallet(),
                  setupNarwallets(),
                  ],
      });
      const modal = setupModal(selector, {
        contractId: "dev-1706786709334-11063911604801",
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
      const publicKey = account[0].publicKey ?? "";
      setPublicKey(publicKey);
      setNick(accountId);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleGroupCreate = async () => {
    const nameGroupInput = document.getElementById("nameCreatGroupInpt") as HTMLInputElement;
    if (nameGroupInput) {
        const nameGroup = nameGroupInput.value;
        await console.log(nameGroup);
        await console.log(nick)
        await console.log(publicKey)
        if (selector) {
          try {
          const wallet = await selector.wallet("my-near-wallet");
          await wallet.signAndSendTransaction({
            actions: [{
              type: "FunctionCall",
              params: {
                methodName: "create_factory_subaccount_and_deploy",
                args: { name: nameGroup, owner: nick, public_key: publicKey },
                gas: "30000000000000",
                deposit: "100000000",
              }
            }]
            
          });
            try {
              await wallet.signAndSendTransaction({
                actions: [{
                  type: "FunctionCall",
                  params: {
                    methodName: "init",
                    args: { owner: nick },
                    gas: "300000000000",
                    deposit: "100000000",
                  }
                }]
              });
              console.log('Owner innit');
            } catch (error) {
              console.error('Error add owner:', error);
            }
          console.log('Group create successfully');
          // Обновите UI после успешного добавления
          } catch (error) {
              console.error('Error create group:', error);
              // Обработайте ошибку, если необходимо
          }
      }
  // Обновите UI после успешного добавления
    }
    setIsGroupCreated(true);
};

  const handleAddUserToGroup = async () => {
      const userNameInput = document.getElementById("userNameInput") as HTMLInputElement;
      if (userNameInput) {
          const userNameValue = userNameInput.value;
          if (selector) {
            try {
            const wallet = await selector.wallet("my-near-wallet");
            await wallet.signAndSendTransaction({
              actions: [{
                type: "FunctionCall",
                params: {
                  methodName: "add_to_group",
                  args: { account_id: userNameValue },
                  gas: "300000000000",
                  deposit: "100000000",
                }
              }]
            });
            console.log('User added to group successfully');
            // Обновите UI после успешного добавления
            } catch (error) {
                console.error('Error adding user to group:', error);
                // Обработайте ошибку, если необходимо
            }
        }
    // Обновите UI после успешного добавления
    }
  };
 

  const handleAddPermissionToUser  = async () => {
    const userNameInput = document.getElementById("addPermissionToUserNameInput") as HTMLInputElement;
    const userPermission = document.getElementById("addPermissionToUserPermissionInput") as HTMLInputElement;
    if (userNameInput && userPermission) {
        const accountId  = userNameInput.value;
        const permission = parseInt(userPermission.value, 10);
        if (selector) {
          try {
          const wallet = await selector.wallet("my-near-wallet");
          await wallet.signAndSendTransaction({
            actions: [{
              type: "FunctionCall",
              params: {
                methodName: "add_permission_to_user",
                args: { account_id: accountId, permission: permission  },
                gas: "300000000000",
                deposit: "100000000",
              }
            }]
          });
          console.log('Permission added to user successfully');
          // Обновите UI после успешного добавления
          } catch (error) {
              console.error('Error adding permission to user:', error);
              // Обработайте ошибку, если необходимо
          }
      }
  // Обновите UI после успешного добавления
  }
  };


  const handleDeleteFromGroup  = async () => {
    const userNameInput = document.getElementById("deleteUserInput") as HTMLInputElement;
    if (userNameInput) {
        const userNameValue = userNameInput.value;
        if (selector) {
          try {
          const wallet = await selector.wallet("my-near-wallet");
          await wallet.signAndSendTransaction({
            actions: [{
              type: "FunctionCall",
              params: {
                methodName: "delete_from_group",
                args: { account_id: userNameValue },
                gas: "300000000000",
                deposit: "100000000",
              }
            }]
          });
          console.log('User deleted from group successfully');
          // Обновите UI после успешного добавления
          } catch (error) {
              console.error('Error deleting user from group:', error);
              // Обработайте ошибку, если необходимо
          }
      }
  // Обновите UI после успешного добавления
  }
};


const handleTransferGroup  = async () => {
  const userNameInput = document.getElementById("transferGroup") as HTMLInputElement;
  if (userNameInput) {
      const newOwner  = userNameInput.value;
      if (selector) {
        try {
        const wallet = await selector.wallet("my-near-wallet");
        await wallet.signAndSendTransaction({
          actions: [{
            type: "FunctionCall",
            params: {
              methodName: "transfer_group",
              args: { new_owner: newOwner  },
              gas: "300000000000",
              deposit: "100000000",
            }
          }]
        });
        console.log('Group ownership transferred successfully');
        // Обновите UI после успешного добавления
        } catch (error) {
            console.error('Error transferring group ownership:', error);
            // Обработайте ошибку, если необходимо
        }
    }
// Обновите UI после успешного добавления
}
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
              <Tab>Transfer group</Tab>
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
                    <input id="userNameInput" className="inputt" placeholder="Name"/>
                  </form>
                  <button className="button_in_TabPanel" id="addUserButton" onClick={handleAddUserToGroup}>Add</button>
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
                    <input id='addPermissionToUserNameInput' className="inputt" placeholder="Name" />
                  </form>
                  <div>
                    <h3>Set permission:</h3>
                  </div>
                  <form>
                    <select id="addPermissionToUserPermissionInput" className="inputt">
                      <option disabled selected>Chose permission</option>
                      <option value="0">Owner</option>
                      <option value="1">Admin</option>
                      <option value="2">Add to group</option>
                      <option value="3">Delete from group</option>
                    </select>
                  </form>
                  <button className="button_in_TabPanel" onClick={handleAddPermissionToUser}>Add</button>
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
                    <input id='deleteUserInput' className="inputt" placeholder="Name" />
                  </form>
                  <button className="button_in_TabPanel" onClick={handleDeleteFromGroup}>Delete</button>
                </div>
              </TabPanel>
              <TabPanel>
                <div className="start_module">
                    <h1>You can transfer your group</h1>
                </div>
                <div className="content_TabPanel">
                  <div>
                    <h3>Insert user name:</h3>
                  </div>
                  <form>
                    <input id='transferGroup' className="inputt" placeholder="Name" />
                  </form>
                  <button className="button_in_TabPanel" onClick={handleTransferGroup}>Transfer</button>
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