import { defineStore, createPinia } from "pinia";
import { auth, getCurrentUser } from "@/firebase";
import { User } from "firebase/auth";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
} from "firebase/auth";

export const store = createPinia();

interface OptionsState {
    testTime: number;
    language: string;
    theme: string;
}

export const useOptionsStore = defineStore("options", {
    state(): OptionsState {
        if (localStorage.getItem("options")) {
            return JSON.parse(localStorage.getItem("options")!);
        }

        return {
            testTime: 15,
            language: "english",
            theme: "default.css",
        };
    },
    actions: {
        setTestTime(newTime: number) {
            this.testTime = newTime;
        },
        setLanguage(newLanguage: string) {
            this.language = newLanguage;
        },
        setTheme(newTheme: string) {
            this.theme = newTheme;
        },
    },
});

export const useUserStore = defineStore("user", {
    state() {
        return {
            user: null as User | null,
            loading: true,
            initialized: false,
        };
    },
    actions: {
        async createUser(email: string, password: string) {
            try {
                await createUserWithEmailAndPassword(auth, email, password);
            } catch (error) {
                throw error;
            }

            this.user = auth.currentUser;
        },
        async signIn(email: string, password: string) {
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
                try {
                    this.initialized = true;
                    this.user = await getCurrentUser();
                    console.log("fetching user");
                    this.loading = false;
                } catch (error) {
                    console.error(error);
                    throw error;
                }
            }
        },
    },
});
