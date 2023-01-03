<template>
    <div class="dashboard">
        <div>
            <h1>Hello, {{ store.user.email }}</h1>
            <button @click="handleClick">Sign out</button>
            <div class="saved-tests">
                <h2>Saved tests</h2>
                <MiniSpinner v-if="loading" />
                <table width="100%" v-else-if="tests.length">
                    <thead>
                        <tr>
                            <td>WPM</td>
                            <td>Accuracy</td>
                            <td>Correct chars</td>
                            <td>Incorrect chars</td>
                            <td>Test type</td>
                            <td>Date</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="test in tests" :key="test.id">
                            <td>{{ test.data().wpm }}</td>
                            <td>{{ test.data().accuracy }}</td>
                            <td>{{ test.data().correctChars }}</td>
                            <td>{{ test.data().incorrectChars }}</td>
                            <td>{{ test.data().testType }}</td>
                            <td>{{ formattedDate(test.data().date) }}</td>
                            <td>
                                <button @click="deleteTest(test.id)">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p v-else>No saved tests :0</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "@/store";
import MiniSpinner from "../components/MiniSpinner.vue";
import { db } from "../firebase";
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
const tests = ref();
const loading = ref(true);

const collRef = collection(db, "users", store.user.uid, "tests");

async function deleteTest(id) {
    const docRef = doc(collRef, id);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot) {
        await deleteDoc(docRef);

        const deletedIndex = tests.value.findIndex((test) => test.id == id);
        tests.value.splice(deletedIndex, 1);
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

const formattedDate = (date) => dayjs(date).format("DD MMM YYYY h:mm A");
</script>
