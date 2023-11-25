import { defineStore, createPinia } from "pinia";
import { supabase } from "@/supabase";
import { User } from "@supabase/supabase-js";

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
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) throw error;

            this.user = data.user;
        },
        async signIn(email: string, password: string) {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            this.user = data.user;
        },
        async signOut() {
            const { error } = await supabase.auth.signOut();

            if (error) throw error;

            this.$reset();
        },
        async fetchUser() {
            if (!this.initialized) {
                this.initialized = true;
                const { data } = await supabase.auth.getUser();
                this.user = data.user;
                console.log("fetching user");
                this.loading = false;
            }
        },
    },
});
