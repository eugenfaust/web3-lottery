<script>
import { useToast } from 'vue-toastification';
import ClickOutSide from '../directives/ClickOutSide';
import Web3 from '../services/Web3';
import Chains from '../utils/chains';

export default {
  setup() {
    const toast = useToast();
    return { toast };
  },
  data() {
    return {
      openMenu: false,
      chains: Chains,
      unknownChain: {
        id: 0,
        title: 'Unknown',
        icon: '',
      },
      isWalletSupported: true,
      showTooltip: false,
    };
  },
  props: {},
  methods: {
    closeMenu() {
      if (this.openMenu) {
        this.openMenu = false;
      }
    },
    toggleMenu() {
      if (this.isWalletSupported) {
        this.openMenu = !this.openMenu;
      } else {
        this.openMenu = false;
        this.showTooltip = true;
        // eslint-disable-next-line no-return-assign
        setTimeout(() => (this.showTooltip = false), 2000);
      }
    },
    async changeChain(chainId) {
      const resp = await Web3.changeChain(chainId);
      if (typeof resp === 'string') {
        this.toast.error(resp);
      }
    },
  },
  directives: {
    ClickOutSide,
  },
  computed: {
    chain() {
      const curChain = this.$store.state.chainId;
      return this.chains.find((el) => el.id === curChain) ?? this.unknownChain;
    },
    address() {
      return this.$store.state.address;
    },
  },
  watch: {
    address() {
      this.isWalletSupported = Web3.getWalletType() !== 'walletconnect';
    },
  },
  mounted() {},
  components: {},
};
</script>
<template>
  <div class="flex flex-col">
    <div class="dropdown dropdown-end" :class="{ 'dropdown-open': openMenu }">
      <label
        v-click-out-side="closeMenu"
        @click="toggleMenu"
        class="mr-5 flex bg-base-300 rounded-full transform transition duration-200 hover:scale-110 cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          class="w-8 h-8 border-2 border-current p-1 rounded-full fill-current"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
          />
        </svg>

        <span class="mt-1 ml-2 mr-2 select-none max-sm:hidden">{{
          chain.title
        }}</span>
        <span class="mt-1 ml-2 mr-2 select-none sm:hidden"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            class="w-6 h-6 stroke-current"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </span>
      </label>
      <ul
        class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
        :class="{ hidden: !openMenu }"
      >
        <li v-for="c in chains" :key="c.id" @click="changeChain(c.id)">
          <p
            class="justify-between"
            :class="{ 'border-2 border-primary': c.id == chain.id }"
          >
            {{ c.title }}
          </p>
        </li>
      </ul>
    </div>
    <Transition>
      <div
        v-if="showTooltip"
        class="bg-base-200 rounded-xl p-2 absolute -bottom-5 text-xs"
      >
        Unable to switch network. Please try it on your wallet
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
