<template>
    <div class="app">
        <div class="header">
            <router-link to="/">
                <span class="header__title">TypeTest</span>
            </router-link>
            <div>
                <router-link to="/login" v-if="!store.user" class="header__link"
                    >Log in</router-link
                >
                <router-link to="/dashboard" v-else class="header__link">{{
                    store.user.email
                }}</router-link>
            </div>
        </div>
        <router-view></router-view>
        <Loader v-if="store.loading" />
    </div>
</template>

<script setup>
import Loader from "@/components/Loader.vue";
import { useUserStore } from "@/store";

const store = useUserStore();
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
    background: rgba(0, 0, 0, 0.2);
    padding: 10px 20px;
    border-radius: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
}

.header__title {
    font-size: 40px;
    font-weight: bold;
    color: var(--primary-color);
}

.header__link {
    font-size: 20px;
}
</style>
