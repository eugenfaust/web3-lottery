<script>
import { useToast } from 'vue-toastification';
import Web3 from '../services/Web3';
import Lotteries from '../components/Lotteries.vue';
import FinishedLotteries from '../components/FinishedLotteries.vue';
import ConnectButton from '../components/ConnectButton.vue';
import pigGif from '../assets/pig_logo.gif';

export default {
  setup() {
    const toast = useToast();
    const tokenID = localStorage.getItem('tokenID') || 1;
    return { toast, tokenID, pigGif };
  },
  mounted() {},
  data() {
    return {
      nftImg: undefined,
      buying: false,
      finishing: false,
      creating: false,
      newInstanceTitle: 'Make America great again!',
      newInstanceContract: '0x33C5B795B412326C8567ff8Ee045121471054f5C',
      ticketPrice: 1,
      ticketPriceID: '',
      duration: 1,
      durationID: '',
      finishID: 2,
    };
  },
  computed: {
    address() {
      return this.$store.state.address;
    },
  },
  methods: {
    async setTicketPrice() {
      this.creating = true;
      const response = await Web3.setTicketPrice(
        this.address,
        this.ticketPriceID,
        this.ticketPrice,
      );
      console.log(response);
      this.creating = false;
    },
    async setDuration() {
      this.creating = true;
      const response = await Web3.setDuration(
        this.address,
        this.durationID,
        this.duration,
      );
      console.log(response);
      this.creating = false;
    },
    async spawnLottery() {
      this.creating = true;
      const response = await Web3.spawnLottery(this.address);
      console.log(response);
      this.creating = false;
    },
    async finishLottery() {
      this.finishing = true;
      const response = await Web3.finishLottery(this.address, this.finishID);
      console.log(response);
      this.finishing = false;
    },
  },
  components: { Lotteries, FinishedLotteries, ConnectButton },
};
</script>
<template>
  <div
    class="w-full min-h-screen justify-center items-center"
  >
    <div class="mt-5 text-center flex flex-col">
      <div class="flex flex-col">
        <Lotteries />
        <FinishedLotteries />
      </div>
      <button class="btn hidden" @click="spawnLottery">Spawn</button>
    </div>
  </div>
</template>
<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
