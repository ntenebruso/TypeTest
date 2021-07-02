<template>
    <div class="login-wrapper">
        <div class="forms">
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
    import { firebase, db } from "../firebase";

    export default {
        data() {
            return {
                signupEmail: null,
                signupPassword: null,
                loginEmail: null,
                loginPassword: null,
            }
        },
        methods: {
            signUp(e) {
                e.preventDefault();
                firebase.auth().createUserWithEmailAndPassword(this.signupEmail, this.signupPassword)
                    .then(cred => {
                        db.collection("users").doc(cred.user.uid).set({ startedTests: 0 });
                    })
                    .catch(error => {
                        alert(error.message);
                    });
            },
            logIn(e) {
                e.preventDefault();
                firebase.auth().signInWithEmailAndPassword(this.loginEmail, this.loginPassword)
                    .then(() => {
                        this.$router.push({ path: "/dashboard" })
                    })
                    .catch(error => {
                        alert(error.message);
                    });
            }
        },
        async mounted() {
            if (await firebase.getCurrentUser()) {
                this.$router.push({ path: "/dashboard" });
            }
        }
    }
</script>