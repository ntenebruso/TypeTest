<template>
    <CommandGroup @select-item="handleSelect">
        <CommandInputItem
            v-if="custom"
            placeholder="Enter a time"
        ></CommandInputItem>
        <div v-else>
            <CommandItem label="15">15</CommandItem>
            <CommandItem label="30">30</CommandItem>
            <CommandItem label="60">60</CommandItem>
            <CommandItem
                label="Custom"
                data-custom="true"
                data-prevent-close="true"
                >Custom...</CommandItem
            >
        </div>
    </CommandGroup>
</template>

<script setup>
import { ref } from "vue";
import CommandGroup from "../base/CommandGroup.vue";
import CommandItem from "../base/CommandItem.vue";
import CommandInputItem from "../base/CommandInputItem.vue";
import { useOptionsStore } from "@/store";

const optionsStore = useOptionsStore();

const custom = ref(false);

function handleSelect(selectedItem) {
    if (selectedItem.type == "list" && selectedItem.dataset.custom) {
        custom.value = true;
        return;
    }

    optionsStore.setTestTime(parseInt(selectedItem.value));
}
</script>
