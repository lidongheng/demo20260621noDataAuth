import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/HomeView.vue"),
  },
  {
    path: "/noDataAuth",
    name: "noDataAuth",
    component: () => import("@/views/noDataAuth.vue"),
  },
  {
    path: "/card1",
    name: "card1",
    component: () => import("@/views/card1.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

export default router;
