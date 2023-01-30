<script>
import 'swiper/swiper.min.css';
import 'swiper/swiper-bundle.min.css';
import { useToast } from 'vue-toastification';
import gsap from 'gsap';
// eslint-disable-next-line import/no-unresolved
import { Swiper, SwiperSlide } from 'swiper/vue';
import Web3 from '../services/Web3';
/*
import Cat1 from '../assets/nft/cat1.jpg';
import Cat2 from '../assets/nft/cat2.jpg';
import Cat3 from '../assets/nft/cat3.jpg';
import Cat4 from '../assets/nft/cat4.jpg'; */

export default {
  setup() {
    const toast = useToast();
    return { toast };
  },
  data() {
    return {
      swiper: undefined,
      tweenedPrice: 10,
      price: 10,
      tokenID: 1,
      currentCat: {
        id: 0,
        title: 'Anime Cat #1',
        img: 'https://www.linkpicture.com/q/cat1.jpg',
        price: 10,
      },
      cats: [
        {
          id: 0,
          title: 'Anime Cat #1',
          img: 'https://www.linkpicture.com/q/cat1.jpg',
          price: 10,
        },
        {
          id: 1,
          title: 'Anime Cat #2',
          img: 'https://www.linkpicture.com/q/cat2_1.jpg',
          price: 15,
        },
        {
          id: 2,
          title: 'Anime Cat #3',
          img: 'https://www.linkpicture.com/q/cat3_1.jpg',
          price: 5,
        },
        {
          id: 3,
          title: 'Anime Cat #4',
          img: 'https://www.linkpicture.com/q/cat4_1.jpg',
          price: 20,
        },
      ],
      isBuying: false,
    };
  },
  methods: {
    async buyNFT() {
      this.isBuying = true;
      const uri = this.currentCat.img;
      try {
        const response = await Web3.buyNFT(this.$store.state.address, uri);
        if (!response.status) {
          this.toast.errro(
            'Got error! Try again',
          );
          this.isBuying = false;
          return;
        }
        console.log(response);
        const nfts = localStorage.getItem('nfts') || [];
        nfts.push({ tokenId: response.events.Transfer.returnValues.tokenId });
        localStorage.setItem('nfts', JSON.stringify(nfts));
        this.toast.success(
          'You are successfully buy our NFT. Congratulations!',
        );
      } catch (error) {
        this.toast.error(error.message);
      } finally {
        this.isBuying = false;
      }
    },
    async getURI() {
      try {
        const result = await Web3.getURI(this.tokenID);
        const ipfsUrl = `https://ipfs.io/ipfs/${result.substring(7)}`;
        const response = await (await fetch(ipfsUrl)).json();
        const imageUrl = `https://ipfs.io/ipfs/${response.image.substring(7)}`;
        this.currentCat.img = imageUrl;
      } catch (error) {
        this.toast.error(error.message);
      }
    },
    onSwiper(swiper) {
      this.swiper = swiper;
    },
    changeCat(event) {
      this.currentCat = this.cats.find(
        (cat) => cat.id === Number(event.target.value),
      );
      this.price = this.currentCat.price;
      this.swiper.slideTo(event.target.value);
    },
  },
  watch: {
    price(n) {
      const dec = Number(n);
      gsap.to(this, {
        duration: 1,
        tweenedPrice: dec || 0,
        modifiers: { tweenedPrice: (tweenedPrice) => tweenedPrice.toFixed(0) },
      });
    },
  },
  components: { Swiper, SwiperSlide },
};
</script>
<template>
  <div class="hero min-h-screen">
    <div class="flex flex-col items-center">
      <swiper :slides-per-view="1" class="w-96 h-96" @swiper="onSwiper">
        <swiper-slide v-for="cat in cats" :key="cat.title">
          <img :src="cat.img" class="w-96 h-96 mask mask-squircle" />
        </swiper-slide>
      </swiper>
      <form action="" class="form-control w-full max-w-xs mt-5">
        <label class="label">
          <span class="label-text">Choose your NFT!</span>
        </label>
        <select class="select select-primary" @change="changeCat">
          <option
            v-for="cat in cats"
            :key="cat.title"
            :value="cat.id"
            :class="{ selected: cat.title === currentCat.title }"
          >
            {{ cat.title }}
          </option>
        </select>
      </form>
      <button
        class="btn mt-5 btn-primary"
        :class="{ loading: isBuying }"
        :disabled="isBuying"
        @click="buyNFT"
      >
        <p v-if="isBuying">Buying...</p>
        <p v-else>Get this for {{ tweenedPrice }}$</p>
      </button>
      <div class="flex flex-col mt-5">
        <input
          type="text"
          placeholder="Enter tokenID"
          class="input input-bordered input-primary w-full max-w-xs"
          v-model="tokenID"
        />
        <button class="btn mt-2 btn-primary" @click="getURI">Get URI</button>
      </div>
    </div>
  </div>
</template>
