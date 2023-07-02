<template>
    <Teleport to="body">
        <div class="modal" @keydown="handleKeyDown" v-if="visible">
            <div class="modal__body">
                <div class="modal__search">
                    <Icon icon="search" />
                    <input
                        ref="input"
                        class="modal__input"
                        v-model="inputValue"
                        type="text"
                        placeholder="Type here to search..."
                    />
                </div>
                <div class="modal__list-wrapper">
                    <slot></slot>
                </div>
            </div>
            <div class="modal__overlay"></div>
        </div>
    </Teleport>
</template>

<script setup>
import { useCommandEvent } from "./useCommandEvent";
import Icon from "@/components/Icon.vue";
import { ref, onMounted, nextTick, onBeforeUnmount } from "vue";

const emitter = useCommandEvent();
const emit = defineEmits(["selectItem"]);

const props = defineProps({
    visible: {
        type: Boolean,
        default: true,
    },
});

const input = ref(null);
const inputValue = ref("");

function handleKeyDown(e) {
    emitter.emit("dialogKeyDown", e);
}

function handleSelect(selectedItem) {
    emit("selectItem", selectedItem);
}

emitter.on("select", handleSelect);

onMounted(() => {
    nextTick(() => {
        input.value.focus();
    });
});

onBeforeUnmount(() => {
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
