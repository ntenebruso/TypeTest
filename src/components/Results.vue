<template>
    <div class="results">
        <div class="stats">
            <div class="group">
                <div class="top">WPM</div>
                <div class="bottom">{{wpm}}</div>
            </div>
            <div class="group">
                <div class="top">Accuracy</div>
                <div class="bottom">{{accuracy}}%</div>
            </div>
        </div>
        <div class="chart">
            <canvas width="805" height="200" ref="chartCanvas"></canvas>
        </div>
        <div class="extra-stats">
            <div class="group">
                <div class="top">Test time</div>
                <div class="bottom">{{graphPoints.length}}</div>
            </div>
            <div class="group">
                <div class="top">Words</div>
                <div class="bottom" aria-label="correct/incorrect">{{accuracyStats.correct}}/{{accuracyStats.incorrect}}</div>
            </div>
            <div class="group">
                <div class="top">Characters</div>
                <div class="bottom" aria-label="correct/incorrect">{{correctChars}}/{{incorrectChars}}</div>
            </div>
        </div>
    </div>
</template>

<script>
    import Chart from "chart.js";

    export default {
        props: ["wpm", "graphPoints", "accuracy", "accuracyStats", "errorsPerSecond", "correctChars", "incorrectChars"],
        mounted() {
            var chartLabels = [];
            for (let i = 0; i < this.graphPoints.length; i++) {
                chartLabels.push(i+1)
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
                            radius: 2
                        },
                        {
                            label: "errors",
                            data: this.errorsPerSecond,
                            type: "scatter",
                            yAxisID: "error",
                            borderColor: "rgba(255, 125, 125, 1)",
                            pointBackgroundColor: "rgba(255, 125, 125, 1)",
                            borderWidth: 2,
                            order: 1,
                            pointStyle: "crossRot"
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    tooltips: {
                        mode: "index",
                        intersect: false
                    },
                    scales: {
                        xAxes: [
                            {
                                ticks: {
                                    fontFamily: "Roboto",
                                    autoSkip: true,
                                    autoSkipPadding: 40,
                                },
                                display: true,
                                scaleLabel: {
                                    display: false,
                                    labelString: "Seconds",
                                    fontFamily: "Roboto",
                                },
                            },
                        ],
                        yAxes: [
                            {
                                id: "wpm",
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: "Words per Minute",
                                    fontFamily: "Roboto",
                                },
                                ticks: {
                                    fontFamily: "Roboto",
                                    beginAtZero: true,
                                    min: 0,
                                    autoSkip: true,
                                    autoSkipPadding: 40,
                                },
                                gridLines: {
                                    display: true,
                                },
                            },
                            {
                                id: "error",
                                display: true,
                                position: "right",
                                scaleLabel: {
                                    display: true,
                                    labelString: "Errors",
                                    fontFamily: "Roboto",
                                },
                                ticks: {
                                    precision: 0,
                                    fontFamily: "Roboto",
                                    beginAtZero: true,
                                    autoSkip: true,
                                    autoSkipPadding: 40,
                                },
                                gridLines: {
                                    display: false,
                                },
                            },
                        ]
                    }
                }
            })
        }
    }
</script>