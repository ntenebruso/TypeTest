<template>
    <CommandGroup ref="pane">
        <CommandItem
            @select="handleSelect"
            v-for="theme in themes"
            :data-theme="theme.file"
            :label="theme.name"
        >
            {{ theme.name }}
        </CommandItem>
    </CommandGroup>
</template>

<script setup lang="ts">
import { useOptionsStore } from "@/store";
import { CommandListItem } from "@/types";
import CommandGroup from "@/components/command/base/CommandGroup.vue";
import CommandItem from "@/components/command/base/CommandItem.vue";

import themes from "@/data/themes.json";

const optionsStore = useOptionsStore();

function handleSelect(item: CommandListItem) {
    optionsStore.setTheme(item.dataset.theme || "default.css");
}
</script>
