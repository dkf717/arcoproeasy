import Mock from 'mockjs';
import setupMock, {
  successResponseWrap,
  failResponseWrap,
} from '@/utils/setup-mock';

import { MockParams } from '@/types/mock';
import { isLogin } from '@/utils/auth';

setupMock({
  setup() {
    // Mock.XHR.prototype.withCredentials = true;

    // 用户信息
    Mock.mock(new RegExp('/api/user/info'), () => {
      if (isLogin()) {
        const role = window.localStorage.getItem('userRole') || 'admin';
        return successResponseWrap({
          name: '王立群',
          avatar:
            '//lf1-xgcdn-tos.pstatp.com/obj/vcloud/vadmin/start.8e0e4855ee346a46ccff8ff3e24db27b.png',
          email: 'wangliqun@email.com',
          job: 'frontend',
          jobName: '前端艺术家',
          organization: 'Frontend',
          organizationName: '前端',
          location: 'beijing',
          locationName: '北京',
          introduction: '人潇洒，性温存',
          personalWebsite: 'https://www.arco.design',
          phone: '150****0000',
          registrationDate: '2013-05-10 12:10:00',
          accountId: '15012312300',
          certification: 1,
          role,
        });
      }
      return failResponseWrap(null, '未登录', 50008);
    });

    // 登录
    Mock.mock(new RegExp('/api/user/login'), (params: MockParams) => {
      const { username, password } = JSON.parse(params.body);
      if (!username) {
        return failResponseWrap(null, '用户名不能为空', 50000);
      }
      if (!password) {
        return failResponseWrap(null, '密码不能为空', 50000);
      }
      if (username === 'admin' && password === 'admin') {
        window.localStorage.setItem('userRole', 'admin');
        return successResponseWrap({
          token: '12345',
        });
      }
      if (username === 'user' && password === 'user') {
        window.localStorage.setItem('userRole', 'user');
        return successResponseWrap({
          token: '54321',
        });
      }
      return failResponseWrap(null, '账号或者密码错误', 50000);
    });

    // 登出
    Mock.mock(new RegExp('/api/user/logout'), () => {
      return successResponseWrap(null);
    });

    // 用户的服务端菜单
    Mock.mock(new RegExp('/api/user/menu'), () => {
      const menuList = [
        {
          path: '/dashboard',
          name: 'dashboard',
          meta: {
            title: '仪表盘',
            requiresAuth: true,
            icon: 'icon-dashboard',
            order: 1,
          },
          children: [
            {
              path: 'workplace',
              name: 'Workplace',
              meta: {
                title: '工作台',
                requiresAuth: true,
              },
            },
            {
              path: 'https://arco.design',
              name: 'arcoWebsite',
              meta: {
                locale: 'menu.arcoWebsite',
                requiresAuth: true,
              },
            },
          ],
        },
      ];
      return successResponseWrap(menuList);
    });

    // 用户菜单
    Mock.mock(new RegExp('/api/user/getMenuss'), () => {
      const menuList = [
        {
          path: '/dashboard',
          name: 'dashboard',
          component: 'layout',
          meta: {
            title: '仪表盘',
            requiresAuth: true,
            icon: 'icon-dashboard',
            order: 1,
          },
        },
        {
          parentName: 'dashboard',
          path: 'workplace',
          name: 'Workplace',
          component: '@/views/dashboard/workplace/index.vue',
          meta: {
            title: '工作台',
            requiresAuth: true,
          },
        },
        {
          path: '/list',
          name: 'list',
          component: 'layout',
          meta: {
            title: '列表页',
            requiresAuth: true,
            icon: 'icon-list',
            order: 2,
          },
        },
        {
          parentName: 'list',
          path: 'search-table', // The midline path complies with SEO specifications
          name: 'SearchTable',
          component: '@/views/list/search-table/index.vue',
          meta: {
            title: '查询表格',
            requiresAuth: true,
          },
        },
        {
          parentName: 'list',
          path: 'card',
          name: 'Card',
          component: '@/views/list/card/index.vue',
          meta: {
            title: '卡片列表',
            requiresAuth: true,
          },
        },
        {
          parentName: 'list',
          path: 'routeTable', // The midline path complies with SEO specifications
          name: 'routeTable',
          component: '@/views/list/routeTable/index.vue',
          meta: {
            title: '路由列表',
            requiresAuth: true,
          },
        },
        {
          parentName: 'list',
          path: 'list/:id',
          name: '123456',
          component: '@/views/list/index.vue',
          meta: {
            title: '列表页',
            requiresAuth: true,
            params: {
              id: 123456,
            },
          },
        },
        {
          parentName: 'list',
          path: 'list/:id',
          name: '2222222',
          component: '@/views/list/index.vue',
          meta: {
            title: '列表页2',
            requiresAuth: true,
            params: {
              id: 2222222,
            },
          },
        },
      ];
      return successResponseWrap(menuList);
    });
  },
});
