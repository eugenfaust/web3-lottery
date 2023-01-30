import { createApp } from 'vue';
import Toast from 'vue-toastification';
import VueApexCharts from 'vue3-apexcharts';
import router from './router';
import './style.css';
import App from './App.vue';
import 'vue-toastification/dist/index.css';

import store from './store';

createApp(App)
  .use(Toast, { maxToasts: 3 })
  .use(VueApexCharts)
  .use(router)
  .use(store)
  .mount('#app');
