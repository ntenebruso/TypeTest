<template>
    <div class="app">
        <div class="header">
            <h1><router-link to="/" style="color: var(--text-color); text-decoration: none;">TypeTest</router-link></h1>
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
}
</script>
