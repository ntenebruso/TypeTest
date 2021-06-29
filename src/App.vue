<template>
    <div class="app">
        <div class="header">
            <router-link to="/">
                <h1 style="color: var(--text-color); text-decoration: none;">TypeTest</h1>
            </router-link>
            <div>
                <router-link to="/login">Login</router-link>
            </div>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: 'App',
    methods: {
        handleClick() {
            this.$store.state.componentKey += 1;
        }
    }
}
</script>
