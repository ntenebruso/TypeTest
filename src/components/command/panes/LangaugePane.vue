<template>
    <CommandGroup ref="pane">
        <CommandItem
            @select="handleSelect"
            v-for="language in languages"
            :data-language="language"
            :label="language"
        >
            {{ language }}
        </CommandItem>
    </CommandGroup>
</template>

<script setup lang="ts">
import { useOptionsStore } from "@/store";
import { CommandListItem } from "@/types";
import CommandGroup from "@/components/command/base/CommandGroup.vue";
import CommandItem from "@/components/command/base/CommandItem.vue";

import languages from "@/data/languages.json";

const optionsStore = useOptionsStore();

function handleSelect(item: CommandListItem) {
    optionsStore.setLanguage(item.dataset.language || "english");
}
</script>
