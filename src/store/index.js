import { createStore } from 'vuex';

// Create a new store instance.
const store = createStore({
  state() {
    return {
      showDrawer: false,
      showConnectModal: false,
      address: undefined,
      chainId: 1,
      theme: 'light',
    };
  },
  mutations: {
    setDrawer(state, status) {
      state.showDrawer = status;
    },
    setAddress(state, address) {
      state.address = address;
    },
    setChainId(state, chain) {
      state.chainId = Number(chain);
    },
    setConnectModal(state, status) {
      state.showConnectModal = status;
    },
    setTheme(state, theme) {
      state.theme = theme;
    },
  },
});

export default store;
