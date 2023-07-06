<template>
    <Teleport to="body">
        <div class="modal" @keydown="handleKeyDown" v-if="props.visible">
            <div class="modal__body">
                <slot></slot>
            </div>
            <div
                class="modal__overlay"
                @click="() => emit('close', true)"
            ></div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { useCommandEvent } from "@/utils/useCommandEvent";
import { CommandItem } from "@/types";
import { onMounted, onUnmounted } from "vue";

const emitter = useCommandEvent();
const emit = defineEmits<{
    (e: "selectItem", selectedItem: CommandItem): void;
    (e: "close", overlayClicked: boolean): void;
}>();

const props = defineProps<{
    visible: boolean;
}>();

function handleKeyDown(e: KeyboardEvent) {
    emitter.emit("dialogKeyDown", e);

    if (e.code == "Escape") {
        emit("close", false);
    }
}

function handleSelect(selectedItem: CommandItem) {
    if (selectedItem.type == "list") {
        emitter.emit("focusInput");
    }
    emit("selectItem", selectedItem);
}

onMounted(() => {
    emitter.on("select", handleSelect);
});

onUnmounted(() => {
    emitter.off("select", handleSelect);
});
</script>

<style scoped>
.modal {
    z-index: 10;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100vw;
    height: 100vh;
}
.modal__body {
    z-index: 10;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 10px;
    background: var(--color-background);
    width: 100%;
    max-width: 700px;
    overflow: hidden;
    outline: none;
}

.modal__overlay {
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 100%;
}
</style>
