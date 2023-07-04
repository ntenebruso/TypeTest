<template>
    <div class="modal__command-input">
        <input
            ref="input"
            class="modal__input"
            type="text"
            :placeholder="props.placeholder"
            @keydown="handleKeyDown"
        />
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useCommandState } from "@/utils/useCommandState";
import { useCommandEvent } from "@/utils/useCommandEvent";

const { containsInput } = useCommandState();
const emitter = useCommandEvent();

const emit = defineEmits(["select"]);
const props = defineProps({
    placeholder: {
        type: String,
        default: "enter value here",
    },
});

const input = ref(null);
containsInput.value = true;

function handleKeyDown(e) {
    if (e.code == "Enter") {
        const selectedItem = {
            type: "text",
            value: e.target.value,
        };
        emit("select", selectedItem);
        emitter.emit("select", selectedItem);
    }
}

onMounted(() => {
    input.value.focus();
});
</script>

<style scoped>
.modal__command-input {
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
