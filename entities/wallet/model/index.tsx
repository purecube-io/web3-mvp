// stores/walletStore.ts
import { makeAutoObservable } from 'mobx';

class WalletStore {
  account: string | null = null;
  balance: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  // Set wallet account and balance
  setAccount(account: string | null) {
    this.account = account;
  }

  setBalance(balance: string | null) {
    this.balance = balance;
  }

  // Reset wallet state when disconnecting
  reset() {
    this.account = null;
    this.balance = null;
  }
}

const walletStore = new WalletStore();
export default walletStore;
