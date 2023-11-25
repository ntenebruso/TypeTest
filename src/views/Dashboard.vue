<template>
    <div class="dashboard">
        <div>
            <h1>Hello, {{ store.user!.email }}</h1>
            <button class="button" @click="handleClick">Sign out</button>
            <div class="saved-tests">
                <h2 class="saved-tests__title">Saved tests</h2>
                <MiniSpinner v-if="loading" />
                <div style="overflow: auto" v-else-if="tests!.length > 0">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <td class="data-table__item">WPM</td>
                                <td class="data-table__item">Accuracy</td>
                                <td class="data-table__item">Correct chars</td>
                                <td class="data-table__item">
                                    Incorrect chars
                                </td>
                                <td class="data-table__item">Language</td>
                                <td class="data-table__item">Test type</td>
                                <td class="data-table__item">Date</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                class="data-table__row"
                                v-for="test in tests"
                                :key="test.id"
                            >
                                <td class="data-table__item">
                                    {{ test.wpm }}
                                </td>
                                <td class="data-table__item">
                                    {{ test.accuracy }}
                                </td>
                                <td class="data-table__item">
                                    {{ test.correctchars }}
                                </td>
                                <td class="data-table__item">
                                    {{ test.incorrectchars }}
                                </td>
                                <td class="data-table__item">
                                    {{ test.language }}
                                </td>
                                <td class="data-table__item">
                                    {{ test.testtime }}
                                </td>
                                <td class="data-table__item">
                                    {{ formattedDate(test.date) }}
                                </td>
                                <td class="data-table__item">
                                    <button
                                        class="button"
                                        @click="deleteTest(test.id)"
                                    >
                                        <i class="fa-solid fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p v-else>No saved tests :0</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUserStore } from "@/store";
import MiniSpinner from "../components/MiniSpinner.vue";
import { supabase } from "@/supabase";
import dayjs from "dayjs";
import router from "@/router";
import { Database } from "@/database.types";

const store = useUserStore();
const tests = ref<Database["public"]["Tables"]["tests"]["Row"][] | null>(null);
const loading = ref(true);

async function deleteTest(id: string) {
    await supabase.from("tests").delete().eq("id", id);
    const deletedIndex = tests.value!.findIndex((test) => test.id == id);
    tests.value!.splice(deletedIndex, 1);
}

onMounted(async () => {
    const { data, error } = await supabase
        .from("tests")
        .select()
        .eq("userid", store.user!.id)
        .order("date", { ascending: false });

    if (error) console.error(error);

    loading.value = false;
    tests.value = data;
});

async function handleClick() {
    await store.signOut();
    router.push("/");
}

const formattedDate = (date: number) =>
    dayjs(date).format("DD MMM YYYY h:mm A");
</script>

<style scoped>
.dashboard {
    align-self: start;
    padding: 100px 0 0 0;
    overflow: auto;
}

.saved-tests {
    margin-top: 100px;
}

.saved-tests__title {
    margin-bottom: 15px;
}

.data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 17px;
}

.data-table__item {
    padding: 20px;
}

.data-table__row:nth-child(odd) {
    background: rgba(0, 0, 0, 0.1);
}
</style>
