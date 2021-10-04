<template>
    <div class="dashboard" v-if="user">
        <div>
            <h1>Hello, {{user.email}}</h1>
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
                            <td>{{test.data().wpm}}</td>
                            <td>{{test.data().accuracy}}</td>
                            <td>{{test.data().correctChars}}</td>
                            <td>{{test.data().incorrectChars}}</td>
                            <td>{{test.data().testType}}</td>
                            <td>{{formattedDate(test.data().date)}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    import MiniSpinner from "../components/MiniSpinner.vue";
    import { firebase, db } from "../firebase";
    import dayjs from "dayjs";

    export default {
        components: { MiniSpinner },
        data() {
            return {
                user: null,
                tests: null,
                loading: true
            }
        },
        mounted() {
            firebase.getCurrentUser().then(user => {
                this.user = user;

                db.collection("users").doc(user.uid).collection("tests").get().then(querySnapshot => {
                    this.loading = false;
                    this.tests = querySnapshot.docs.reverse();
                })
            });
        },
        computed: {
            formattedDate() {
                return date => dayjs(date).format("DD MMM YYYY h:mm A");
            }
        }
    }
</script>