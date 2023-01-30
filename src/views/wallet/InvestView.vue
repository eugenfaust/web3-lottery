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
      transactions: [
        {
          hash: '0x834878217bb6f2eaadc8ce6939c22757ade949e6fc778194566e8eb54200fc1a',
          action: 'Invest',
          value: '10',
          age: '5 hours ago',
        },
        {
          hash: '0xb32c24c2eb5258253878de0111245557cf29520d661d77ff92d1ae119255672e',
          action: 'Invest',
          value: '10',
          age: '2 days ago',
        },
        {
          hash: '0x9f3a8ec2dbb1cce076529414a929a2b309b4c3f5310114b4f51b62e2edb00c86',
          action: 'Withdraw',
          value: '-20',
          age: '4 days 1 hour ago',
        },
        {
          hash: '0x99327becd4169532fb0c653c1b0419bdec79d9a45cb1e28d8decd7abacfd0973',
          action: 'Invest',
          value: '10',
          age: '5 days 2 hours ago',
        },
        {
          hash: '0x8541f96e37cfbdfadcb460d0bd5231d1e87466d62795ba77c62202f41412d02a',
          action: 'Invest',
          value: '100',
          age: '6 days 12 hours ago',
        },
      ],
    };
  },
};
</script>
<template>
  <div class="flex flex-col rounded-lg max-md:w-full max-md:p-2">
    <!--Investments-->
    <div
      class="stats shadow bg-base-300 flex flex-col xl:flex-row items-center"
    >
      <div class="stat">
        <div class="stat-figure text-secondary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            class="inline-block w-8 h-8 stroke-primary"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
            />
          </svg>
        </div>
        <div class="stat-title">Your investments</div>
        <div class="stat-value text-primary">0$</div>
        <div class="stat-desc">0% more than last month</div>
        <div class="stat-actions">
          <button class="btn btn-sm btn-success btn-outline">Add funds</button>
        </div>
      </div>

      <div class="stat sm:max-lg:border-base-300">
        <div class="stat-figure text-secondary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="inline-block w-8 h-8 stroke-current"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            ></path>
          </svg>
        </div>
        <div class="stat-title">Unclaimed profit</div>
        <div class="stat-value text-secondary">0$</div>
        <div class="stat-desc">0% more than last month</div>
        <div class="stat-actions">
          <button class="btn btn-sm btn-outline btn-primary">Withdrawal</button>
        </div>
      </div>

      <div class="stat sm:max-lg:border-base-300">
        <div class="stat-figure text-secondary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="inline-block w-8 h-8 stroke-current"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            ></path>
          </svg>
        </div>
        <div class="stat-title">Total profit</div>
        <div class="stat-value text-secondary">0$</div>
        <div class="stat-desc">0% more than last month</div>
      </div>
    </div>
    <!--Partners-->
    <div
      class="stats bg-primary text-primary-content flex flex-col xl:flex-row"
    >
      <div class="stat">
        <div class="stat-title">Your partners</div>
        <div class="stat-value">0</div>
      </div>

      <div class="stat">
        <div class="stat-title">Investments by your partners</div>
        <div class="stat-value">0$</div>
      </div>
      <div class="stat">
        <div class="stat-title">Your profit with partner program</div>
        <div class="stat-value">0$</div>
      </div>
      <div class="stat">
        <div class="stat-title">Revenue percentage</div>
        <div class="stat-value">7.5%</div>
      </div>
    </div>
    <!--Last transactions-->
    <span class="text-xl text-center m-5">Last transactions</span>
    <div class="overflow-x-auto">
      <table class="table table-zebra w-full">
        <!-- head -->
        <thead>
          <tr>
            <th>Txn Hash</th>
            <th>Action</th>
            <th>Value</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          <!-- row 1 -->
          <tr v-for="trans in transactions" :key="trans.hash">
            <th>
              <a class="link link-info font-normal" target="_blank" :href="`https://goerli.etherscan.io/tx/${trans.hash}`">
              {{ trans.hash.substring(0, 5) }}...{{
                trans.hash.substring(trans.hash.length - 4, trans.hash.length)
              }}
              </a>
            </th>
            <th
              :class="{
                'text-success': trans.value > 0,
                'text-error': trans.value < 0,
              }"
            >
              {{ trans.action }}
            </th>
            <th
              :class="{
                'text-success': trans.value > 0,
                'text-error': trans.value < 0,
              }"
            >
              {{ trans.value }}$
            </th>
            <th>{{ trans.age }}</th>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<style></style>
