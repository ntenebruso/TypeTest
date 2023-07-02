<template>
    <div class="app">
        <div class="header">
            <div class="header__group">
                <router-link to="/">
                    <span class="header__title">TypeTest</span>
                </router-link>
                <button
                    class="header__button"
                    @click="() => (showingCommandPalette = true)"
                >
                    <Icon icon="settings" />
                </button>
                <button
                    class="header__button"
                    style="margin-left: 15px"
                    @click="clearSettings"
                    aria-label="Reset all settings"
                    aria-label-bottom
                >
                    <Icon icon="x-circle" />
                </button>
            </div>
            <div>
                <router-link
                    to="/login"
                    v-if="!userStore.user"
                    class="header__link"
                    >Log in</router-link
                >
                <router-link
                    to="/dashboard"
                    v-else
                    class="header__link"
                    style="display: flex; align-items: center"
                >
                    <Icon icon="user" />
                    <span class="header__user">{{
                        userStore.user.email
                    }}</span></router-link
                >
            </div>
        </div>
        <router-view></router-view>
        <Loader v-if="userStore.loading" />
        <CommandPalette :visible="showingCommandPalette" />
    </div>
</template>

<script setup>
import Loader from "@/components/Loader.vue";
import CommandPalette from "@/components/command/CommandPalette.vue";
import { useUserStore, useOptionsStore } from "@/store";
import { watch, ref } from "vue";
import Icon from "@/components/Icon.vue";
import SearchModal from "@/components/SearchModal.vue";
import themes from "@/data/themes.json";

const userStore = useUserStore();
const optionsStore = useOptionsStore();
const showingCommandPalette = ref(false);

const themeNames = themes.map((theme) => theme.name);

function clearSettings() {
    localStorage.clear();
    location.reload();
}

watch(
    () => optionsStore.theme,
    (newTheme) => {
        const themeLinkElement = document.getElementById("theme");
        themeLinkElement.href = `./data/themes/${newTheme}`;
    },
    { immediate: true }
);

optionsStore.$subscribe((mutation, state) => {
    console.log("options changed", state);
    localStorage.setItem("options", JSON.stringify(state));
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
    row-gap: 50px;
}

.header {
    background: var(--color-ui-tint);
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
    color: var(--color-ui-primary);
}

.header__button {
    color: var(--color-text-secondary);
    margin-left: 15px;
    cursor: pointer;
    transition: color 0.3s;
}

.header__button:hover {
    color: var(--color-text-primary);
}

.header__link {
    font-size: 20px;
}

.header__user {
    margin-left: 5px;
}

@media (max-width: 700px) {
    .header__user {
        display: none;
    }
}
</style>
