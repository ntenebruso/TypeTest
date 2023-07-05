<template>
    <div class="dashboard">
        <div>
            <h1>Hello, {{ store.user!.email }}</h1>
            <button class="button" @click="handleClick">Sign out</button>
            <div class="saved-tests">
                <h2 class="saved-tests__title">Saved tests</h2>
                <MiniSpinner v-if="loading" />
                <div style="overflow: auto" v-else-if="tests">
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
                                    {{ test.data().wpm }}
                                </td>
                                <td class="data-table__item">
                                    {{ test.data().accuracy }}
                                </td>
                                <td class="data-table__item">
                                    {{ test.data().correctChars }}
                                </td>
                                <td class="data-table__item">
                                    {{ test.data().incorrectChars }}
                                </td>
                                <td class="data-table__item">
                                    {{ test.data().language || "N/A" }}
                                </td>
                                <td class="data-table__item">
                                    {{ test.data().testType }}
                                </td>
                                <td class="data-table__item">
                                    {{ formattedDate(test.data().date) }}
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
import { db } from "../firebase";
import { QueryDocumentSnapshot } from "firebase/firestore";
import {
    collection,
    getDocs,
    doc,
    getDoc,
    deleteDoc,
} from "@firebase/firestore";
import dayjs from "dayjs";
import router from "@/router";

const store = useUserStore();
const tests = ref<QueryDocumentSnapshot[] | null>(null);
const loading = ref(true);

const collRef = collection(db, "users", store.user!.uid, "tests");

async function deleteTest(id: string) {
    const docRef = doc(collRef, id);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot) {
        await deleteDoc(docRef);

        const deletedIndex = tests.value!.findIndex((test) => test.id == id);
        tests.value!.splice(deletedIndex, 1);
    }
}

onMounted(async () => {
    const querySnapshot = await getDocs(collRef);
    loading.value = false;
    tests.value = querySnapshot.docs.reverse();
});

async function handleClick() {
    await store.signOut();
    router.push("/");
}

const formattedDate = (date: string) =>
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
