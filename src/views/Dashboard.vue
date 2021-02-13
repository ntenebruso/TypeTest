<template>
    <div class="dashboard">
        <Loader v-if="loading" />
        <div v-else>
            <h1>Hello, {{this.$store.state.user.email}}</h1>
        </div>
    </div>
</template>

<script>
    import firebase from "../firebase";
    import Loader from "../components/Loader.vue";

    export default {
        components: { Loader },
        data() {
            return {
                loading: true,
            }
        },
        mounted() {
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    this.$store.state.user = user;
                    this.loading = false;
                } else {
                    this.$router.push({ name: "login" });
                    return;
                }
            })
        }
    }
</script>