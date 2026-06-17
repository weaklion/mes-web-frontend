import { createMemoryHistory, createRouter } from "vue-router";
import Dashboard from "../components/Dashboard.vue";

const routes = [
  {
    path: "/",
    redirect: "/dashboard",
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: Dashboard,
  },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
