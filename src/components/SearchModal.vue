<template>
    <BaseModal :close="props.close" @keydown="handleKeyDown">
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

<script setup>
import Icon from "./Icon.vue";
import BaseModal from "./BaseModal.vue";
import { ref, computed, onMounted, nextTick } from "vue";

const props = defineProps({
    items: {
        type: Array,
        required: true,
    },
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
const inputValue = ref("");

const selectedIndex = ref(0);

const filteredItems = computed(() => {
    return props.items.filter((item) => item.includes(inputValue.value));
});

function handleKeyDown(e) {
    if (e.code == "ArrowUp" && selectedIndex.value > 0) {
        selectedIndex.value--;
        return;
    }

    if (
        e.code == "ArrowDown" &&
        selectedIndex.value < filteredItems.value.length - 1
    ) {
        selectedIndex.value++;
        return;
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
        input.value.focus();
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