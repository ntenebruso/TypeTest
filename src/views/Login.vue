<template>
    <div class="container">
        <div class="forms">
            <form class="form" @submit.prevent="signUp">
                <h3>Sign Up</h3>
                <input
                    required
                    class="input input--form"
                    type="email"
                    placeholder="Email"
                    v-model="signupEmail"
                />
                <input
                    required
                    class="input input--form"
                    type="password"
                    placeholder="Password"
                    v-model="signupPassword"
                />
                <button class="button" type="submit">Sign Up</button>
                <p v-if="signupError">{{ signupError }}</p>
            </form>
            <form class="form" @submit.prevent="logIn">
                <h3>Log In</h3>
                <input
                    required
                    class="input input--form"
                    type="email"
                    placeholder="Email"
                    v-model="loginEmail"
                />
                <input
                    required
                    class="input input--form"
                    type="password"
                    placeholder="Password"
                    v-model="loginPassword"
                />
                <button class="button" type="submit">Log In</button>
                <p v-if="loginError">{{ loginError }}</p>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUserStore } from "@/store";
import { useRouter } from "vue-router";

const store = useUserStore();
const router = useRouter();

const signupEmail = ref("");
const signupPassword = ref("");
const loginEmail = ref("");
const loginPassword = ref("");

const loginError = ref("");
const signupError = ref("");

async function signUp() {
    try {
        await store.createUser(signupEmail.value, signupPassword.value);
        router.push("/dashboard");
    } catch (error: any) {
        signupError.value = error.message;
    }
}

async function logIn() {
    try {
        await store.signIn(loginEmail.value, loginPassword.value);
        router.push("/dashboard");
    } catch (error: any) {
        loginError.value = error.message;
    }
}

onMounted(async () => {
    if (store.user) {
        router.push("/dashboard");
    }
});
</script>

<style scoped>
.forms {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 100px;
}

.form {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.input--form {
    width: 300px;
}
</style>
