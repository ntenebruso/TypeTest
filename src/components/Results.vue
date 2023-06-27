<template>
    <div class="results">
        <div class="stats">
            <div class="group">
                <div class="top">WPM</div>
                <div class="bottom">{{ props.wpm }}</div>
            </div>
            <div class="group">
                <div class="top">Accuracy</div>
                <div class="bottom">{{ props.accuracy }}%</div>
            </div>
        </div>
        <div class="chart">
            <canvas width="805" height="200" ref="chartCanvas"></canvas>
        </div>
        <div class="extra-stats">
            <div class="group">
                <div class="top">Test time</div>
                <div class="bottom">{{ props.graphPoints.length }}</div>
            </div>
            <div class="group">
                <div class="top">Words</div>
                <div class="bottom" aria-label="correct/incorrect">
                    {{ props.accuracyStats.correct }}/{{
                        props.accuracyStats.incorrect
                    }}
                </div>
            </div>
            <div class="group">
                <div class="top">Characters</div>
                <div class="bottom" aria-label="correct/incorrect">
                    {{ props.correctChars }}/{{ props.incorrectChars }}
                </div>
            </div>
        </div>
        <div class="button-container">
            <button class="button" @click="props.restart">Try again</button>
            <button v-if="store.user" class="button" @click="saveResults">
                Save test
            </button>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Chart from "chart.js/auto";
import { db } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useUserStore } from "@/store";

const store = useUserStore();
const chartCanvas = ref();

const props = defineProps([
    "wpm",
    "graphPoints",
    "accuracy",
    "accuracyStats",
    "errorsPerSecond",
    "correctChars",
    "incorrectChars",
    "testTime",
    "restart",
]);

async function saveResults(e) {
    const docRef = doc(
        db,
        "users",
        store.user.uid,
        "tests",
        Date.now().toString()
    );
    await setDoc(docRef, {
        date: Date.now(),
        wpm: props.wpm,
        accuracy: props.accuracy,
        accuracyStats: props.accuracyStats,
        correctChars: props.correctChars,
        incorrectChars: props.incorrectChars,
        testType: `Test ${props.testTime}`,
    });
    e.target.disabled = true;

    alert("saved!");
}

onMounted(() => {
    var chartLabels = [];
    for (let i = 0; i < props.graphPoints.length; i++) {
        chartLabels.push(i + 1);
    }

    var ctx = chartCanvas.value.getContext("2d");
    Chart.defaults.font.family = "Roboto Mono";

    var chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: chartLabels,
            datasets: [
                {
                    label: "wpm",
                    data: props.graphPoints,
                    order: 2,
                    fill: "origin",
                },
                {
                    clip: false,
                    label: "errors",
                    data: props.errorsPerSecond,
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
                    callbacks: {
                        label: function (context) {
                            let label = context.dataset.label || "";

                            if (label) {
                                label += ": ";
                            }
                            if (context.parsed.y) {
                                label += context.parsed.y;
                            } else {
                                label += "0";
                            }
                            return label;
                        },
                    },
                },
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: "Seconds",
                    },
                    ticks: {
                        display: true,
                    },
                },
                y: {
                    suggestedMin: 0,
                    display: true,
                    title: {
                        display: true,
                        text: "Words per Minute",
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
                    },
                    ticks: {
                        precision: 0,
                        display: true,
                    },
                    grid: {
                        display: false,
                    },
                },
            },
        },
    });
});
</script>

<style scoped>
.results {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 50px;
    grid-template-areas:
        "stats chart"
        "extra-stats extra-stats";
}

.stats {
    grid-area: stats;
}

.stats .group {
    margin-bottom: 25px;
}

.stats .top {
    line-height: 0.5;
    font-size: 40px;
}

.stats .bottom {
    font-size: 80px;
    color: var(--fg-color);
}

.button-container {
    display: flex;
    column-gap: 10px;
}

.chart {
    min-width: 0;
    grid-area: chart;
}

.extra-stats {
    grid-area: extra-stats;
}

.extra-stats {
    display: flex;
    justify-content: space-between;
}

.extra-stats .top {
    line-height: 0.5;
    font-size: 20px;
}

.extra-stats .bottom {
    font-size: 40px;
    color: var(--fg-color);
}
</style>
