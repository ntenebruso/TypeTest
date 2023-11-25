<template>
    <div class="container">
        <form class="form" @submit.prevent="updatePassword">
            <h2>Update your password:</h2>
            <input
                required
                class="input input--form"
                type="password"
                placeholder="New password"
                v-model="passwordModel"
            />
            <button type="submit" class="button">Update password</button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "@/supabase";

const router = useRouter();

const passwordModel = ref("");

async function updatePassword() {
    const { error } = await supabase.auth.updateUser({
        password: passwordModel.value,
    });

    if (error) alert("Error updating password.");

    router.push("/dashboard");
}
</script>

<style scoped>
.input--form {
    width: 300px;
}
</style>
