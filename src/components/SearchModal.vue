<template>
    <div class="overlay"></div>
    <div class="modal">
        <div class="modal__search">
            <Icon icon="search" />
            <input
                ref="input"
                class="modal__input"
                v-model="inputValue"
                type="text"
                @keydown="handleKeyDown"
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
    </div>
</template>

<script setup>
import Icon from "./Icon.vue";
import { ref, computed, onMounted, nextTick } from "vue";

const props = defineProps(["items", "callback", "close"]);

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

    if (e.code == "Escape") {
        props.close();
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
    background: var(--bg-color);
    min-width: 700px;
    overflow: hidden;
}

.modal__search {
    padding: 15px;
    display: flex;
    align-items: center;
    color: var(--sub-color);
}

.modal__input {
    flex: 1;
    margin-left: 5px;
    border: none;
    background: none;
    color: var(--sub-color);
    font-size: 20px;
    caret-color: var(--fg-color);
    font-family: var(--mono-font);
    outline: none;
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
    color: var(--sub-color);
}
</style>
