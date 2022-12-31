import { createRouter, createWebHistory } from "vue-router";
import { auth, getCurrentUser } from "@/firebase";

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

router.beforeEach(async (to, from, next) => {
    if (to.matched.some((record) => record.meta.authRequired)) {
        if (await getCurrentUser()) {
            return next();
        } else {
            return next("/login");
        }
    }

    next();
});

export default router;
