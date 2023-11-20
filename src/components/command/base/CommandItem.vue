<template>
    <li
        :class="{
            modal__item: true,
            'modal__item--active': selectedIndex == index,
        }"
        :data-selected="selectedIndex == index"
        :data-index="index"
        @mouseenter="() => (selectedIndex = index)"
        @click="handleSelect"
        ref="item"
        v-show="showItem"
        :aria-disabled="!showItem"
        command-item=""
    >
        <slot></slot>
    </li>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { CommandListItem } from "@/types";
import { useCommandState } from "@/utils/useCommandState";
import { useCommandEvent } from "@/utils/useCommandEvent";

const { selectedIndex, childrenCount, search } = useCommandState();
const emitter = useCommandEvent();

const emit = defineEmits<{
    (e: "select", selectedItem: CommandListItem): void;
}>();
const props = defineProps<{
    label: string;
}>();

const item = ref<HTMLLIElement | null>(null);

const showItem = computed(() =>
    props.label.toLowerCase().includes(search.value.toLowerCase())
);

const index = ref(0);
index.value = childrenCount.value;
childrenCount.value++;

function handleSelect() {
    const selectedItem: CommandListItem = {
        type: "list",
        value: props.label,
        index: selectedIndex.value,
        dataset: item.value!.dataset,
    };
    emit("select", selectedItem);
    emitter.emit("select", selectedItem);
}

onMounted(() => {
    item.value!.addEventListener("select", handleSelect);
});

onBeforeUnmount(() => {
    item.value!.removeEventListener("select", handleSelect);
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
