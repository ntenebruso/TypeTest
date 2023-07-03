<template>
    <li
        :class="{
            modal__item: true,
            'modal__item--active': selectedIndex == index,
        }"
        :data-selected="selectedIndex == index"
        @mouseenter="() => (selectedIndex = index)"
        @click="handleSelect"
        ref="item"
        v-show="showItem"
    >
        <slot></slot>
    </li>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useCommandState } from "@/utils/useCommandState";
import { useCommandEvent } from "@/utils/useCommandEvent";

const emit = defineEmits(["select"]);
const props = defineProps({
    label: {
        type: String,
        default: "",
    },
});

const item = ref(null);

const { selectedIndex, childrenCount, search } = useCommandState();
const emitter = useCommandEvent();

const showItem = computed(() =>
    props.label.toLowerCase().includes(search.value.toLowerCase())
);

const index = ref(0);
index.value = childrenCount.value;
childrenCount.value++;

function handleSelect() {
    const selectedItem = {
        index: selectedIndex.value,
        dataset: item.value.dataset,
    };
    emit("select", selectedItem);
    emitter.emit("select", selectedItem);
}

onMounted(() => {
    item.value.addEventListener("select", handleSelect);
});

onBeforeUnmount(() => {
    item.value.removeEventListener("select", handleSelect);
});
</script>

<style scoped>
.modal__item {
    width: 100%;
    padding: 5px 15px;
    cursor: pointer;
}

.modal__item--active {
    background: #fff;
    color: var(--color-text-secondary);
}
</style>
