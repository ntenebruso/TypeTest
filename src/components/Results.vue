<template>
    <div class="results">
        <div class="stats">
            <div class="group">
                <div class="top">WPM</div>
                <div class="bottom">{{ wpm }}</div>
            </div>
            <div class="group">
                <div class="top">Accuracy</div>
                <div class="bottom">{{ accuracy }}%</div>
            </div>
        </div>
        <div class="chart">
            <canvas width="805" height="200" ref="chartCanvas"></canvas>
        </div>
        <div class="extra-stats">
            <div class="group">
                <div class="top">Test time</div>
                <div class="bottom">{{ graphPoints.length }}</div>
            </div>
            <div class="group">
                <div class="top">Words</div>
                <div class="bottom" aria-label="correct/incorrect">
                    {{ accuracyStats.correct }}/{{ accuracyStats.incorrect }}
                </div>
            </div>
            <div class="group">
                <div class="top">Characters</div>
                <div class="bottom" aria-label="correct/incorrect">
                    {{ correctChars }}/{{ incorrectChars }}
                </div>
            </div>
        </div>
        <button style="margin: auto" @click="saveResults">Save test</button>
    </div>
</template>

<script>
import Chart from "chart.js/auto";
import { db, auth } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

export default {
    props: [
        "wpm",
        "graphPoints",
        "accuracy",
        "accuracyStats",
        "errorsPerSecond",
        "correctChars",
        "incorrectChars",
        "testTime",
    ],
    methods: {
        async saveResults() {
            console.log(auth.currentUser.uid);
            const docRef = doc(
                db,
                "users",
                auth.currentUser.uid,
                "tests",
                Date.now().toString()
            );
            await setDoc(docRef, {
                date: Date.now(),
                wpm: this.wpm,
                accuracy: this.accuracy,
                accuracyStats: this.accuracyStats,
                correctChars: this.correctChars,
                incorrectChars: this.incorrectChars,
                testType: `Test ${this.testTime}`,
            });

            alert("saved!");
        },
    },
    mounted() {
        var chartLabels = [];
        for (let i = 0; i < this.graphPoints.length; i++) {
            chartLabels.push(i + 1);
        }

        var ctx = this.$refs["chartCanvas"].getContext("2d");
        // eslint-disable-next-line no-unused-vars
        var chart = new Chart(ctx, {
            type: "line",
            data: {
                labels: chartLabels,
                datasets: [
                    {
                        label: "wpm",
                        data: this.graphPoints,
                        order: 2,
                    },
                    {
                        clip: false,
                        label: "errors",
                        data: this.errorsPerSecond,
                        type: "scatter",
                        yAxisID: "error",
                        borderColor: "rgba(255, 125, 125, 1)",
                        pointBackgroundColor: "rgba(255, 125, 125, 1)",
                        borderWidth: 2,
                        order: 1,
                        pointStyle: "crossRot",
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        mode: "index",
                        intersect: false,
                    },
                },
                scales: {
                    x: {
                        ticks: {
                            display: true,
                        },
                        display: true,
                        title: {
                            display: true,
                            text: "Seconds",
                            font: "DM Sans",
                        },
                    },
                    y: {
                        suggestedMin: 0,
                        display: true,
                        title: {
                            display: true,
                            text: "Words per Minute",
                            font: "DM Sans",
                        },
                        ticks: {
                            display: true,
                        },
                    },
                    error: {
                        axis: "y",
                        position: "right",
                        beginAtZero: true,
                        display: true,
                        title: {
                            display: true,
                            text: "Errors",
                            font: "DM Sans",
                        },
                        ticks: {
                            precision: 0,
                            autoSkip: true,
                            display: false,
                        },
                        grid: {
                            display: false,
                        },
                    },
                },
            },
        });
    },
};
</script>
