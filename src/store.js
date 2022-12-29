import { createStore } from "vuex";

export default createStore({
    state() {
        return {
            componentKey: 0,
            loading: false,
            user: null,
        };
    },
    mutations: {
        setLoading(state, bool) {
            state.loading = bool;
        },
    },
    getters: {
        getLoading(state) {
            return state.loading;
        },
    },
});
