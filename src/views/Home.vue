<template>
  <div class="home">
    <div class="mb-10">
      <h1 class="text-4xl mb-2">COVID-19 Situation</h1>
          <div class="text-xs text-gray-500">Data is sourced from <a
              href="https://github.com/CSSEGISandData/COVID-19"
              target="_blank"
              class="underline"
            >Johns Hopkins CSSE</a></div>

    </div>

    <div class="flex mb-10 xxl:w-4/5">
      <div class="w-3/4 pr-10">
        <canvas ref="chart"></canvas>
      </div>
      <div
        class="w-1/4"
        v-if="summaryByCountry"
      >
        <div class="mb-4">{{ date | moment }}</div>

        <div class="flex items-center mb-6">
          <div class="mr-2">
            <img :src='`https://www.countryflags.io/${summaryByCountry.CountryCode}/flat/32.png`'>
          </div>
          <div class="text-xl">Russia</div>
        </div>

        <div class="mb-4">
          <div class="mb-1">Confirmed</div>
          <div class="flex items-center text-xl">
            <div>{{ summaryByCountry.TotalConfirmed | numeral }}</div>
            <div
              v-if="summaryByCountry.NewConfirmed !== 0"
              class="ml-2 text-xs text-gray-500"
            >{{ summaryByCountry.NewConfirmed > 0 ? '+' : ''}}{{ summaryByCountry.NewConfirmed | numeral }}</div>
          </div>
        </div>

        <div class="mb-4">
          <div class="mb-1">
            Deaths
          </div>
          <div class="flex items-center text-xl">
            <div>{{ summaryByCountry.TotalDeaths | numeral }}</div>
            <div
              v-if="summaryByCountry.NewDeaths !== 0"
              class="ml-2 text-xs text-gray-500"
            >{{ summaryByCountry.NewDeaths > 0 ? '+' : ''}}{{ summaryByCountry.NewDeaths | numeral }}</div>
          </div>
        </div>

        <div class="mb-4">
          <div class="mb-1">
            Recovered
          </div>
          <div class="flex items-center text-xl">
            <div>{{ summaryByCountry.TotalRecovered | numeral }}</div>
            <div
              v-if="summaryByCountry.NewRecovered !== 0"
              class="ml-2 text-xs text-gray-500"
            >{{ summaryByCountry.NewRecovered > 0 ? '+' : ''}}{{ summaryByCountry.NewRecovered | numeral }}</div>
          </div>
        </div>

        <div class="relative mt-10">
          <select
            v-model="currentCountry"
            class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="grid-state"
          >
            <option
              v-for="country in countryNames"
              :key="country.Slug"
              :value="country.Slug"
            >
              {{ country.Country }}
            </option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              class="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
          </div>
        </div>

      </div>
    </div>

    <table
      v-if="sortedByConfirmed.length"
      class="border-collapse border border-gray-500"
    >
      <thead>
        <tr>
          <th></th>
          <th>Confirmed</th>
          <th>Deaths</th>
          <th>Recovered</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="country in sortedByConfirmed"
          :key="country.CountryCode"
        >
          <td>
            <div class="flex items-center">
              <div class="mr-2"><img :src='`https://www.countryflags.io/${country.CountryCode}/flat/16.png`'></div>
              <div>{{ country.Country }}</div>
            </div>
          </td>
          <td>
            <div class="flex items-center">
              <div>{{ country.TotalConfirmed | numeral }}</div>
              <div
                v-if="country.NewConfirmed !== 0"
                class="ml-2 text-xs text-gray-500"
              >{{ country.NewConfirmed > 0 ? '+' : ''}}{{ country.NewConfirmed | numeral }}</div>
            </div>
          </td>
          <td>
            <div class="flex items-center">
              <div>{{ country.TotalDeaths | numeral }}</div>
              <div
                v-if="country.NewDeaths !== 0"
                class="ml-2 text-xs text-gray-500"
              >{{ country.NewDeaths > 0 ? '+' : ''}}{{ country.NewDeaths | numeral }}</div>
            </div>
          </td>
          <td>
            <div class="flex items-center">
              <div>{{ country.TotalRecovered | numeral }}</div>
              <div
                v-if="country.NewRecovered !== 0"
                class="ml-2 text-xs text-gray-500"
              >{{ country.NewRecovered > 0 ? '+' : ''}}{{ country.NewRecovered | numeral }}</div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script>
import Chart from 'chart.js'
import numeral from 'numeral'
import moment from 'moment'
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      currentCountry: 'russia'
    }
  },
  computed: {
    ...mapState(['summary', 'dailyByCountry', 'date']),

    countryNames () {
      return this.summary.map(c => {
        return {
          Country: c.Country,
          Slug: c.Slug
        }
      })
    },

    sortedByConfirmed () {
      return [...this.summary].sort((a, b) => {
        return b.TotalConfirmed - a.TotalConfirmed
      })
    },

    summaryByCountry () {
      return this.summary.find(c => c.Slug === this.currentCountry)
    },

    datasetConfirmed () {
      return this.dailyByCountry.map(e => {
        return {
          x: e.Date,
          y: e.Confirmed
        }
      })
    },

    datasetDeaths () {
      return this.dailyByCountry.map(e => {
        return {
          x: e.Date,
          y: e.Deaths
        }
      })
    },

    datasetRecovered () {
      return this.dailyByCountry.map(e => {
        return {
          x: e.Date,
          y: e.Recovered
        }
      })
    }
  },

  filters: {
    numeral (val) {
      return numeral(val).format('0,0')
    },

    moment (val) {
      if (!val) return ''
      return moment(val).format('LL')
    }
  },

  watch: {
    summaryByCountry () {
      this.getDailyByCountry(this.currentCountry).then(() => {
        this.createChart()
      })
    }
  },

  created () {
    this.getSummary()
  },

  methods: {
    ...mapActions(['getSummary', 'getDailyByCountry']),

    createChart () {
      if (this.chart) this.chart.destroy()

      this.chart = new Chart(this.$refs.chart, {
        type: 'line',
        data: {
          datasets: [{
            label: 'Confirmed cases',
            data: this.datasetConfirmed,
            pointRadius: 0,
            fill: false,
            lineTension: 0,
            borderColor: '#000000',
            borderWidth: 2
          },
          {
            label: 'Deaths cases',
            data: this.datasetDeaths,
            pointRadius: 0,
            fill: false,
            lineTension: 0,
            borderColor: '#ff5f65',
            borderWidth: 2
          },
          {
            label: 'Recovered cases',
            data: this.datasetRecovered,
            pointRadius: 0,
            fill: false,
            lineTension: 0,
            borderColor: '#5dcc1a',
            borderWidth: 2
          }]
        },
        options: {
          animation: {
            duration: 0
          },
          scales: {
            xAxes: [{
              type: 'time',
              distribution: 'series',
              offset: true,
              ticks: {
                major: {
                  enabled: true,
                  fontStyle: 'bold'
                },
                source: 'data',
                autoSkip: true,
                autoSkipPadding: 75,
                maxRotation: 0,
                sampleSize: 100
              }

            }],
            yAxes: [{
              gridLines: {
                drawBorder: false
              }
            }]
          },
          tooltips: {
            intersect: false,
            mode: 'index',
            callbacks: {
              title: function (tooltipItem, myData) {
                return moment(tooltipItem[0].label).format('LL')
              },
              label: function (tooltipItem, myData) {
                var label = myData.datasets[tooltipItem.datasetIndex].label || ''
                if (label) {
                  label += ': '
                }
                label += numeral(tooltipItem.value).format('0,0')
                return label
              }
            }
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
table {
  td,
  th {
    @apply border border-gray-400 px-4 py-2;
  }
}
</style>
