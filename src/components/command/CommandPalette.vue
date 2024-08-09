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

<script setup lang="ts">
import {
    ref,
    shallowRef,
    defineAsyncComponent,
    onUnmounted,
    onMounted,
    type Component,
} from "vue";
import CommandDialog from "./base/CommandDialog.vue";
import CommandInput from "./base/CommandInput.vue";
import { useCommandEvent } from "@/utils/useCommandEvent";
import { CommandItem } from "@/types";

import HomePane from "./panes/HomePane.vue";

const emitter = useCommandEvent();

const visible = ref(false);

const componentMap = new Map<string, Component>();
componentMap.set(
    "ThemePane",
    defineAsyncComponent(
        () => import("@/components/command/panes/ThemePane.vue")
    )
);
componentMap.set(
    "LanguagePane",
    defineAsyncComponent(
        () => import("@/components/command/panes/LangaugePane.vue")
    )
);
componentMap.set(
    "TimePane",
    defineAsyncComponent(
        () => import("@/components/command/panes/TimePane.vue")
    )
);

const inPane = ref(false);
const activePane = shallowRef<Component | null>(null);

function handleSelect(selectedItem: CommandItem) {
    if (selectedItem.type == "list") {
        if (selectedItem.dataset.pane && !inPane.value) {
            activePane.value = componentMap.get(selectedItem.dataset.pane)!;
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
    }

    if (inPane.value) {
        if (
            (selectedItem.type == "list" &&
                !selectedItem.dataset.preventClose) ||
            selectedItem.type == "input"
        ) {
            close(true);
        }
        return;
    }
}

function resetSettings() {
    localStorage.clear();
    location.reload();
}

function handleKeyDown(e: KeyboardEvent) {
    if (
        (e.code == "KeyP" && (e.ctrlKey || e.metaKey) && e.shiftKey) ||
        e.code == "F1"
    ) {
        e.preventDefault();
        open();
    }
}

function open(pane?: string) {
    visible.value = true;

    if (pane) {
        activePane.value = componentMap.get(pane) || null;
        inPane.value = true;
    }

    emitter.emit("commandPaletteOpen");
}

function close(full?: boolean) {
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
