<template>
    <BaseModal :close="props.close" @keydown="handleKeyDown">
        <div class="modal__wrapper">
            <div class="modal__title">{{ props.prompt }}</div>
            <div class="modal__form">
                <input
                    type="text"
                    :value="props.initialValue"
                    ref="input"
                    class="input input--modal"
                    :placeholder="props.placeholder"
                />
                <p v-if="error">{{ error }}</p>
                <button class="button button--modal" @click="done">Ok</button>
            </div>
        </div>
    </BaseModal>
</template>

<script setup lang="ts">
import { onMounted, nextTick, ref } from "vue";
import BaseModal from "./BaseModal.vue";

interface NumericPrompt {
    prompt: string;
    numeric: true;
    placeholder?: string;
    initialValue?: number;
    callback: (value: number) => void;
    close: () => void;
}

interface RegularPrompt {
    prompt: string;
    numeric: false;
    placeholder?: string;
    initialValue?: string;
    callback: (value: string) => void;
    close: () => void;
}

const props = defineProps<NumericPrompt | RegularPrompt>();

const input = ref<HTMLInputElement | null>(null);
const error = ref("");

function handleKeyDown(e: KeyboardEvent) {
    if (e.code == "Enter") {
        done();
    }
}

function done() {
    const inputValue = input.value!.value;
    if (props.numeric) {
        if (!/^\d+$/g.test(inputValue)) {
            error.value = "Input must be a number.";
            return;
        }

        props.callback(parseInt(inputValue));
        props.close();
    } else {
        if (inputValue.trim().length == 0) {
            error.value = "Input must not be empty";
            return;
        }

        props.callback(input.value!.value);
        props.close();
    }
}

onMounted(() => {
    nextTick(() => {
        input.value!.focus();
    });
});
</script>

<style scoped>
.modal__wrapper {
    padding: 20px;
}

.modal__title {
    font-size: 30px;
}

.input--modal {
    margin-top: 25px;
}

.button--modal {
    margin-top: 25px;
    width: 100%;
}
</style>
