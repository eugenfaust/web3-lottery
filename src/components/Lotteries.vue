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
      lotteries: [],
      buying: false,
      updating: false,
      userBalance: 0,
      curToastId: 0,
    };
  },
  async mounted() {
    if (typeof this.address !== 'undefined') {
      await this.updateBalance();
      await this.updateLotteries();
    }
    setInterval(() => {
      this.updateLotteries();
      this.updateBalance();
    }, 10000);
  },
  methods: {
    async updateBalance() {
      this.userBalance = Number(await Web3Service.balanceOf(this.address));
    },
    async updateLotteries() {
      this.updating = true;
      try {
        this.lotteries = await Web3Service.getLotteries(this.address);
      } catch (error) {
        this.toast.dismiss(this.curToastId);
        this.curToastId = this.toast.error(
          'Error while updating lotteries. Please, try refresh your page or change network to BSC Testnet',
        );
        console.log(error);
      } finally {
        this.updating = false;
      }
    },
    async buyTicket(address, lotteryId) {
      this.buying = true;
      try {
        const result = await Web3Service.buyTicket(
          this.address,
          address,
          lotteryId,
        );
        if (result) {
          this.toast.success('Done!');
        } else {
          this.toast.error('Error! Try again.');
        }
      } catch (error) {
        this.toast.error(error.message);
      } finally {
        this.buying = false;
        this.updateLotteries();
        this.updateBalance();
      }
    },
  },
  computed: {
    address() {
      return this.$store.state.address;
    },
  },
  watch: {
    address(newAddress) {
      if (newAddress !== 'undefined' && !this.updating) {
        this.updateBalance();
        this.updateLotteries();
      }
    },
  },
};
</script>
<template>
  <div
    class="w-full rounded-xl flex flex-col justify-center items-center p-5 text-neutral-content"
  >
    <div class="flex ml-5 animate-bounce items-center">
      <p class="text-4xl">Active lotteries!</p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        class="w-8 h-8 ml-5 stroke-neutral-content cursor-pointer hover:stroke-primary duration-200"
        :class="{ 'animate-spin': updating }"
        @click="updateLotteries"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
        />
      </svg>
    </div>
    <Transition mode="out-in">
      <div
        class="w-4/5 justify-center flex flex-col md:flex-row flex-wrap gap-5 mt-5 items-center"
        v-if="lotteries.length > 0"
      >
        <div
          v-for="lottery in lotteries"
          :key="lottery.id"
          class="w-full max-w-xs rounded-xl bg-opacity-100 bg-base-300 text-base-content border-2 border-primary"
        >
          <p
            class="bg-primary p-2 bg-opacity-70 rounded-t-md text-2xl text-neutral-content"
          >
            {{ lottery.title }}
          </p>
          <img :src="pigGif" class="mb-2 w-full h-[250px] rounded-t-md" />
          <div class="stat-title">Players in game</div>
          <div class="stat-value mb-2">{{ lottery.players.length }}</div>

          <div class="stat-title">Prize pool</div>
          <div class="stat-value mb-2">{{ lottery.prizePool }}$</div>

          <div class="stat-title">Ticket price</div>
          <div class="stat-value mb-2">{{ lottery.ticketPrice }}$</div>

          <div class="stat-title">Winners</div>
          <div class="stat-value mb-2">{{ lottery.percentWinners }}%</div>

          <div class="stat-title">Ends in</div>
          <div class="stat-value text-2xl mb-2">
            {{ lottery.estimatedTime }}
          </div>
          <button
            v-if="userBalance < lottery.ticketPrice"
            class="mt-2 btn rounded-t-none w-full btn-disabled border-none text-neutral-content"
          >
            Not enough USDT
          </button>
          <button
            v-else-if="!lottery.status"
            class="mt-2 btn btn-primary rounded-t-none w-full border-none animate-pulse"
            :class="{
              'btn-disabled loading text-neutral-content animate-none': buying,
            }"
            @click="buyTicket(lottery.address, lottery.id)"
          >
            Buy ticket
          </button>
          <button
            v-else
            class="mt-2 btn rounded-t-none w-full btn-disabled border-none text-neutral-content"
          >
            You are in game
          </button>
        </div>
      </div>
      <div
        v-else
        class="flex flex-col items-center justify-center p-10 mt-5 rounded-full"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-12 h-12 animate-spin mb-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z"
          />
        </svg>

        <p class="text-xl text-neutral-content">Loading lotteries...</p>
      </div>
    </Transition>
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
