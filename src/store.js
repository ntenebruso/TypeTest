import { createStore } from "vuex";

export default createStore({
    state() {
        return {
            componentKey: 0,
            loading: false,
            user: null,
        };
    },
});
