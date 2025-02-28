import { createRouter, createWebHistory } from "vue-router";

import type { RouteRecordRaw } from "vue-router";

export function newRouter() {
  const routes: ReadonlyArray<RouteRecordRaw> = [
    {
      path: "/player",
      component: () => import("@/pages/Player.vue"),
      meta: { noPadding: true },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("../pages/NotFound.vue"),
      // meta: { fullScreen: true },
    },
    // {
    //   path: "/",
    //   component: () => import("../layout/layout.vue"),
    //   children: [
    //     {
    //       path: "/",
    //       component: () => import("../pages/Player.vue"),
    //       meta: { noPadding: true },
    //     },
    //     {
    //       name: "Forbidden",
    //       path: "/dashboard/forbidden",
    //       component: () => import("../pages/NoAccess.vue"),
    //       meta: { fullScreen: true },
    //     },
    //     {
    //       path: "/:pathMatch(.*)*",
    //       name: "NotFound",
    //       component: () => import("../pages/NotFound.vue"),
    //       meta: { fullScreen: true },
    //     },
    //   ],
    // },
  ];

  const router = createRouter({
    history: createWebHistory(),
    routes,
  });
  return router;
}
