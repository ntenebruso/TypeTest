<template>
    <div class="app">
        <div class="header">
            <router-link to="/">
                <h1>TypeTest</h1>
            </router-link>
            <div>
                <router-link to="/login">Login</router-link>
            </div>
        </div>
        <Loader />
        <router-view v-if="!this.$store.state.loading"></router-view>
    </div>
</template>

<script>
import Loader from "./components/Loader.vue";

export default {
    name: 'App',
    components: { Loader },
    methods: {
        handleClick() {
            this.$store.state.componentKey += 1;
        }
    }
}
</script>
