<template>
    <CommandDialog @select-item="handleSelect" :visible="visible">
        <component v-if="inPane" :is="activePane" />
        <HomePane v-else />
    </CommandDialog>
</template>

<script setup>
import { ref, shallowRef, defineAsyncComponent } from "vue";
import CommandDialog from "./base/CommandDialog.vue";
import HomePane from "./panes/HomePane.vue";

const props = defineProps(["visible"]);

const componentMap = new Map();
componentMap.set(
    "ThemePane",
    defineAsyncComponent(() =>
        import("@/components/command/panes/ThemePane.vue")
    )
);

const inPane = ref(false);
const activePane = shallowRef(null);

function handleSelect(selectedItem) {
    if (!inPane.value) {
        activePane.value = componentMap.get(selectedItem.dataset.pane);
        inPane.value = true;
    }
}
</script>
