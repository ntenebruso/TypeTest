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
                <div class="bottom">{{ props.testTime }}s</div>
            </div>
            <div class="group">
                <div class="top">Language</div>
                <div class="bottom">{{ props.language }}</div>
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
            <button
                v-if="store.user"
                :disabled="saved || loading"
                class="button"
                @click="saveResults"
            >
                Save test
            </button>
            <p v-if="saved">Test saved!</p>
            <p v-if="error">Error saving test.</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import Chart from "chart.js/auto";
import { useUserStore } from "@/store";
import { supabase } from "@/supabase";

const store = useUserStore();
const chartCanvas = ref();
const loading = ref(false);
const saved = ref(false);
const error = ref(false);

let chart: Chart;

const props = defineProps([
    "wpm",
    "graphPoints",
    "accuracy",
    "accuracyStats",
    "errorsPerSecond",
    "correctChars",
    "incorrectChars",
    "testTime",
    "language",
    "restart",
]);

async function saveResults() {
    loading.value = true;
    const doc = {
        userid: store.user!.id,
        date: Date.now(),
        wpm: props.wpm,
        accuracy: props.accuracy,
        correctwords: props.accuracyStats.correct,
        incorrectwords: props.accuracyStats.incorrect,
        correctchars: props.correctChars,
        incorrectchars: props.incorrectChars,
        language: props.language,
        testtime: props.testTime,
    };
    console.log(doc);
    const { error: saveError } = await supabase.from("tests").insert(doc);
    loading.value = false;

    if (saveError) {
        error.value = true;
        return;
    }

    saved.value = true;
}

onMounted(() => {
    var chartLabels = [];
    for (let i = 0; i < props.graphPoints.length; i++) {
        chartLabels.push(i + 1);
    }

    var ctx = chartCanvas.value.getContext("2d");
    Chart.defaults.font.family = "Roboto Mono";

    chart = new Chart(ctx, {
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

onUnmounted(() => {
    chart.destroy();
});
</script>

<style scoped>
.results {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 50px;
    grid-template-areas:
        "stats chart"
        "extra-stats extra-stats"
        "buttons buttons";
}

.stats {
    grid-area: stats;
    display: grid;
}

.stats .group {
    margin-bottom: 25px;
}

.stats .top {
    line-height: 1;
    font-size: 40px;
}

.stats .bottom {
    margin-top: -5px;
    font-size: 80px;
    color: var(--color-ui-primary);
}

.button-container {
    display: flex;
    align-items: center;
    column-gap: 10px;
    grid-area: buttons;
}

.chart {
    min-width: 0;
    width: 100%;
    grid-area: chart;
}

.extra-stats {
    grid-area: extra-stats;
    display: grid;
    grid-template-columns: repeat(4, auto);
    justify-content: space-between;
}

.extra-stats .top {
    line-height: 1;
    font-size: 20px;
}

.extra-stats .bottom {
    margin-top: -5px;
    font-size: 40px;
    color: var(--color-ui-primary);
}

@media (max-width: 900px) {
    .results {
        grid-template-columns: 1fr;
        grid-template-areas:
            "stats"
            "chart"
            "extra-stats"
            "buttons";
    }

    .stats {
        justify-content: center;
        grid-template-columns: auto auto;
        column-gap: 50px;
    }
}

@media (max-width: 700px) {
    .stats {
        grid-template-columns: auto;
    }

    .extra-stats {
        grid-template-columns: repeat(2, auto);
        justify-content: space-around;
    }
}
</style>
