<script>
export default {
  computed: {
    theme() {
      return this.$store.state.theme;
    },
  },
  watch: {
    theme(newVal) {
      this.options = {
        chart: {
          background: '0',
        },
        xaxis: {
          categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
        },
        theme: {
          mode: newVal,
          pallete: 'pallete3',
        },
      };
      console.log(newVal);
    },
  },
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
          mode: 'light',
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
  mounted() {
    this.options.theme.mode = this.theme;
    console.log(this.options.theme.mode);
  },
};
</script>
<template>
  <div
    class="flex flex-col lg:flex-row lg:flex-wrap lg:justify-center justify-start mt-4 h-max overflow-y-auto"
  >
    <div class="bg-base-200 rounded-lg flex flex-col items-center p-2 m-2">
      <span class="text-center text-lg">Your investments</span>
      <apexchart
        width="380"
        type="bar"
        :options="options"
        :series="series"
      ></apexchart>
    </div>
    <div class="bg-base-200 rounded-lg flex flex-col items-center p-2 m-2">
      <span class="text-center text-lg">Mining stats</span>
      <apexchart
        width="380"
        type="line"
        :options="options"
        :series="series"
      ></apexchart>
    </div>

    <div class="bg-base-200 rounded-lg flex flex-col items-center p-2 m-2">
      <span class="text-center text-lg">Actives in markets</span>
      <apexchart
        width="380"
        type="donut"
        :options="options"
        :series="donutSeries"
      ></apexchart>
    </div>
    <div class="bg-base-200 rounded-lg flex flex-col items-center p-2 m-2">
      <span class="text-center text-lg">Your investments</span>
      <apexchart
        width="380"
        type="bar"
        :options="options"
        :series="series"
      ></apexchart>
    </div>
    <div class="bg-base-200 rounded-lg flex flex-col items-center p-2 m-2">
      <span class="text-center text-lg">Mining stats</span>
      <apexchart
        width="380"
        type="line"
        :options="options"
        :series="series"
      ></apexchart>
    </div>

    <div class="bg-base-200 rounded-lg flex flex-col items-center p-2 m-2">
      <span class="text-center text-lg">Actives in markets</span>
      <apexchart
        width="380"
        type="donut"
        :options="options"
        :series="donutSeries"
      ></apexchart>
    </div>
    <div class="bg-base-200 rounded-lg flex flex-col items-center p-2 m-2">
      <span class="text-center text-lg">Your investments</span>
      <apexchart
        width="380"
        type="bar"
        :options="options"
        :series="series"
      ></apexchart>
    </div>
    <div class="bg-base-200 rounded-lg flex flex-col items-center p-2 m-2">
      <span class="text-center text-lg">Mining stats</span>
      <apexchart
        width="380"
        type="line"
        :options="options"
        :series="series"
      ></apexchart>
    </div>

    <div class="bg-base-200 rounded-lg flex flex-col items-center p-2 m-2">
      <span class="text-center text-lg">Actives in markets</span>
      <apexchart
        width="380"
        type="donut"
        :options="options"
        :series="donutSeries"
      ></apexchart>
    </div>
  </div>
</template>
<style></style>
