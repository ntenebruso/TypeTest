import { reactive, toRefs } from "vue";

const state = reactive({
    selectedIndex: 0,
    childrenCount: 0,
    search: "",
    containsInput: false,
});

export function useCommandState() {
    return {
        ...toRefs(state),
    };
}
