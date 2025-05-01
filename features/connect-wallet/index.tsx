import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import Web3 from 'web3';
import { Button } from 'shared/ui';
import Swal from 'sweetalert2';
import walletStore from 'entities/wallet/model'; // Import MobX store

export interface ConnectWalletProps {
  children: string;
  type: string;
}

export const ConnectWallet = observer(
  ({ children, type }: ConnectWalletProps) => {
    // Connect MetaMask wallet
    const connectMetaMask = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const web3 = new Web3(window.ethereum);
        try {
          // Request account access if the user hasn't granted permission yet
          await window.ethereum.request({ method: 'eth_requestAccounts' });

          // Get the current account
          const accounts = await web3.eth.getAccounts();
          console.log('Connected MetaMask account:', accounts[0]);
          walletStore.setAccount(accounts[0]); // Update the account in MobX store

          // Fetch the balance
          const userBalance = await web3.eth.getBalance(accounts[0]);
          walletStore.setBalance(web3.utils.fromWei(userBalance, 'ether')); // Update the balance in MobX store

          Swal.fire({
            icon: 'success',
            title: 'Successfully connected to MetaMask!',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        } catch (error) {
          console.error('Error connecting to MetaMask:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error connecting to MetaMask!',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        }
      } else {
        console.log('MetaMask is not installed!');
        Swal.fire({
          icon: 'error',
          title: 'MetaMask is not installed!',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }
    };

    // Disconnect wallet
    const disconnectWallet = async () => {
      walletStore.reset(); // Reset the wallet data in MobX store
      Swal.fire({
        icon: 'info',
        title: 'Wallet disconnected.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    };

    useEffect(() => {
      // If account is already available (from initial load), you can directly use the MobX store
      if (walletStore.account) {
        console.log(`Account: ${walletStore.account}`);
      }
    }, []);

    return (
      <div>
        {type === 'profile' ? (
          walletStore.account ? (
            <div className="text-center">
              <div className="text-white text-lg">
                Account: {walletStore.account}
              </div>
              <div className="text-white text-base">
                Balance: {walletStore.balance} ETH
              </div>
              <button
                onClick={disconnectWallet}
                className="mt-2 bg-red-500 text-white py-1 px-3 rounded-full"
              >
                Disconnect Wallet
              </button>
            </div>
          ) : (
            <div
              className="flex justify-center items-center text-2xl rounded-full bg-neutral-700 w-12 h-12"
              onClick={connectMetaMask}
            >
              +
            </div>
          )
        ) : walletStore.account ? (
          <Button onClick={disconnectWallet}>Disconnect Wallet</Button>
        ) : (
          <Button onClick={connectMetaMask}>{children}</Button>
        )}
      </div>
    );
  },
);
