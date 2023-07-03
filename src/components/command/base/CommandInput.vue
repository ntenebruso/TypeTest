<template>
    <div class="modal__search">
        <Icon icon="search" />
        <input
            ref="input"
            class="modal__input"
            v-model="search"
            type="text"
            placeholder="Type here to search..."
        />
    </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, nextTick } from "vue";
import Icon from "@/components/Icon.vue";
import { useCommandState } from "@/utils/useCommandState";
import { useCommandEvent } from "@/utils/useCommandEvent";

const { search } = useCommandState();
const emitter = useCommandEvent();

const input = ref(null);

function handleFocus() {
    input.value.focus();
}

onMounted(() => {
    input.value.focus();
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
