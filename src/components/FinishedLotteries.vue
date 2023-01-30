<script>
import { useToast } from 'vue-toastification';
import Web3Service from '../services/Web3';

export default {
  setup() {
    const toast = useToast();
    return { toast };
  },
  async mounted() {
    if (typeof this.address !== 'undefined') {
      await this.updateLotteries();
    }
    setInterval(() => this.updateLotteries(), 10000);
  },
  data() {
    return {
      updating: false,
      lotteries: [],
      curToastId: 0,
    };
  },
  methods: {
    async updateLotteries() {
      this.updating = true;
      try {
        this.lotteries = await Web3Service.getFinishedLotteries(this.address);
      } catch (error) {
        this.toast.dismiss(this.curToastId);
        this.curToastId = this.toast.error(
          'Error while updating lottery. Please, try refresh your page or change network to BSC Testnet',
        );
        console.log(error);
      } finally {
        this.updating = false;
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
        this.updateLotteries();
      }
    },
  },
};
</script>
<template>
  <div class="w-full rounded-xl p-5">
    <div class="flex justify-center ml-5 animate-pulse items-center mb-5">
      <p class="text-4xl text-neutral-content">Finished lotteries</p>
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
        class="overflow-x-auto flex justify-center"
        v-if="lotteries.length > 0"
      >
        <table class="table table-zebra w-3/4">
          <thead>
            <tr>
              <th>Title</th>
              <th>Players</th>
              <th>Prize pool</th>
              <th>Your prize</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="lottery in lotteries" :key="lottery.title">
              <th>{{ lottery.title }}</th>
              <td>{{ lottery.players }}</td>
              <td>{{ lottery.prizePool }}$</td>
              <td>{{ lottery.winners }}$</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else>
        <p class="text-2xl text-neutral-content" v-if="!updating">
          There are no completed lotteries yet...
        </p>
        <div
          v-else
          class="flex flex-col items-center justify-center p-10 mt-5 rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            class="w-12 h-12 animate-spin mb-5 stroke-neutral-content"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z"
            />
          </svg>

          <p class="text-xl text-neutral-content">Loading lotteries...</p>
        </div>
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
