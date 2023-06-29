import { defineStore, createPinia } from "pinia";
import { auth, getCurrentUser } from "@/firebase";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
} from "firebase/auth";

export const store = createPinia();

export const useOptionsStore = defineStore("options", {
    state() {
        if (localStorage.getItem("options")) {
            return JSON.parse(localStorage.getItem("options"));
        }

        return {
            testTime: 15,
            language: "english",
            theme: "default.css",
        };
    },
    actions: {
        setTestTime(newTime) {
            this.testTime = newTime;
        },
        setLanguage(newLanguage) {
            this.language = newLanguage;
        },
        setTheme(newTheme) {
            this.theme = newTheme;
        },
    },
});

export const useUserStore = defineStore("user", {
    state() {
        return {
            user: null,
            loading: true,
            initialized: false,
        };
    },
    actions: {
        async createUser(email, password) {
            try {
                await createUserWithEmailAndPassword(auth, email, password);
            } catch (error) {
                throw error;
            }

            this.user = auth.currentUser;
        },
        async signIn(email, password) {
            try {
                await signInWithEmailAndPassword(auth, email, password);
            } catch (error) {
                throw error;
            }

            this.user = auth.currentUser;
        },
        async signOut() {
            try {
                await signOut(auth);
            } catch (error) {
                throw error;
            }

            this.$reset();
        },
        async fetchUser() {
            if (!this.initialized) {
                this.initialized = true;
                this.user = await getCurrentUser();
                console.log("fetching user");
                this.loading = false;
            }
        },
    },
});
