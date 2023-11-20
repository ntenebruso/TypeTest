<template>
    <ul class="modal__list" ref="modalList" v-if="!containsInput">
        <slot></slot>
    </ul>
    <slot v-else></slot>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { CommandItem } from "@/types";
import { useCommandState } from "@/utils/useCommandState";
import { useCommandEvent } from "@/utils/useCommandEvent";

const { selectedIndex, childrenCount, search, containsInput } =
    useCommandState();
const emitter = useCommandEvent();
const emit = defineEmits<{
    (e: "selectItem", selectedItem: CommandItem): void;
}>();

const modalList = ref<HTMLUListElement | null>(null);

function getValidItems() {
    const allItems =
        <NodeListOf<HTMLElement>>(
            modalList.value?.querySelectorAll(
                "[command-item='']:not([aria-disabled='true'])"
            )
        ) || [];
    return Array.from(allItems);
}

function getSelectedItem() {
    const selectedItem = modalList.value?.querySelector(
        "[command-item=''][data-selected='true']"
    );
    return selectedItem;
}

function changeSelectionBy(change: number) {
    const selectedItem = getSelectedItem();
    const items = getValidItems();

    const index = items.findIndex((item) => item == selectedItem);

    const newSelected = items[index + change];

    if (newSelected) {
        selectedIndex.value = parseInt(newSelected.dataset.index!);
    } else {
        if (change > 0) selectedIndex.value = 0;
        else selectedIndex.value = childrenCount.value - 1;
    }
}

function handleKeyDown(e: KeyboardEvent) {
    if (!containsInput.value) {
        if (e.code == "ArrowUp") {
            e.preventDefault();

            changeSelectionBy(-1);

            return;
        }

        if (e.code == "ArrowDown") {
            e.preventDefault();

            changeSelectionBy(1);

            return;
        }

        if (e.key.length == 1) {
            selectedIndex.value = 0;
        }

        if (e.code == "Enter") {
            const event = new Event("select");
            modalList
                .value!.querySelector("[data-selected=true]")!
                .dispatchEvent(event);
        }
    }
}

function handleSelect(selectedItem: CommandItem) {
    emit("selectItem", selectedItem);
}

onMounted(() => {
    emitter.on("dialogKeyDown", handleKeyDown);
    emitter.on("select", handleSelect);
});

onBeforeUnmount(() => {
    selectedIndex.value = 0;
    childrenCount.value = 0;
    search.value = "";
    containsInput.value = false;

    emitter.off("dialogKeyDown", handleKeyDown);
    emitter.off("select", handleSelect);
});
</script>

<style scoped>
.modal__list {
    list-style: none;
    font-family: var(--mono-font);
}
</style>
