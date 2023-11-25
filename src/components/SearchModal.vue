<template>
    <BaseModal :close="props.close" @keydown="handleKeyDown">
        <div class="modal__search">
            <input
                ref="input"
                class="modal__input"
                v-model="inputValue"
                type="text"
                placeholder="Type here to search..."
            />
        </div>
        <div class="modal__list-wrapper">
            <ul class="modal__list">
                <li
                    :class="{
                        modal__item: true,
                        'modal__item--active': selectedIndex == index,
                    }"
                    @mouseover="selectedIndex = index"
                    @click="done"
                    v-for="(item, index) in filteredItems"
                >
                    {{ item }}
                </li>
            </ul>
        </div>
    </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from "./BaseModal.vue";
import { ref, computed, onMounted, nextTick } from "vue";

const props = defineProps<{
    items: any[];
    callback: (value: string) => void;
    close: () => void;
}>();

const input = ref<HTMLInputElement | null>(null);
const inputValue = ref("");

const selectedIndex = ref(0);

const filteredItems = computed(() => {
    return props.items.filter((item) => item.includes(inputValue.value));
});

function handleKeyDown(e: KeyboardEvent) {
    if (e.code == "ArrowUp") {
        e.preventDefault();

        if (selectedIndex.value > 0) {
            selectedIndex.value--;
        } else {
            selectedIndex.value = filteredItems.value.length - 1;
        }

        return;
    }

    if (e.code == "ArrowDown") {
        e.preventDefault();

        if (selectedIndex.value < filteredItems.value.length - 1) {
            selectedIndex.value++;
        } else {
            selectedIndex.value = 0;
        }

        return;
    }

    if (e.key.length == 1) {
        selectedIndex.value = 0;
    }

    if (e.code == "Enter") {
        done();
        return;
    }
}

function done() {
    props.callback(filteredItems.value[selectedIndex.value]);
    props.close();
}

onMounted(() => {
    nextTick(() => {
        input.value!.focus();
    });
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

.modal__list {
    list-style: none;
    font-family: var(--mono-font);
}

.modal__item {
    width: 100%;
    padding: 5px 15px;
    cursor: pointer;
}

.modal__item--active {
    background: #fff;
    color: var(--color-text-secondary);
}
</style>
