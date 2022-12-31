<template>
    <div class="app">
        <div class="header">
            <router-link to="/">
                <span class="title">TypeTest</span>
            </router-link>
            <div>
                <router-link to="/login" v-if="!store.user">Log in</router-link>
                <router-link to="/dashboard" v-else>{{
                    store.user.email
                }}</router-link>
            </div>
        </div>
        <router-view></router-view>
    </div>
</template>

<script setup>
import { onBeforeMount } from "vue";
import Loader from "@/components/Loader.vue";
import { useUserStore } from "@/store";

const store = useUserStore();

onBeforeMount(() => {
    store.fetchUser();
});
</script>
