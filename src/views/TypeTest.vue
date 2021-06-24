<template>
    <div class="container" :key="this.$store.state.componentKey">
        <div class="type-test" v-if="!testFinished">
            <div id="test-time" v-if="testStarted">{{testTime}}</div>
            <div class="prompt" ref="prompt" @click="focusInput" :class="{ 'blur' : !focus }">
                <div :class="{ caret: true, flashing: !testStarted }" ref="caret"></div>
                <div class="words">
                    <div class="word" id="word" v-for="(word, index) in words" :key="index">
                        <span v-for="(letter, index) in word.split('')" :key="index">{{letter}}</span>
                    </div>
                </div>
            </div>
            <input class="type-input" type="text" v-model="input" ref="textInput" @focus="changeFocus" @blur="changeFocus" @keydown="handleKeyDown" @input= "updateCorrect" :disabled="testFinished">
        </div>
        <Results v-if="testFinished" :wpm="wpm" :graphPoints="liveWpm" :accuracy="accuracyPercent"  :accuracyStats="accuracyStats" :errorsPerSecond="errorsPerSecond" :correctChars="correctChars" :incorrectChars="incorrectChars" />
    </div>
</template>

<script>
import data from "../data";
import gsap from "gsap";
import Results from "../components/Results.vue";

export default {
    components: { Results },
    data() {
        return {
            input: '',
            focus: false,
            currentWordElementIndex: 0,
            currentLetterElementIndex: 0,
            totalChars: 0,
            correctWordChars: 0,
            correctChars: 0,
            incorrectChars: 0,
            spaces: 0,
            correctSpaces: 0,
            keyPressed: null,
            wpm: 0,
            accuracyStats: { correct: 0, incorrect: 0 },
            errorsPerSecond: [],
            accuracyPercent: 0,
            liveWpm: [],
            currentErrors: 0,
            testTime: 15,
            testSeconds: 0,
            testFinished: false,
            ignoredKeycodes: [37, 38, 39, 40, 16, 17, 18, 91, 92, 93],
            testStarted: false,
        }
    },
    methods: {
        forceRerender() {
            this.$store.state.componentKey += 1;
        },
        startTest() {
            var timerInterval = setInterval(() => {
                this.testSeconds++;
                this.liveWpm.push(Math.round(((this.correctWordChars + this.spaces) * (60 / this.testSeconds)) / 5));
                this.errorsPerSecond.push(this.currentErrors);
                this.currentErrors = 0;
                this.testTime--;
                if (this.testTime == 0) {
                    clearInterval(timerInterval);
                    this.finishTest();
                    console.log(this.errorsPerSecond);
                }
            }, 1000)
            this.testStarted = true;
        },
        updateCorrect() {
            var wordElement = this.$refs['prompt'].querySelectorAll('div#word');
            var letters = Array.from(wordElement[this.currentWordElementIndex].children);

            letters.forEach((letter, index) => {
                if (this.inputValue[index] == null) {
                    letter.style.color = "#526777";
                } else if (this.inputValue[index] == letter.innerText) {
                    letter.classList.add('correct');
                } else if (this.inputValue[index] != letter.innerText) {
                    letter.classList.add('incorrect');
                }
            })

            if (this.inputValue.length > letters.length) {
                wordElement[this.currentWordElementIndex].innerHTML += `<span class="incorrect extra">${String.fromCharCode(this.keyPressed)}</span>`;
            }

            letters = Array.from(wordElement[this.currentWordElementIndex].children);

            if (this.currentLetterElementIndex > 0) {
                this.moveCaret(letters[this.currentLetterElementIndex-1].offsetLeft + letters[this.currentLetterElementIndex-1].offsetWidth);
            }

            if (this.inputValue[this.currentLetterElementIndex-1] != letters[this.currentLetterElementIndex-1].innerText) {
                this.currentErrors++;
                this.incorrectChars++;
            } else {
                this.correctChars++;
            }
        },
        focusInput() {
            this.$refs['textInput'].focus();
        },
        changeFocus() {
            this.focus == false ? this.focus = true : this.focus = false;
        },
        handleKeyDown(e) {
            var wordElement = this.$refs['prompt'].querySelectorAll('div#word');
            var letters = Array.from(wordElement[this.currentWordElementIndex].children);

            if (this.totalChars == 0 && this.currentWordElementIndex == 0 && !this.ignoredKeycodes.find(code => code == e.keyCode)) {
                this.startTest();
            }

            if (e.keyCode == 32) {
                e.preventDefault();
                if (this.input !== null) {
                    if (this.input == this.words[this.currentWordElementIndex]) {
                        this.correctSpaces++;
                        this.accuracyStats.correct++;
                        this.correctWordChars+=this.inputValue.length;
                    } else {
                        this.accuracyStats.incorrect++;
                    }
                    this.currentWordElementIndex++;
                    this.input = null;
                    this.currentLetterElementIndex = 0;
                    this.spaces++;
                    this.moveCaret(wordElement[this.currentWordElementIndex].offsetLeft);
                    wordElement[this.currentWordElementIndex].scrollIntoView({behavior: "smooth"});
                }
            } else if (e.keyCode == 8) {
                if (this.currentLetterElementIndex > 0) {
                    this.currentLetterElementIndex--;
                    if (this.currentLetterElementIndex == 0) {
                        this.moveCaret(wordElement[this.currentWordElementIndex].offsetLeft);
                    } else if (this.currentLetterElementIndex == 1) {
                        this.moveCaret(letters[0].offsetLeft + letters[0].offsetWidth);
                    } else {
                        this.moveCaret(letters[this.currentLetterElementIndex-1].offsetLeft + letters[this.currentLetterElementIndex-1].offsetWidth);
                    }
                    letters[this.currentLetterElementIndex].classList.remove("correct");
                    letters[this.currentLetterElementIndex].classList.remove("incorrect");
                    if (letters[this.currentLetterElementIndex].classList.contains("extra")) {
                        letters[this.currentLetterElementIndex].parentNode.removeChild(letters[this.currentLetterElementIndex]);
                    }
                } else {
                    e.preventDefault();
                }
            } else if (this.ignoredKeycodes.find(code => code == e.keyCode)) {
                e.preventDefault();
            } else if (e.keyCode == 27) {
                this.forceRerender();
            }
            else {
                this.currentLetterElementIndex++;
                this.keyPressed = e.keyCode;
                this.totalChars++;
            }
        },
        finishTest() {
            this.testFinished = true;
            this.wpm = Math.round(
                ((this.correctWordChars + this.correctSpaces) * (60 / 15)) / 5
            );
            this.accuracyPercent = Math.round(
                ((this.accuracyStats.correct / (this.accuracyStats.incorrect + this.accuracyStats.correct)) * 100)
            );
        },
        moveCaret(xPos) {
            gsap.to(".caret", { x: xPos, duration: .1 })
        }
    },
    computed: {
        inputValue() {
            return this.input.split('');
        },
        words() {
            return data.sort(() => Math.random() - 0.5);
        }
    },
    mounted() {
        this.$refs['textInput'].focus();
    }
}
</script>