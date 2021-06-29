import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
    mode: "history",
    routes: [
        {
            path: '/',
            component: () => import("./views/TypeTest.vue")
        },
        {
            name: "login",
            path: '/login',
            component: () => import("./views/Login.vue")
        },
        {
            name: "dashboard",
            path: '/dashboard',
            component: () => import("./views/Dashboard.vue")
        }
    ]
})