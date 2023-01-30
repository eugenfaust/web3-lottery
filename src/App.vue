<script>
import NavbarVue from './components/NavBar.vue';
import FooterVue from './components/Footer.vue';
import Web3 from './services/Web3';
import background from './assets/bg.jpg';
import ConnectModal from './components/ConnectModal.vue';

export default {
  data() {
    return { background };
  },
  methods: {
    subscribeOnChanges() {
      Web3.onChainChange(this.onChainChange);
      Web3.onAccountChange(this.onAccountChange);
    },
    onChainChange(chainId) {
      let decChainId = chainId;
      if (typeof chainId === 'string') {
        decChainId = parseInt(chainId, 16);
      }
      this.$store.commit('setChainId', decChainId);
    },
    onAccountChange(accounts) {
      this.$store.commit('setAddress', accounts[0]);
    },
  },
  computed: {
    address() {
      return this.$store.state.address;
    },
    theme() {
      return this.$store.state.theme === 'light' ? 'night' : 'night';
    },
  },
  watch: {
    address() {
      this.subscribeOnChanges();
    },
  },
  components: { NavbarVue, FooterVue, ConnectModal },
  async mounted() {
    this.$store.commit('setTheme', localStorage.getItem('theme') || 'light');
    const wallet = await Web3.getWallet();
    if (wallet) {
      this.$store.commit('setAddress', wallet);
      const chain = await Web3.getChainId();
      this.$store.commit('setChainId', chain);
      this.subscribeOnChanges();
    }
  },
};
</script>

<template>
  <div
    :data-theme="theme"
    class="bg-repeat bg-auto"
    v-bind:style="{ 'background-image': 'url(' + background + ')' }"
  >
    <ConnectModal />
    <NavbarVue />
    <div class="flex justify-center items-center pt-16">
      <router-view />
    </div>
    <FooterVue />
  </div>
</template>
