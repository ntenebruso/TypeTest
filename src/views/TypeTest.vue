<template>
    <PromptModal
        v-if="showingTimeModal"
        :close="
            () => {
                showingTimeModal = false;
                focusInput();
            }
        "
        :callback="(newTestTime: number) => (optionsStore.testTime = newTestTime)"
        prompt="Test time"
        :numeric="true"
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
                    style="width: 24px; height: 24px"
                >
                    <Wrench />
                </button>
            </div>
            <div class="settings__group">
                <button
                    class="settings__button"
                    style="display: flex; align-items: center"
                    @click="
                        () => $options.emitter!.emit('openCommandPalette', 'LanguagePane')
                    "
                >
                    <BookA style="margin-right: 2px" />
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
                        :class="{
                            'test__word--incorrect':
                                wordMap[i] != null && wordMap[i] == false,
                            test__word: true,
                        }"
                        id="word"
                        v-for="(word, i) in words"
                        :key="i"
                    >
                        <span
                            v-for="(letter, j) in word.split('')"
                            :key="j"
                            :class="{
                                'test__letter--correct':
                                    characterMap[i] &&
                                    characterMap[i][j] == true,
                                'test__letter--incorrect':
                                    characterMap[i] &&
                                    characterMap[i][j] == false,
                            }"
                            >{{ letter }}</span
                        >
                        <span
                            v-if="extraCharacters[i]"
                            v-for="(letter, j) in extraCharacters[i]"
                            :key="j"
                            class="test__letter--incorrect test__letter--extra"
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
                    <RotateCw />
                </button>
            </div>
        </div>
    </div>

    <Results
        v-if="testFinished"
        :wpm="wpm"
        :liveWpm="liveWpm"
        :accuracy="accuracyPercent"
        :errorsPerSecond="errorsPerSecond"
        :correctChars="correctChars"
        :incorrectChars="incorrectChars"
        :correctWords="correctWords"
        :incorrectWords="incorrectWords"
        :testTime="initialTestTime"
        :language="optionsStore.language"
        :restart="() => restart()"
    />
</template>

<script lang="ts">
import Results from "@/components/Results.vue";
import SearchModal from "@/components/SearchModal.vue";
import PromptModal from "@/components/PromptModal.vue";
import MiniSpinner from "@/components/MiniSpinner.vue";
import { Wrench, RotateCw, BookA } from "lucide-vue-next";
import { useCommandEvent } from "@/utils/useCommandEvent";
import { useOptionsStore } from "@/store";
import { mapStores } from "pinia";

function initialState() {
    return {
        //// VISUAL TEST STATE ////
        /** Test finished state (show results if true) */
        testFinished: false,

        /** Test progress state */
        testStarted: false,

        /** Test loading state */
        testLoading: true,

        /** Current state of the test input element's focus */
        focus: false,

        /** Current x position of the caret */
        caretXPos: 0,

        /** Time modal display state */
        showingTimeModal: false,

        //// TEST WORD/CHARACTER TRACKING ////
        /** The test's words */
        words: [] as string[],

        /** The current word input */
        input: [] as string[],

        /** Array of words, represented as booleans (`true` = correct, `false` = incorrect) */
        wordMap: [] as boolean[],

        /** 2D array of words and characters inside the word, represented as booleans (`true` = correct, `false` = incorrect) */
        characterMap: [] as boolean[][],

        /** 2D array of words and extra characters entered in the current word */
        extraCharacters: [] as string[][],

        /** Index of the word the tester is currently on */
        currentWordIndex: 0,

        /** Index of the letter the tester is currently on, relative to the current word */
        currentLetterIndex: 0,

        /** The number of characters entered in the test */
        totalChars: 0,

        /** The number of correct characters entered in the test */
        correctChars: 0,

        /** The number of incorrect characters entered in the test */
        incorrectChars: 0,

        /** The number of correct words entered in the test */
        correctWords: 0,

        /** The number of incorrect words entered in the test */
        incorrectWords: 0,

        /** The number of errors at the current second of the test */
        currentErrors: 0,

        /** An array containing the WPM at each second of the test */
        liveWpm: [] as number[],

        /** Array of errors at each second of the test taken */
        errorsPerSecond: [] as number[],

        /** The final WPM of the test, calculated after the test finishes */
        wpm: 0,

        /** The overall accuracy at the test, calculated after the test finishes */
        accuracyPercent: 0,

        //// TEST PROGRESS ////
        /** How much time is left in the test */
        testTime: 0,

        /** How much time the test begins with */
        initialTestTime: 0,

        /** The test timer */
        timerInterval: null as ReturnType<typeof setInterval> | null,

        /** How much time has elapsed in the test */
        testSeconds: 0,
    };
}

export default {
    components: {
        Results,
        SearchModal,
        PromptModal,
        MiniSpinner,
        Wrench,
        RotateCw,
        BookA,
    },
    data() {
        return initialState();
    },
    methods: {
        async fetchWords(language: string) {
            this.testLoading = true;
            const res = await fetch(`./data/languages/${language}.json`);
            const data = await res.json();
            this.words = data.words.sort(() => Math.random() - 0.5);
            this.testLoading = false;
        },
        async restart() {
            clearInterval(this.timerInterval!);
            Object.assign(this.$data, initialState());
            await this.fetchWords(this.optionsStore.language);
            this.input = [];
            this.$nextTick(() => {
                (<HTMLElement>this.$refs["wordsContainer"]).style.marginTop =
                    0 + "px";
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
                        (this.correctChars * (60 / this.testSeconds)) / 5
                    )
                );
                this.errorsPerSecond.push(this.currentErrors);
                this.currentErrors = 0;
                this.testTime--;
                if (this.testTime == 0) {
                    clearInterval(this.timerInterval!);
                    this.finishTest();
                    console.log(this.errorsPerSecond);
                }
            }, 1000);
            this.testStarted = true;
        },
        focusInput() {
            (<HTMLInputElement>this.$refs["textInput"]).focus();
            this.focus = true;
        },
        changeFocus() {
            this.focus = !this.focus;
        },
        handleKeyDown(e: KeyboardEvent) {
            const validKey =
                e.key.length == 1 && !e.altKey && !e.ctrlKey && !e.metaKey;
            if (
                this.totalChars == 0 &&
                this.currentWordIndex == 0 &&
                validKey
            ) {
                this.startTest();
            }

            // HANDLE ACTUAL CHECKING
            if (e.code == "Space") {
                // If space is pressed, move onto next word and update caret
                e.preventDefault();

                var wordElement = (<HTMLElement>(
                    this.$refs["prompt"]
                )).querySelectorAll<HTMLElement>("div#word");

                if (this.input) {
                    if (
                        this.input.join("") == this.words[this.currentWordIndex]
                    ) {
                        this.correctWords++;
                        this.correctChars++; // count the correct space character

                        this.wordMap[this.currentWordIndex] = true;
                        console.log(this.wordMap);
                    } else {
                        if (
                            this.input.length <
                            this.words[this.currentWordIndex].length
                        ) {
                            this.currentErrors +=
                                this.words[this.currentWordIndex].length -
                                this.input.length;
                            this.incorrectChars +=
                                this.words[this.currentWordIndex].length -
                                this.input.length;
                        }
                        this.incorrectWords++;

                        this.wordMap[this.currentWordIndex] = false;
                    }
                    this.currentWordIndex++;
                    this.input = [];
                    this.currentLetterIndex = 0;

                    this.caretXPos =
                        wordElement[this.currentWordIndex].offsetLeft - 5;

                    if (wordElement[this.currentWordIndex].offsetTop > 0) {
                        (<HTMLElement>(
                            this.$refs["wordsContainer"]
                        )).style.marginTop =
                            (parseInt(
                                (<HTMLElement>(
                                    this.$refs["wordsContainer"]
                                )).style.marginTop.slice(0, -2)
                            ) || 0) -
                            wordElement[this.currentWordIndex].offsetTop +
                            "px";
                    }
                }
            } else if (e.code == "Backspace") {
                // If backspace is pressed, handle moving caret and update input
                e.preventDefault();

                if (this.currentLetterIndex > 0) {
                    if (
                        this.currentLetterIndex >
                        this.words[this.currentWordIndex].length
                    ) {
                        this.extraCharacters[this.currentWordIndex].pop();
                    } else {
                        this.characterMap[this.currentWordIndex].pop();
                    }
                    this.currentLetterIndex--;

                    this.input.pop();

                    this.caretXPos -= 16;
                }
            } else {
                // Make sure ignored keycodes (ie. CTRL or ALT) do not get counted as characters
                if (!validKey) return;

                // If the entered key is an actual character, handle the logic such as updating caret and checking if the character is correct
                e.preventDefault();

                this.input.push(e.key);
                this.totalChars++;

                if (
                    this.input.length > this.words[this.currentWordIndex].length
                ) {
                    this.extraCharacters[this.currentWordIndex] =
                        this.extraCharacters[this.currentWordIndex] || [];
                    this.extraCharacters[this.currentWordIndex].push(e.key);

                    this.currentErrors++;
                    this.incorrectChars++;
                } else if (
                    this.input[this.currentLetterIndex] ==
                    this.words[this.currentWordIndex][this.currentLetterIndex]
                ) {
                    this.characterMap[this.currentWordIndex] =
                        this.characterMap[this.currentWordIndex] || [];
                    this.characterMap[this.currentWordIndex].push(true);
                    this.correctChars++;
                } else if (
                    this.input[this.currentLetterIndex] !=
                    this.words[this.currentWordIndex][this.currentLetterIndex]
                ) {
                    this.characterMap[this.currentWordIndex] =
                        this.characterMap[this.currentWordIndex] || [];
                    this.characterMap[this.currentWordIndex].push(false);
                    this.currentErrors++;
                    this.incorrectChars++;
                }

                this.caretXPos += 16;

                this.currentLetterIndex++;
            }
            (<HTMLInputElement>this.$refs["textInput"]).value =
                this.input.join("");
        },
        finishTest() {
            this.wpm = Math.round(
                (this.correctChars * (60 / this.initialTestTime)) / 5
            );
            this.accuracyPercent = Math.round(
                (this.correctWords /
                    (this.incorrectWords + this.correctWords)) *
                    100
            );
            this.testFinished = true;
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
    },
    mounted() {
        this.$options.emitter = useCommandEvent();
        this.$options.emitter.on("commandPaletteClose", this.focusInput);
    },
    unmounted() {
        this.$options.emitter!.off("commandPaletteClose", this.focusInput);
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

.test__word--incorrect {
    text-decoration: underline;
    text-decoration-color: var(--color-test-incorrect);
    text-decoration-thickness: 2px;
}

.test__letter--correct {
    color: var(--color-test-correct) !important;
}

.test__letter--incorrect {
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
