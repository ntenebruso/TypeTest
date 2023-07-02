import { reactive, toRefs } from "vue";

const state = reactive({
    selectedIndex: 0,
    childrenCount: 0,
});

export function useCommandState() {
    return {
        ...toRefs(state),
    };
}
