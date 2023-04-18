import type { Router } from 'vue-router';
import NProgress from 'nprogress'; // progress bar

import { useUserStore } from '@/store';
import { WHITE_LIST } from '../constants';
import { DEFAULT_LAYOUT, NOT_FOUND_ROUTE } from '../routes/base';

const modules = import.meta.glob('@/views/**/*.vue');
const modulesKeys = Object.keys(modules);
export default function setupPermissionGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore();
    if (WHITE_LIST.some((v) => v.name === to.name)) {
      // 白名单中直接放行
      next();
    } else if (!userStore.menuList.length) {
      // 用户菜单为空去先进行加载
      await userStore.getUserMenu();
      userStore.menuList.forEach((v) => {
        if (v.component === 'layout') {
          v.component = DEFAULT_LAYOUT;
        } else if (v.component.includes('@/')) {
          let filePath = v.component.replace('@/', '');
          filePath = modulesKeys.find((modulesKey: string) =>
            modulesKey.includes(filePath)
          );
          v.component = modules[filePath];
        }
        if (!v.parentName) {
          router.addRoute(v);
        } else {
          router.addRoute(v.parentName, v);
        }
      });
      router.addRoute(NOT_FOUND_ROUTE);
      next(to.fullPath);
    } else {
      next();
    }

    // if (
    //   !userStore.menuList.length &&
    //   !WHITE_LIST.some((v) => v.name === to.name)
    // ) {
    //   await appStore.fetchServerMenuConfig();
    // }
    // if (appStore.menuFromServer) {
    //   // 针对来自服务端的菜单配置进行处理
    //   // Handle routing configuration from the server

    //   // 根据需要自行完善来源于服务端的菜单配置的permission逻辑
    //   // Refine the permission logic from the server's menu configuration as needed
    //   if (
    //     !appStore.appAsyncMenus.length &&
    //     !WHITE_LIST.find((el) => el.name === to.name)
    //   ) {
    //     await appStore.fetchServerMenuConfig();
    //   }
    //   const serverMenuConfig = [...appStore.appAsyncMenus, ...WHITE_LIST];

    //   let exist = false;
    //   while (serverMenuConfig.length && !exist) {
    //     const element = serverMenuConfig.shift();
    //     if (element?.name === to.name) exist = true;

    //     if (element?.children) {
    //       serverMenuConfig.push(
    //         ...(element.children as unknown as RouteRecordNormalized[])
    //       );
    //     }
    //   }
    //   if (exist && permissionsAllow) {
    //     next();
    //   } else next(NOT_FOUND);
    // } else if (!router.hasRoute(to.name as string)) {
    //   router.addRoute('dashboard', {
    //     path: 'list',
    //     name: 'list',
    //     component: () => import('@/views/list/index.vue'),
    //     meta: {
    //       locale: 'menu.dashboard.workplace',
    //       requiresAuth: true,
    //       roles: ['*'],
    //     },
    //   });
    //   next(to.fullPath);
    // } else {
    //   // eslint-disable-next-line no-lonely-if
    //   if (permissionsAllow) next();
    //   else {
    //     const destination =
    //       Permission.findFirstPermissionRoute(appRoutes, userStore.role) ||
    //       NOT_FOUND;
    //     next(destination);
    //   }
    // }
    NProgress.done();
  });
}
