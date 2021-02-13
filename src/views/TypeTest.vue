<template>
    <div class="type-test">
        <div class="prompt" ref="prompt" @click="focusInput" :class="{ 'blur' : !focus }">
            <div class="caret" ref="caret"></div>
            <div class="words">
                <div class="word" id="word" v-for="(word, index) in words" :key="index">
                    <span v-for="(letter, index) in word.split('')" :key="index">{{letter}}</span>
                </div>
            </div>
        </div>
        <h2 style="margin-top: 15px;">Time: {{testTime}}</h2>
        <h2 v-if="testFinished">WPM: {{wpm}}</h2>
        <input class="type-input" type="text" v-model="input" ref="textInput" @focus="changeFocus" @blur="changeFocus" @keydown="handleKeyDown" @input= "updateCorrect" :disabled="testFinished">
    </div>
</template>

<script>
import data from "../data";
export default {
    name: 'TypeTest',
    data() {
        return {
            words: data,
            input: '',
            focus: false,
            currentWordElementIndex: 0,
            currentLetterElementIndex: 0,
            totalChars: 0,
            correctWordChars: 0,
            spaces: 0,
            correctSpaces: 0,
            keyPressed: null,
            wpm: 0,
            testTime: 15,
            testFinished: false,
            ignoredKeycodes: [37, 38, 39, 40, 16, 17, 18, 91, 93],
            testStarted: false
        }
    },
    methods: {
        startTest() {
            var timerInterval = setInterval(() => {
                this.testTime--;
                if (this.testTime == 0) {
                    clearInterval(timerInterval);
                    this.finishTest();
                    console.log(this.wpm);
                }
            }, 1000)
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
                this.$refs['caret'].style.left = letters[this.currentLetterElementIndex-1].offsetLeft + letters[this.currentLetterElementIndex-1].offsetWidth + 'px';
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

            if (this.totalChars == 0) {
                this.startTest();
                console.log("TEST STARTED");
            }

            if (e.keyCode == 32) {
                e.preventDefault();
                if (this.input !== null) {
                    if (this.input == this.words[this.currentWordElementIndex]) {
                        this.correctSpaces++;
                        this.correctWordChars+=this.inputValue.length;
                        console.log("Correct space");
                    }
                    this.currentWordElementIndex++;
                    this.input = null;
                    this.currentLetterElementIndex = 0;
                    this.spaces++;
                    this.$refs['caret'].style.left = wordElement[this.currentWordElementIndex].offsetLeft + 'px';
                    wordElement[this.currentWordElementIndex].scrollIntoView({behavior: "smooth"});
                }
            } else if (e.keyCode == 8) {
                if (this.currentLetterElementIndex > 0) {
                    this.currentLetterElementIndex--;
                    if (this.currentLetterElementIndex == 0) {
                        this.$refs['caret'].style.left = wordElement[this.currentWordElementIndex].offsetLeft + 'px';
                    } else if (this.currentLetterElementIndex == 1) {
                        this.$refs['caret'].style.left = letters[0].offsetLeft + letters[0].offsetWidth + 'px';
                    } else {
                        this.$refs['caret'].style.left = letters[this.currentLetterElementIndex-1].offsetLeft + letters[this.currentLetterElementIndex-1].offsetWidth + 'px';
                    }
                    letters[this.currentLetterElementIndex].classList.remove("correct");
                    letters[this.currentLetterElementIndex].classList.remove("incorrect");
                    if (letters[this.currentLetterElementIndex].classList.contains("extra")) {
                        letters[this.currentLetterElementIndex].parentNode.removeChild(letters[this.currentLetterElementIndex]);
                    }
                } else {
                    e.preventDefault();
                }
            } else if (e.keyCode == this.ignoredKeycodes.filter(code => code == e.keyCode)[0]) {
                e.preventDefault();
            } else {
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
        }
    },
    computed: {
        inputValue() {
            return this.input.split('');
        }
    },
    mounted() {
        this.$refs['textInput'].focus();
    }
}
</script>