import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.covid19api.com'
})

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    summary: [],
    dailyByCountry: [],
    date: ''
  },
  mutations: {
    setSummary (state, data) {
      state.summary = data
    },
    setDaily (state, data) {
      state.dailyByCountry = data
    },
    setDate (state, data) {
      state.date = data
    }
  },
  actions: {
    async getSummary ({ commit }) {
      const { data } = await api.get('/summary')
      commit('setSummary', data.Countries)
      commit('setDate', data.Date)
    },
    async getDailyByCountry ({ commit }, country) {
      const { data } = await api.get(`/total/country/${country}`)
      commit('setDaily', data)
    }
  }
})
