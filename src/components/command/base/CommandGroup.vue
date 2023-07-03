<template>
    <ul class="modal__list" ref="modalList">
        <slot></slot>
    </ul>
</template>

<script setup>
import { ref, onBeforeUnmount } from "vue";
import { useCommandState } from "@/utils/useCommandState";
import { useCommandEvent } from "@/utils/useCommandEvent";

const { selectedIndex, childrenCount, search } = useCommandState();
const emitter = useCommandEvent();
const emit = defineEmits(["selectItem"]);

const modalList = ref(null);

function handleKeyDown(e) {
    if (e.code == "ArrowUp") {
        e.preventDefault();

        if (selectedIndex.value > 0) {
            selectedIndex.value--;
        } else {
            selectedIndex.value = childrenCount.value - 1;
        }

        return;
    }

    if (e.code == "ArrowDown") {
        e.preventDefault();

        if (selectedIndex.value < childrenCount.value - 1) {
            selectedIndex.value++;
        } else {
            selectedIndex.value = 0;
        }

        return;
    }

    if (e.key.length == 1) {
        selectedIndex.value = 0;
    }

    if (e.code == "Enter") {
        const event = new Event("select");
        modalList.value
            .querySelector("[data-selected=true]")
            .dispatchEvent(event);
    }
}

emitter.on("dialogKeyDown", handleKeyDown);

onBeforeUnmount(() => {
    selectedIndex.value = 0;
    childrenCount.value = 0;
    search.value = "";

    emitter.off("dialogKeyDown", handleKeyDown);
});
</script>

<style scoped>
.modal__list {
    list-style: none;
    font-family: var(--mono-font);
}
</style>
