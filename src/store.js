import { defineStore, createPinia } from "pinia";
import { auth, getCurrentUser } from "@/firebase";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
} from "firebase/auth";

export const store = createPinia();

export const useUserStore = defineStore("user", {
    state: () => {
        return {
            user: null,
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
            const user = await getCurrentUser();

            if (user) {
                this.user = user;
            }
        },
    },
});
