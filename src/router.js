import { createRouter, createWebHistory } from "vue-router";
import { auth, getCurrentUser } from "./firebase";
import store from "./store";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            component: () => import("./views/TypeTest.vue"),
        },
        {
            name: "login",
            path: "/login",
            component: () => import("./views/Login.vue"),
        },
        {
            name: "dashboard",
            path: "/dashboard",
            meta: {
                authRequired: true,
            },
            component: () => import("./views/Dashboard.vue"),
        },
    ],
});

router.beforeResolve(async (to, from, next) => {
    if (to.matched.some((record) => record.meta.authRequired)) {
        store.state.loading = true;
        if (await getCurrentUser()) {
            next();
            console.log("Logged in");
        } else {
            next("/login");
        }
    } else {
        next();
    }
});

router.afterEach(() => {
    store.state.loading = false;
});

export default router;
