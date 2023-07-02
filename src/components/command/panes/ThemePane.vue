<template>
    <CommandGroup ref="pane">
        <CommandItem
            @select="handleSelect"
            v-for="theme in themes"
            :data-theme="theme.file"
        >
            {{ theme.name }}
        </CommandItem>
    </CommandGroup>
</template>

<script setup>
import { useOptionsStore } from "@/store";
import CommandGroup from "@/components/command/base/CommandGroup.vue";
import CommandItem from "@/components/command/base/CommandItem.vue";

import themes from "@/data/themes.json";

const optionsStore = useOptionsStore();

function handleSelect(item) {
    optionsStore.setTheme(item.dataset.theme);
}
</script>
