<script>
import { useToast } from 'vue-toastification';
import ConnectButton from './ConnectButton.vue';
import ChainButton from './ChainButton.vue';
import pigLogo from '../assets/pig.svg';

export default {
  name: 'NavBar',
  mounted() {
    window.addEventListener('scroll', this.scrollNavbar);
    this.prevScrollPos = window.scrollY;
  },
  unmounted() {
    window.removeEventListener('scroll', this.scrollNavbar);
  },
  data() {
    return {
      pigLogo,
      isScrolling: false,
      prevScrollPos: 0,
    };
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  computed: {
    currentRoute() {
      return this.$route.path;
    },
    screenWidth() {
      return window.innerWidth;
    },
  },
  methods: {
    homePage() {
      this.$router.push('/');
    },
    showDrawer() {
      this.$store.commit('setDrawer', !this.$store.state.showDrawer);
    },
    scrollNavbar() {
      const curScrollPos = window.scrollY;
      if (curScrollPos < 50) return;
      if (this.prevScrollPos < curScrollPos) {
        this.isScrolling = true;
      } else {
        this.isScrolling = false;
      }
      this.prevScrollPos = curScrollPos;
    },
  },
  components: { ConnectButton, ChainButton },
};
</script>

<template>
  <div
    class="navbar bg-neutral border-b-2 border-primary border-opacity-50 bg-opacity-50 fixed top-0 duration-300 z-20"
    :class="{ '-translate-y-16': isScrolling }"
  >
    <div class="flex-1 ml-2 cursor-pointer">
      <img :src="pigLogo" class="inline-block w-8 h-8 fill-neutral-content hover:animate-spin">

      <a
        class="ml-2 select-none normal-case text-xl text-primary"
        @click="homePage"
        >Jacuzzi Lottery</a
      >
    </div>
    <router-link to="/claim">
      <button
        class="btn mr-5 flex bg-base-300 rounded-full transform transition duration-200 hover:scale-110 hover:bg-base-300 cursor-pointer min-h-8 h-8 border-2 border-current text-current "
      >
        Faucet TUSDT
      </button>
    </router-link>
    <ChainButton />
    <ConnectButton />
  </div>
</template>
