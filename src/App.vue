<template>
    <SearchModal
        :items="themeNames"
        :close="() => (showingThemeModal = false)"
        :callback="
            (name) =>
                optionsStore.setTheme(
                    themes.find((theme) => theme.name == name).file
                )
        "
        v-if="showingThemeModal"
    />
    <div class="app">
        <div class="header">
            <div class="header__group">
                <router-link to="/">
                    <span class="header__title">TypeTest</span>
                </router-link>
                <button
                    class="header__button"
                    @click="() => (showingThemeModal = true)"
                >
                    <Icon icon="settings" />
                </button>
            </div>
            <div>
                <router-link
                    to="/login"
                    v-if="!userStore.user"
                    class="header__link"
                    >Log in</router-link
                >
                <router-link to="/dashboard" v-else class="header__link">{{
                    userStore.user.email
                }}</router-link>
            </div>
        </div>
        <router-view></router-view>
        <Loader v-if="userStore.loading" />
    </div>
</template>

<script setup>
import Loader from "@/components/Loader.vue";
import { useUserStore, useOptionsStore } from "@/store";
import { watch, onBeforeMount, ref } from "vue";
import Icon from "./components/Icon.vue";
import SearchModal from "./components/SearchModal.vue";
import themes from "@/data/themes.json";

const userStore = useUserStore();
const optionsStore = useOptionsStore();
const showingThemeModal = ref(false);

const themeNames = themes.map((theme) => theme.name);

onBeforeMount(() => {
    watch(
        () => optionsStore.theme,
        (newTheme) => {
            const themeLinkElement = document.getElementById("theme");
            themeLinkElement.href = `./data/themes/${newTheme}`;
        },
        { immediate: true }
    );
});
</script>

<style scoped>
.app {
    width: 90%;
    max-width: 1000px;
    margin: 0 auto;
    display: grid;
    grid-template-rows: auto 1fr auto;
    align-items: center;
    min-height: 100vh;
}

.header {
    background: var(--accent-color);
    padding: 10px 20px;
    border-radius: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
}

.header__group {
    display: flex;
    align-items: center;
}

.header__title {
    font-size: 40px;
    font-weight: bold;
    color: var(--primary-color);
}

.header__button {
    color: var(--secondary-color);
    margin-left: 15px;
    cursor: pointer;
    transition: color 0.3s;
}

.header__button:hover {
    color: var(--text-color);
}

.header__link {
    font-size: 20px;
}
</style>
