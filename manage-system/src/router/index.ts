import { createRouter, createWebHistory } from 'vue-router';

const Index = () => import('../pages/index.vue');

export default createRouter({
    history: createWebHistory(),
    routes: [{
        path: '/',
        name: 'index',
        component: Index
    }]
})