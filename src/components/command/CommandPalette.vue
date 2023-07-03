<template>
    <CommandDialog
        @select-item="handleSelect"
        @close="close"
        :visible="visible"
    >
        <CommandInput />
        <component v-if="inPane" :is="activePane" />
        <HomePane v-else />
    </CommandDialog>
</template>

<script setup>
import {
    ref,
    shallowRef,
    defineAsyncComponent,
    onUnmounted,
    onMounted,
} from "vue";
import CommandDialog from "./base/CommandDialog.vue";
import CommandInput from "./base/CommandInput.vue";
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
    if (selectedItem.dataset.pane && !inPane.value) {
        activePane.value = componentMap.get(selectedItem.dataset.pane);
        inPane.value = true;
        return;
    }

    if (selectedItem.dataset.option) {
        switch (selectedItem.dataset.option) {
            case "reset-settings":
                resetSettings();
                break;
        }
    }

    if (inPane.value) {
        close(true);
        return;
    }
}

function resetSettings() {
    localStorage.clear();
    location.reload();
}

function handleKeyDown(e) {
    if (e.code == "KeyP" && (e.ctrlKey || e.metaKey) && e.shiftKey) {
        e.preventDefault();
        open();
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

onMounted(() => {
    window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
    emitter.off("openCommandPalette", open);
    emitter.off("closeCommandPalette", close);
    window.removeEventListener("keydown", handleKeyDown);
});
</script>
