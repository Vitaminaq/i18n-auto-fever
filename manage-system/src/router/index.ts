import { createRouter, createWebHistory } from "vue-router";

const Home = () => import("../pages/Home.vue");
const Login = () => import("../pages/Login.vue");

export enum RouterNames {
  Home = "Home",
  Login = "Login",
  Check = "Check"
}

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: RouterNames.Home,
      component: Home,
    },
    {
      path: "/login",
      name: RouterNames.Login,
      component: Login,
    },
    {
      path: "/check",
      name: RouterNames.Check,
      component: Home,
    },
  ],
});
