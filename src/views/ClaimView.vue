<script>
import { useToast } from 'vue-toastification';
import Web3Service from '../services/Web3';
import pigGif from '../assets/pig_logo.gif';

export default {
  setup() {
    const toast = useToast();
    return { toast };
  },
  data() {
    return {
      pigGif,
      isClaimingUSDT: false,
    };
  },
  computed: {
    address() {
      return this.$store.state.address;
    },
  },
  methods: {
    async claimUSDT() {
      this.isClaimingUSDT = true;
      await Web3Service.mintUSDT(this.address, 100);
      this.toast.success('100 USDT was claimed.');
      this.isClaimingUSDT = false;
    },
  },
};
</script>
<template>
  <div
    class="w-full min-h-screen text-neutral-content flex flex-col justify-center items-center p-2"
  >
    <p class="text-4xl text-center mb-5">Claim free coins to test our lottery!</p>
    <img :src="pigGif" class=" mb-2 h-[250px] w-[350px] rounded-md" />
    <div class="flex flex-row p-2 mt-5 justify-around w-80">
      <a
        class="btn btn-primary text-neutral-content border-primary"
        href="https://testnet.bnbchain.org/faucet-smart"
        target="_blank"
      >
        Claim BNB
    </a>
      <button
      class="btn btn-primary text-neutral-content border-primary"
        :class="{
          'btn-disabled loading': isClaimingUSDT,
        }"
        @click="claimUSDT"
      >
        Claim USDT
      </button>
    </div>
  </div>
</template>
