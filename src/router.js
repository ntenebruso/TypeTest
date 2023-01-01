import { createRouter, createWebHistory } from "vue-router";
import { auth, getCurrentUser } from "@/firebase";
import NProgress from "nprogress";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            name: "homepage",
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
        NProgress.start();
        console.log(to.name);

        if (await getCurrentUser()) {
            return next();
        } else {
            return next("/login");
        }
    }

    next();
});

router.afterEach(() => {
    NProgress.done();
});

export default router;
