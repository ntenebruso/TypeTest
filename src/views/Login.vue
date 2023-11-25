<template>
    <PromptModal
        prompt="Reset password"
        :numeric="false"
        :callback="updatePassword"
        :close="() => (modalOpen = false)"
        placeholder="Account email"
        v-if="modalOpen"
    ></PromptModal>
    <div class="container">
        <div class="forms">
            <form class="form" @submit.prevent="signUp">
                <h2>Sign Up</h2>
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
                <button class="button button--form" type="submit">
                    Sign Up
                </button>
                <p v-if="signupError">{{ signupError }}</p>
            </form>
            <form class="form" @submit.prevent="logIn">
                <h2>Log In</h2>
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
                <button class="button button--form" type="submit">
                    Log In
                </button>
                <button
                    class="button button--form"
                    @click="() => (modalOpen = true)"
                    type="button"
                >
                    Forgot Password
                </button>
                <p v-if="loginError">{{ loginError }}</p>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import PromptModal from "@/components/PromptModal.vue";
import { ref, onMounted } from "vue";
import { useUserStore } from "@/store";
import { useRouter } from "vue-router";
import { supabase } from "@/supabase";

const store = useUserStore();
const router = useRouter();

const signupEmail = ref("");
const signupPassword = ref("");
const loginEmail = ref("");
const loginPassword = ref("");

const loginError = ref("");
const signupError = ref("");

const modalOpen = ref(false);

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

async function updatePassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: import.meta.env.VITE_SITE_URL + "/dashboard/update",
    });

    if (error) {
        loginError.value = "Link could not be sent.";
        return;
    }

    loginError.value = `Reset link was successfully sent to ${email}.`;
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

.button--form {
    display: block;
    width: 300px;
    margin: 5px 0;
}
</style>
