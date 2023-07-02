<template>
    <CommandGroup ref="pane">
        <CommandItem
            @select="handleSelect"
            v-for="language in languages"
            :data-language="language"
        >
            {{ language }}
        </CommandItem>
    </CommandGroup>
</template>

<script setup>
import { useOptionsStore } from "@/store";
import CommandGroup from "@/components/command/base/CommandGroup.vue";
import CommandItem from "@/components/command/base/CommandItem.vue";

import languages from "@/data/languages.json";

const optionsStore = useOptionsStore();

function handleSelect(item) {
    optionsStore.setLanguage(item.dataset.language);
}
</script>
