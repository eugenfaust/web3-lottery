<script>
export default {
  data() {
    return {
      options: {
        chart: {
          background: '0',
        },
        xaxis: {
          categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
        },
        theme: {
          mode: 'dark',
          pallete: 'pallete3',
        },
      },
      series: [
        {
          name: 'series-1',
          data: [30, 40, 45, 50, 49, 60, 70, 91],
        },
      ],
      donutSeries: [44, 55, 41, 17, 15],
    };
  },
};
</script>
<template>
  <div class="flex flex-col bg-base-300 rounded-lg p-5">
    <div class="form-control w-full max-w-xs m-2">
      <label class="label">
        <span class="label-text">What is your wallet?</span>
      </label>
      <input
        type="text"
        placeholder="Type here"
        class="input input-bordered w-full max-w-xs"
      />
    </div>
    <div class="form-control w-full max-w-xs m-2">
      <label class="label">
        <span class="label-text">What is your private key?</span>
      </label>
      <input
        type="text"
        placeholder="Type here"
        class="input input-bordered input-success w-full max-w-xs"
      />
    </div>
    <select class="select select-accent w-full max-w-xs m-2">
      <option disabled selected>Dark mode or light mode?</option>
      <option>Auto</option>
      <option>Dark mode</option>
      <option>Light mode</option>
    </select>
    <button class="btn btn-outline m-2 w-full btn-success">Save</button>
  </div>
</template>
<style></style>
