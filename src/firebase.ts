import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCb1Q2Uj41yIBlpDRIQFr1JN9zeg5gkvVY",
    authDomain: "typetest-71455.firebaseapp.com",
    projectId: "typetest-71455",
    storageBucket: "typetest-71455.appspot.com",
    messagingSenderId: "533650024794",
    appId: "1:533650024794:web:48309e2df43d7744806b63",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export function getCurrentUser(): Promise<User | null> {
    return new Promise<User | null>((resolve, reject) => {
        const destroyListener = onAuthStateChanged(
            auth,
            (user) => {
                resolve(user);
            },
            reject
        );
        destroyListener();
    });
}