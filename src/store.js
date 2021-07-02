import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        componentKey: 0,
        loading: false
    },
    mutations: {
        setLoading(state, bool) {
            state.loading = bool;
        }
    },
    getters: {
        getLoading(state) {
            return state.loading;
        }
    }
})