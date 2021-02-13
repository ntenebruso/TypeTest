<template>
    <div class="login-wrapper">
        <Loader v-if="loading" />
        <div class="forms" v-else>
            <form class="signup-form form" @submit="signUp">
                <h3>Sign Up</h3>
                <input required type="email" placeholder="Email" v-model="signupEmail">
                <input required type="password" placeholder="Password" v-model="signupPassword">
                <button type="submit">Sign Up</button>
            </form>
            <form class="login-form form" @submit="logIn">
                <h3>Log In</h3>
                <input required type="email" placeholder="Email" v-model="loginEmail">
                <input required type="password" placeholder="Password" v-model="loginPassword">
                <button type="submit">Log In</button>
            </form>
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
                signupEmail: null,
                signupPassword: null,
                loginEmail: null,
                loginPassword: null,
                loading: true
            }
        },
        methods: {
            signUp(e) {
                e.preventDefault();
                firebase.auth().createUserWithEmailAndPassword(this.signupEmail, this.signupPassword)
                    .catch(error => {
                        alert(error.message);
                    });
            },
            logIn(e) {
                e.preventDefault();
                this.loading = true;
                firebase.auth().signInWithEmailAndPassword(this.loginEmail, this.loginPassword)
                    .catch(error => {
                        this.loading = false;
                        alert(error.message);
                    });
            }
        },
        mounted() {
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    this.$store.state.user = user;
                    this.$router.push("dashboard");
                } else {
                    this.loading = false;
                    return;
                }
            })
        }
    }
</script>