<template>
    <div class="overlay" ref="overlay" @click="props.close"></div>
    <div class="modal" ref="modal" tabindex="0" @keydown="handleKeyDown">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick } from "vue";

const props = defineProps<{
    close: () => void;
}>();
const emit = defineEmits(["keydown"]);

const modal = ref<HTMLElement | null>(null);

function handleKeyDown(e: KeyboardEvent) {
    emit("keydown", e);
    if (e.code == "Escape") {
        props.close();
        return;
    }
}

onMounted(() => {
    nextTick(() => {
        modal.value!.focus();
    });
});
</script>

<style scoped>
.overlay {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.5);
    width: 100vw;
    height: 100vh;
    z-index: 10;
}

.modal {
    z-index: 20;
    position: fixed;
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
</style>
