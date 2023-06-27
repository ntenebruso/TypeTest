<template>
    <div class="container">
        <div class="forms">
            <form class="form" @submit.prevent="signUp">
                <h3>Sign Up</h3>
                <input
                    required
                    class="form__input"
                    type="email"
                    placeholder="Email"
                    v-model="signupEmail"
                />
                <input
                    required
                    class="form__input"
                    type="password"
                    placeholder="Password"
                    v-model="signupPassword"
                />
                <button class="button" type="submit">Sign Up</button>
                <p v-if="loginError">{{ loginError }}</p>
            </form>
            <form class="form" @submit.prevent="logIn">
                <h3>Log In</h3>
                <input
                    required
                    class="form__input"
                    type="email"
                    placeholder="Email"
                    v-model="loginEmail"
                />
                <input
                    required
                    class="form__input"
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

const loginError = ref("");
const signupError = ref("");

async function signUp() {
    try {
        await store.createUser(signupEmail.value, signupPassword.value);
    } catch (error) {
        signupError.value = error;
    }
}

async function logIn() {
    try {
        await store.signIn(loginEmail.value, loginPassword.value);
        router.push("/dashboard");
    } catch (error) {
        loginError.value = error;
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
    grid-template-columns: 1fr 1fr;
    gap: 100px;
}

.form {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.form__input {
    display: block;
    padding: 10px 15px;
    font-size: 20px;
    font-family: var(--main-font), sans-serif;
    background: rgba(0, 0, 0, 0.1);
    border: none;
    outline: none;
    color: var(--fg-color);
    border-radius: 5px;
    margin: 5px 0;
}

.form__input::placeholder {
    color: var(--sub-color);
}
</style>
