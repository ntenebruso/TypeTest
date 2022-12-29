<template>
    <div class="app">
        <div class="header">
            <router-link to="/">
                <h1>TypeTest</h1>
            </router-link>
            <div>
                <router-link to="/login" v-if="!user">Login</router-link>
                <router-link to="/dashboard" v-else>{{
                    user.email
                }}</router-link>
            </div>
        </div>
        <Loader />
        <router-view v-if="!$store.state.loading"></router-view>
    </div>
</template>

<script>
import Loader from "./components/Loader.vue";
import { getCurrentUser } from "./firebase";

export default {
    name: "App",
    components: { Loader },
    data() {
        return {
            user: null,
        };
    },
    methods: {
        handleClick() {
            this.$store.state.componentKey += 1;
        },
    },
    async mounted() {
        this.user = await getCurrentUser();
    },
};
</script>
