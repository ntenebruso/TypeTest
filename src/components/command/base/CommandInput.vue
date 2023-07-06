<template>
    <div class="modal__search" v-if="!containsInput">
        <i class="fa-solid fa-magnifying-glass"></i>
        <input
            ref="input"
            class="modal__input"
            v-model="search"
            type="text"
            placeholder="Type here to search..."
        />
    </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch, nextTick } from "vue";
import { useCommandState } from "@/utils/useCommandState";
import { useCommandEvent } from "@/utils/useCommandEvent";

const { search, containsInput } = useCommandState();
const emitter = useCommandEvent();

const input = ref<HTMLInputElement | null>(null);

function handleFocus() {
    input.value!.focus();
}

watch(containsInput, (newVal) => {
    if (newVal == false) {
        nextTick(() => {
            input.value!.focus();
        });
    }
});

onMounted(() => {
    input.value!.focus();
    emitter.on("focusInput", handleFocus);
});

onBeforeUnmount(() => {
    emitter.off("focusInput", handleFocus);
});
</script>

<style scoped>
.modal__search {
    padding: 15px;
    display: flex;
    align-items: center;
    color: var(--color-text-secondary);
}

.modal__input {
    flex: 1;
    margin-left: 5px;
    border: none;
    background: none;
    color: var(--color-text-secondary);
    font-size: 20px;
    caret-color: var(--color-ui-primary);
    font-family: var(--mono-font);
    outline: none;
}

.modal__input::placeholder {
    color: var(--color-text-secondary);
}
</style>
