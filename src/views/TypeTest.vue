<template>
    <SearchModal
        v-if="showingSearchModal"
        :close="
            () => {
                showingSearchModal = false;
                focusInput();
            }
        "
        :callback="(newLanguage) => optionsStore.setLanguage(newLanguage)"
        :items="languages"
    />
    <PromptModal
        v-if="showingTimeModal"
        :close="
            () => {
                showingTimeModal = false;
                focusInput();
            }
        "
        :callback="(newTestTime) => (optionsStore.testTime = newTestTime)"
        prompt="Test time"
        numeric="true"
        :initialValue="optionsStore.testTime"
    />
    <div class="container" v-if="!testFinished">
        <div class="settings" :class="{ 'settings--hidden': testStarted }">
            <div class="settings__group">
                <button
                    v-for="index in [15, 30, 60]"
                    :class="{
                        settings__button: true,
                        'settings__button--selected':
                            optionsStore.testTime == index,
                    }"
                    @click="
                        () => {
                            optionsStore.setTestTime(index);
                            focusInput();
                        }
                    "
                >
                    {{ index }}
                </button>
                <button
                    @click="() => (showingTimeModal = true)"
                    :class="{
                        settings__button: true,
                        'settings__button--selected':
                            optionsStore.testTime != 15 &&
                            optionsStore.testTime != 30 &&
                            optionsStore.testTime != 60,
                    }"
                >
                    <Icon :size="20" icon="tool" />
                </button>
            </div>
            <div class="settings__group">
                <button
                    class="settings__button"
                    style="display: flex; align-items: center"
                    @click="() => (showingSearchModal = true)"
                >
                    <Icon :size="17" icon="globe" style="margin-right: 5px" />
                    {{ optionsStore.language }}
                </button>
            </div>
        </div>
        <MiniSpinner v-if="testLoading" />
        <div class="test" v-else>
            <div class="test__time" id="test-time" v-if="testStarted">
                {{ testTime }}
            </div>
            <div
                class="test__prompt"
                ref="prompt"
                @click="focusInput"
                :class="{ 'test__prompt--blur': !focus }"
            >
                <div
                    :class="{
                        test__caret: true,
                        'test__caret--flashing': !testStarted,
                    }"
                    v-show="focus"
                    :style="{ left: caretXPos + 5 + 'px' }"
                    ref="caret"
                ></div>
                <div class="test__words" ref="wordsContainer">
                    <div
                        class="test__word"
                        id="word"
                        v-for="(word, i) in words"
                        :key="i"
                    >
                        <span
                            v-for="(letter, j) in word.split('')"
                            :key="j"
                            :class="{
                                'test__word--correct':
                                    correctMap[i] && correctMap[i][j] == true,
                                'test__word--incorrect':
                                    correctMap[i] && correctMap[i][j] == false,
                            }"
                            >{{ letter }}</span
                        >
                        <span
                            v-if="extraChars[i]"
                            v-for="(letter, j) in extraChars[i]"
                            :key="j"
                            class="test__word--incorrect test__word--extra"
                        >
                            {{ letter }}
                        </span>
                    </div>
                </div>
            </div>
            <input
                class="test__input"
                type="text"
                v-model="input"
                ref="textInput"
                @focus="changeFocus"
                @blur="changeFocus"
                @keydown="handleKeyDown"
                :disabled="testFinished"
            />
            <div class="restart-container">
                <button class="button button--restart" @click="restart">
                    <Icon icon="refresh-cw" />
                </button>
            </div>
        </div>
    </div>

    <Results
        v-if="testFinished"
        :wpm="wpm"
        :graphPoints="liveWpm"
        :accuracy="accuracyPercent"
        :accuracyStats="accuracyStats"
        :errorsPerSecond="errorsPerSecond"
        :correctChars="correctChars"
        :incorrectChars="incorrectChars"
        :testTime="initialTestTime"
        :language="optionsStore.language"
        :restart="restart.bind(this)"
    />
</template>

<script>
import Results from "@/components/Results.vue";
import SearchModal from "@/components/SearchModal.vue";
import PromptModal from "@/components/PromptModal.vue";
import MiniSpinner from "@/components/MiniSpinner.vue";
import Icon from "@/components/Icon.vue";
import { useOptionsStore } from "@/store";
import { mapStores } from "pinia";
import languages from "@/data/languages.json";

export default {
    components: { Results, SearchModal, PromptModal, Icon, MiniSpinner },
    data() {
        return {
            testLoading: true,
            showingSearchModal: false,
            showingTimeModal: false,
            correctMap: [],
            extraChars: [],
            caretXPos: 0,
            input: "",
            inputValue: [],
            words: [],
            recomputeWords: 0,
            focus: false,
            currentWordElementIndex: 0,
            currentLetterElementIndex: 0,
            totalChars: 0,
            correctWordChars: 0,
            errorsPerWord: 0,
            correctChars: 0,
            incorrectChars: 0,
            spaces: 0,
            correctSpaces: 0,
            wpm: 0,
            accuracyStats: { correct: 0, incorrect: 0 },
            errorsPerSecond: [],
            accuracyPercent: 0,
            liveWpm: [],
            currentErrors: 0,
            testTime: 0,
            initialTestTime: null,
            timerInterval: null,
            testSeconds: 0,
            testFinished: false,
            testStarted: false,
        };
    },
    methods: {
        async fetchWords(language) {
            this.testLoading = true;
            const res = await fetch(`./data/languages/${language}.json`);
            const data = await res.json();
            this.words = data.words.sort(() => Math.random() - 0.5);
            this.testLoading = false;
        },
        restart() {
            clearInterval(this.timerInterval);
            Object.assign(this.$data, this.$options.data());
            this.fetchWords(this.optionsStore.language);
            this.$nextTick(function () {
                this.$refs["textInput"].value = "";
                this.$refs["wordsContainer"].style.marginTop = 0 + "px";
                this.focusInput();
            });
        },
        startTest() {
            this.testTime = this.optionsStore.testTime;
            this.initialTestTime = this.optionsStore.testTime;
            console.log("Initial test time", this.initialTestTime);
            this.timerInterval = setInterval(() => {
                this.testSeconds++;
                this.liveWpm.push(
                    Math.round(
                        ((this.correctWordChars + this.spaces) *
                            (60 / this.testSeconds)) /
                            5
                    )
                );
                this.errorsPerSecond.push(this.currentErrors);
                this.currentErrors = 0;
                this.testTime--;
                if (this.testTime == 0) {
                    clearInterval(this.timerInterval);
                    this.finishTest();
                    console.log(this.errorsPerSecond);
                }
            }, 1000);
            this.testStarted = true;
        },
        focusInput() {
            this.$refs["textInput"].focus();
            this.focus = true;
        },
        changeFocus() {
            this.focus = !this.focus;
        },
        handleKeyDown(e) {
            const validKey =
                e.key.length == 1 &&
                e.code != "Space" &&
                !e.altKey &&
                !e.ctrlKey &&
                !e.metaKey;
            if (
                this.totalChars == 0 &&
                this.currentWordElementIndex == 0 &&
                validKey
            ) {
                this.startTest();
            }

            // HANDLE ACTUAL CHECKING
            if (e.code == "Space") {
                // If space is pressed, move onto next word and update caret
                e.preventDefault();
                if (this.input) {
                    if (
                        this.errorsPerWord == 0 &&
                        this.input.length ==
                            this.words[this.currentWordElementIndex].length
                    ) {
                        this.correctSpaces++;
                        this.accuracyStats.correct++;
                        this.correctWordChars += this.inputValue.length;
                    } else {
                        if (
                            this.input.length <
                            this.words[this.currentWordElementIndex].length
                        ) {
                            this.currentErrors +=
                                this.words[this.currentWordElementIndex]
                                    .length - this.input.length;
                            this.incorrectChars +=
                                this.words[this.currentWordElementIndex]
                                    .length - this.input.length;
                        }
                        this.accuracyStats.incorrect++;
                    }
                    this.currentWordElementIndex++;
                    this.input = null;
                    this.inputValue = [];
                    this.currentLetterElementIndex = 0;
                    this.errorsPerWord = 0;
                    this.spaces++;

                    var wordElement =
                        this.$refs["prompt"].querySelectorAll("div#word");
                    this.caretXPos =
                        wordElement[this.currentWordElementIndex].offsetLeft -
                        5;

                    if (
                        wordElement[this.currentWordElementIndex].offsetTop > 0
                    ) {
                        this.$refs["wordsContainer"].style.marginTop =
                            (parseInt(
                                this.$refs[
                                    "wordsContainer"
                                ].style.marginTop.slice(0, -2)
                            ) || 0) -
                            wordElement[this.currentWordElementIndex]
                                .offsetTop +
                            "px";
                    }
                }
            } else if (e.code == "Backspace") {
                // If backspace is pressed, handle moving caret and update inputValue
                if (this.currentLetterElementIndex > 0) {
                    if (
                        this.currentLetterElementIndex >
                        this.words[this.currentWordElementIndex].length
                    ) {
                        this.extraChars[this.currentWordElementIndex].pop();
                    } else {
                        this.correctMap[this.currentWordElementIndex].pop();
                    }
                    this.currentLetterElementIndex--;

                    this.inputValue.pop();

                    this.caretXPos -= 16;
                }
            } else if (!validKey) {
                // Make sure ignored keycodes (ie. CTRL or ALT) do not get counted as characters
                return;
            } else {
                // If the entered key is an actual character, handle the logic such as updating caret and checking if the character is correct
                this.inputValue.push(e.key);
                this.totalChars++;

                if (
                    this.inputValue.length >
                    this.words[this.currentWordElementIndex].length
                ) {
                    this.extraChars[this.currentWordElementIndex] =
                        this.extraChars[this.currentWordElementIndex] || [];
                    this.extraChars[this.currentWordElementIndex].push(e.key);

                    this.currentErrors++;
                    this.incorrectChars++;
                    this.errorsPerWord++;
                } else if (
                    this.inputValue[this.currentLetterElementIndex] ==
                    this.words[this.currentWordElementIndex][
                        this.currentLetterElementIndex
                    ]
                ) {
                    this.correctMap[this.currentWordElementIndex] =
                        this.correctMap[this.currentWordElementIndex] || [];
                    this.correctMap[this.currentWordElementIndex].push(true);
                    this.correctChars++;
                } else if (
                    this.inputValue[this.currentLetterElementIndex] !=
                    this.words[this.currentWordElementIndex][
                        this.currentLetterElementIndex
                    ]
                ) {
                    this.correctMap[this.currentWordElementIndex] =
                        this.correctMap[this.currentWordElementIndex] || [];
                    this.correctMap[this.currentWordElementIndex].push(false);
                    this.currentErrors++;
                    this.incorrectChars++;
                    this.errorsPerWord++;
                }

                this.caretXPos += 16;

                this.currentLetterElementIndex++;
            }
        },
        finishTest() {
            this.testFinished = true;
            this.wpm = Math.round(
                ((this.correctWordChars + this.correctSpaces) *
                    (60 / this.initialTestTime)) /
                    5
            );
            this.accuracyPercent = Math.round(
                (this.accuracyStats.correct /
                    (this.accuracyStats.incorrect +
                        this.accuracyStats.correct)) *
                    100
            );
        },
    },
    computed: {
        ...mapStores(useOptionsStore),
    },
    watch: {
        testLoading(newVal) {
            this.$nextTick(() => {
                if (newVal == false) {
                    this.focusInput();
                }
            });
        },
    },
    created() {
        this.$watch(
            () => this.optionsStore.language,
            (newLanguage) => this.fetchWords(newLanguage),
            { immediate: true }
        );
        this.languages = languages;
    },
};
</script>

<style scoped>
.container {
    height: 100%;
    display: grid;
    grid-template-rows: auto 1fr;
    position: relative;
}

.button--restart {
    background: transparent;
    font-size: 25px;
    color: var(--color-text-secondary);
}

.test {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
}

.test__time {
    font-size: 100px;
    text-align: center;
    line-height: 0;
    position: relative;
    bottom: 100px;
    color: var(--color-text-secondary);
    user-select: none;
}

.test__input {
    height: 0;
    padding: 0;
    margin: 0;
    display: block;
    border: none;
    outline: none;
}

.test__prompt {
    overflow: hidden;
    height: 125px;
    position: relative;
    font-size: 27px;
    color: var(--color-text-secondary);
    font-family: var(--mono-font);
}

.test__prompt--blur {
    filter: blur(2px);
}

.test__words {
    display: flex;
    flex-wrap: wrap;
    line-height: 1.7;
    user-select: none;
    transition: margin 0.1s ease-in-out;
}

.test__word {
    margin: 0 5px;
}

.test__word--correct {
    color: var(--color-test-correct) !important;
}

.test__word--incorrect {
    color: var(--color-test-incorrect) !important;
}

.settings {
    margin: 0 auto;
    margin-top: -25px;
    display: inline-block;
    width: fit-content;
    display: flex;
    padding: 10px 20px;
    font-family: var(--mono-font);
    font-size: 18px;
    border-radius: 20px;
    background: var(--color-ui-tint);
    color: var(--color-text-secondary);
    opacity: 1;
    visibility: visible;
    transition: opacity 0.1s linear, visibility 0.1s linear;
}

.settings--hidden {
    opacity: 0;
    visibility: hidden;
}

.settings__group {
    display: flex;
    align-items: center;
    column-gap: 10px;
}

.settings__group:not(:last-child)::after {
    content: "";
    display: inline-block;
    height: 100%;
    width: 2.5px;
    margin-right: 10px;
    border-radius: 20px;
    background: var(--color-text-secondary);
}

.settings__button {
    cursor: pointer;
    transition: color 0.3s;
}

.settings__button:hover {
    color: var(--color-text-primary);
}

.settings__button--selected {
    color: var(--color-ui-primary);
}

.restart-container {
    display: flex;
    justify-content: center;
    margin-top: 50px;
}

.test__caret {
    display: inline-block;
    vertical-align: middle;
    position: absolute;
    height: 32px;
    width: 2px;
    background: var(--color-ui-primary);
    left: 0;
    top: 7px;
    transition: left 0.08s linear;
}

.test__caret--flashing {
    animation: caret-animation 1s infinite;
}

@keyframes caret-animation {
    0% {
        opacity: 0;
    }

    50% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}
</style>
