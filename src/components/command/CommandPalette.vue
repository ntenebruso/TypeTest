<template>
    <CommandDialog
        @select-item="handleSelect"
        @close="close"
        :visible="visible"
    >
        <component v-if="inPane" :is="activePane" />
        <HomePane v-else />
    </CommandDialog>
</template>

<script setup>
import { ref, shallowRef, defineAsyncComponent, onUnmounted } from "vue";
import CommandDialog from "./base/CommandDialog.vue";
import { useCommandEvent } from "@/utils/useCommandEvent";

import HomePane from "./panes/HomePane.vue";

const emitter = useCommandEvent();

const visible = ref(false);

const componentMap = new Map();
componentMap.set(
    "ThemePane",
    defineAsyncComponent(() =>
        import("@/components/command/panes/ThemePane.vue")
    )
);
componentMap.set(
    "LanguagePane",
    defineAsyncComponent(() =>
        import("@/components/command/panes/LangaugePane.vue")
    )
);

const inPane = ref(false);
const activePane = shallowRef(null);

function handleSelect(selectedItem) {
    if (!inPane.value) {
        activePane.value = componentMap.get(selectedItem.dataset.pane);
        inPane.value = true;
    } else {
        close(true);
    }
}

function open(pane) {
    visible.value = true;

    if (pane) {
        activePane.value = componentMap.get(pane);
        inPane.value = true;
    }

    emitter.emit("commandPaletteOpen");
}

function close(full) {
    if (inPane.value && !full) {
        inPane.value = false;
        activePane.value = null;
    } else {
        inPane.value = false;
        activePane.value = null;
        visible.value = false;
        emitter.emit("commandPaletteClose");
    }
}

emitter.on("openCommandPalette", open);
emitter.on("closeCommandPalette", close);

onUnmounted(() => {
    emitter.off("openCommandPalette", open);
    emitter.off("closeCommandPalette", close);
});
</script>
