<template>
    <div class="login-wrapper">
        <div class="forms">
            <form class="signup-form form" @submit.prevent="signUp">
                <h3>Sign Up</h3>
                <input
                    required
                    type="email"
                    placeholder="Email"
                    v-model="signupEmail"
                />
                <input
                    required
                    type="password"
                    placeholder="Password"
                    v-model="signupPassword"
                />
                <button type="submit">Sign Up</button>
            </form>
            <form class="login-form form" @submit.prevent="logIn">
                <h3>Log In</h3>
                <input
                    required
                    type="email"
                    placeholder="Email"
                    v-model="loginEmail"
                />
                <input
                    required
                    type="password"
                    placeholder="Password"
                    v-model="loginPassword"
                />
                <button type="submit">Log In</button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "@/store";
import { useRouter } from "vue-router";

const store = useUserStore();
const router = useRouter();

const signupEmail = ref("");
const signupPassword = ref("");
const loginEmail = ref("");
const loginPassword = ref("");

async function signUp() {
    await store.createUser(signupEmail.value, signupPassword.value);
}

async function logIn() {
    await store.signIn(loginEmail.value, loginPassword.value);
    router.push("/dashboard");
}

onMounted(async () => {
    if (store.user) {
        router.push("/dashboard");
    }
});
</script>
