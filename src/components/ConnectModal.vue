<script>
import { useToast } from 'vue-toastification';
import Web3 from '../services/Web3';
import ClickOutSide from '../directives/ClickOutSide';
import CoinBaseSvg from '../assets/wallets/coinbase.svg';
import MetamaskSvg from '../assets/wallets/metamask.svg';
import WalletConnectSvg from '../assets/wallets/walletconnect.svg';
import InjectedSvg from '../assets/wallets/injected.svg';

export default {
  setup() {
    const toast = useToast();
    return { toast };
  },
  data() {
    return {
      CoinBaseSvg,
      MetamaskSvg,
      WalletConnectSvg,
      InjectedSvg,
      isInjected: false,
      wallets: [
        {
          wallet: 'metamask',
          data: { title: 'Metamask', svg: MetamaskSvg },
        },
        {
          wallet: 'coinbase',
          data: { title: 'Coinbase', svg: CoinBaseSvg },
        },
        {
          wallet: 'walletconnect',
          data: { title: 'WalletConnect', svg: WalletConnectSvg },
        },
      ],
    };
  },
  props: {},
  methods: {
    closeModal() {
      if (this.displayModal) {
        this.$store.commit('setConnectModal', false);
      }
    },
    async connectWallet(wallet) {
      const result = await Web3.connectWallet(wallet);
      if (!result) {
        this.toast.error(`We didn't found ${wallet} in your browser.`);
        return;
      }
      const chain = await Web3.getChainId();
      this.$store.commit('setAddress', result);
      this.$store.commit('setChainId', chain);
      this.closeModal();
    },
  },
  computed: {
    displayModal() {
      return this.$store.state.showConnectModal;
    },
  },
  watch: {
    async displayModal(status) {
      if (status) {
        const injected = await Web3.getWallet();
        if (injected) {
          const injectedData = this.wallets.find(
            (el) => el.wallet === 'injected',
          );
          if (!injectedData) {
            this.wallets.unshift({
              wallet: 'injected',
              data: {
                title: 'Injected',
                svg: InjectedSvg,
              },
            });
          }
        }
      }
    },
  },
  directives: {
    ClickOutSide,
  },
};
</script>
<template>
  <div
    class="modal"
    :class="{ 'modal-open': displayModal }"
    @click="closeModal"
  >
    <div class="modal-box relative" @click.stop="">
      <label
        for="my-modal-3"
        class="btn btn-sm btn-circle absolute right-2 top-2"
        @click="closeModal"
        >✕</label
      >
      <h3 class="text-lg font-bold">Connect wallet</h3>
      <p class="py-4 text-sm">
        Start by connecting with one of the wallets below. Be sure to store your
        private keys or seed phrase securely. Never share them with anyone.
      </p>
      <div class="flex flex-row justify-center">
        <div
          v-for="wallet in wallets"
          :key="wallet.wallet"
          class="w-18 h-18 p-2 btn-outline rounded-xl cursor-pointer"
          @click="connectWallet(wallet.wallet)"
        >
          <div class="flex flex-col items-center">
            <img :src="wallet.data.svg" class="w-10 h-10" />

            <p class="text-sm">{{ wallet.data.title }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
