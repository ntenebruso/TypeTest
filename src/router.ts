import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/store";
import NProgress from "nprogress";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            name: "homepage",
            path: "/",
            meta: {
                title: "Home",
            },
            component: () => import("./views/TypeTest.vue"),
        },
        {
            name: "login",
            path: "/login",
            meta: {
                title: "Login",
            },
            component: () => import("./views/Login.vue"),
        },
        {
            name: "dashboard",
            path: "/dashboard",
            meta: {
                title: "Dashboard",
                authRequired: true,
            },
            component: () => import("./views/UserDashboard.vue"),
        },
        {
            name: "update-password",
            path: "/dashboard/update",
            meta: {
                title: "Update password",
                authRequired: true,
            },
            component: () => import("./views/UpdatePassword.vue"),
        },
    ],
});

const DEFAULT_TITLE = "TypeTest";
router.beforeEach(async (to, _from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title + " | TypeTest";
    } else {
        document.title = DEFAULT_TITLE;
    }

    const store = useUserStore();
    await store.fetchUser();

    if (to.matched.some((record) => record.meta.authRequired)) {
        NProgress.start();

        if (store.user) {
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
