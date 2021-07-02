import Vue from "vue";
import Router from "vue-router";
import { firebase } from "./firebase";
import "core-js/core";
import "regenerator-runtime/runtime";
import store from "./store";

const router = new Router({
    mode: "history",
    routes: [
        {
            path: '/',
            component: () => import("./views/TypeTest.vue"),
        },
        {
            name: "login",
            path: '/login',
            meta: {
                displayLoader: true
            },
            component: () => import("./views/Login.vue")
        },
        {
            name: "dashboard",
            path: '/dashboard',
            meta: {
                authRequired: true
            },
            component: () => import("./views/Dashboard.vue")
        }
    ]
})

router.beforeResolve(async(to, from, next) => {
    if (to.matched.some(record => record.meta.authRequired)) {
        store.commit("setLoading", true);
        if (await firebase.getCurrentUser()) {
            next();
            console.log("Logged in")
        } else {
            next("/login");
        }
    } else {
        if (to.matched.some(record => record.meta.displayLoader)) {
            store.commit("setLoading", true);
        }
        next();
    }
});

router.afterEach(() => {
    store.commit("setLoading", false);
});

Vue.use(Router);

export default router;