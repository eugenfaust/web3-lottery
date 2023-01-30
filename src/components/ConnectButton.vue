<script>
import ClickOutSide from '../directives/ClickOutSide';
import ConnectModalVue from './ConnectModal.vue';

export default {
  data() {
    return {
      openMenu: false,
    };
  },
  props: {},
  methods: {
    closeMenu() {
      if (this.openMenu) {
        this.openMenu = false;
      }
    },
    openConnectModal() {
      this.$store.commit('setConnectModal', true);
    },
    disconnectWallet() {
      this.$store.commit('setAddress', undefined);
      this.closeMenu();
    },
  },
  directives: {
    ClickOutSide,
  },
  computed: {
    address() {
      return this.$store.state.address;
    },
  },
  mounted() {},
  components: { ConnectModalVue },
};
</script>
<template>
  <div v-if="!address" class="btn btn-sm rounded-full" @click="openConnectModal">
    Connect wallet
  </div>
  <div v-else>
    <div class="dropdown dropdown-end" :class="{ 'dropdown-open': openMenu }">
      <label
        v-click-out-side="closeMenu"
        @click="openMenu = !openMenu"
        class="mr-5 flex bg-base-300 rounded-full transform transition duration-200 hover:scale-110 cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          class="w-8 h-8 border-2 border-current p-1 rounded-full fill-current"
        >
          <path
            d="M2.273 5.625A4.483 4.483 0 015.25 4.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0018.75 3H5.25a3 3 0 00-2.977 2.625zM2.273 8.625A4.483 4.483 0 015.25 7.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0018.75 6H5.25a3 3 0 00-2.977 2.625zM5.25 9a3 3 0 00-3 3v6a3 3 0 003 3h13.5a3 3 0 003-3v-6a3 3 0 00-3-3H15a.75.75 0 00-.75.75 2.25 2.25 0 01-4.5 0A.75.75 0 009 9H5.25z"
          />
        </svg>
        <span class="mt-1 ml-2 mr-2 select-none"
          >{{ address.substring(0, 2) }}...{{
            address.substring(address.length - 4, address.length)
          }}</span
        >
      </label>
      <ul
        class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-60"
        :class="{ hidden: !openMenu }"
      >
        <li @click="disconnectWallet"><p>Disconnect wallet</p></li>
      </ul>
    </div>
  </div>
</template>
