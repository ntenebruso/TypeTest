<template>
    <div class="dashboard" v-if="user">
        <div>
            <h1>Hello, {{ user.email }}</h1>
            <button @click="signOut">Sign out</button>
            <div class="saved-tests">
                <h2>Saved tests</h2>
                <MiniSpinner v-if="loading" />
                <table width="100%" v-else>
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
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import MiniSpinner from "../components/MiniSpinner.vue";
import { getCurrentUser, db, auth } from "../firebase";
import { signOut } from "@firebase/auth";
import { collection, getDocs } from "@firebase/firestore";
import dayjs from "dayjs";

export default {
    components: { MiniSpinner },
    data() {
        return {
            user: null,
            tests: null,
            loading: true,
        };
    },
    async mounted() {
        this.user = await getCurrentUser();

        const collRef = collection(db, "users", this.user.uid, "tests");
        const querySnapshot = await getDocs(collRef);
        this.loading = false;
        this.tests = querySnapshot.docs.reverse();
    },
    methods: {
        async signOut() {
            await signOut(auth);
            location.href = "/";
        },
    },
    computed: {
        formattedDate() {
            return (date) => dayjs(date).format("DD MMM YYYY h:mm A");
        },
    },
};
</script>
