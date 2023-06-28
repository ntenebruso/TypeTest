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
                />
                <p v-if="error">{{ error }}</p>
                <button class="button button--modal" @click="done">Ok</button>
            </div>
        </div>
    </BaseModal>
</template>

<script setup>
import { onMounted, nextTick, ref } from "vue";
import BaseModal from "./BaseModal.vue";

const props = defineProps({
    prompt: {
        type: String,
        required: true,
    },
    numeric: {
        type: Boolean,
        required: true,
    },
    initialValue: [String, Number],
    callback: {
        type: Function,
        required: true,
    },
    close: {
        type: Function,
        required: true,
    },
});

const input = ref(null);
const error = ref("");

function handleKeyDown(e) {
    if (e.code == "Enter") {
        done();
    }
}

function done() {
    if (props.numeric && !/^\d+$/g.test(input.value.value)) {
        error.value = "Input must be a number.";
        return;
    } else {
        props.callback(parseInt(input.value.value));
        props.close();
    }
}

onMounted(() => {
    nextTick(() => {
        input.value.focus();
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
