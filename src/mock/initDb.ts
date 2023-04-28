import { getRandomId } from '@/utils/publicJs';
import dynamic from './dynamic';

const mockData: any = { ...dynamic };
export const a = 1;
export const initDb = async () => {
  try {
    // eslint-disable-next-line import/no-cycle
    const { getDb, getDynamicDb } = await import('./tools');
    const dynamicdbFieldDb = await getDb('dynamicdbField');
    const { total } = await dynamicdbFieldDb.getDataList({
      search: { dynamicDbId: 'db' },
    });
    if (total) return; // 如果查询有值证明已完成过初始化
    const dbFieldAddData = [
      // dynamicdbField初始构成
      {
        id: getRandomId(),
        dynamicDbId: 'dbField',
        field: 'id',
        dbSet: 'text primary key',
        canDel: 'false',
        canEdit: 'false',
      },
      {
        id: getRandomId(),
        dynamicDbId: 'dbField',
        field: 'dynamicDbId',
        dbSet: 'text',
        canDel: 'false',
        canEdit: 'false',
      },
      {
        id: getRandomId(),
        dynamicDbId: 'dbField',
        field: 'field',
        dbSet: 'text',
        canDel: 'false',
        canEdit: 'false',
      },
      {
        id: getRandomId(),
        dynamicDbId: 'dbField',
        field: 'title',
        dbSet: 'text',
        canDel: 'false',
        canEdit: 'false',
      },
      {
        id: getRandomId(),
        dynamicDbId: 'dbField',
        field: 'dbSet',
        dbSet: 'text default text',
        canDel: 'false',
        canEdit: 'false',
      },
      {
        id: getRandomId(),
        dynamicDbId: 'dbField',
        field: 'canDel',
        dbSet: 'boolean default true',
        canDel: 'false',
        canEdit: 'false',
      },
      {
        id: getRandomId(),
        dynamicDbId: 'dbField',
        field: 'canEdit',
        dbSet: 'boolean default true',
        canDel: 'false',
        canEdit: 'false',
      },
      // dynamicdb初始构成
      {
        id: getRandomId(),
        dynamicDbId: 'db',
        field: 'id',
        dbSet: 'text primary key',
        canDel: 'false',
        canEdit: 'false',
      },
      {
        id: getRandomId(),
        dynamicDbId: 'db',
        field: 'name',
        dbSet: 'text',
        canDel: 'false',
        canEdit: 'false',
      },
      // dynamicpage初始构成
      {
        id: getRandomId(),
        dynamicDbId: 'page',
        field: 'id',
        dbSet: 'text primary key',
        canDel: 'false',
        canEdit: 'false',
      },
      {
        id: getRandomId(),
        dynamicDbId: 'page',
        field: 'dynamicDbId',
        dbSet: 'text',
        canDel: 'false',
        canEdit: 'false',
      },
      {
        id: getRandomId(),
        dynamicDbId: 'page',
        field: 'name',
        dbSet: 'text',
        canDel: 'false',
        canEdit: 'false',
      },
      // dynamicrouter初始构成
      {
        id: getRandomId(),
        dynamicDbId: 'router',
        field: 'id',
        dbSet: 'text primary key',
        canDel: 'false',
        canEdit: 'false',
      },
      {
        id: getRandomId(),
        dynamicDbId: 'router',
        field: 'parentName',
        dbSet: 'text',
        canDel: 'false',
        canEdit: 'false',
      },
      {
        id: getRandomId(),
        dynamicDbId: 'router',
        field: 'path',
        dbSet: 'text',
        canDel: 'false',
        canEdit: 'false',
      },
      {
        id: getRandomId(),
        dynamicDbId: 'router',
        field: 'name',
        dbSet: 'text',
        canDel: 'false',
        canEdit: 'false',
      },
      {
        id: getRandomId(),
        dynamicDbId: 'router',
        field: 'component',
        dbSet: 'text',
        canDel: 'false',
        canEdit: 'false',
      },
      {
        id: getRandomId(),
        dynamicDbId: 'router',
        field: 'title',
        dbSet: 'text',
        canDel: 'false',
        canEdit: 'false',
      },
      {
        id: getRandomId(),
        dynamicDbId: 'router',
        field: 'icon',
        dbSet: 'text',
        canDel: 'false',
        canEdit: 'false',
      },
      {
        id: getRandomId(),
        dynamicDbId: 'router',
        field: 'params',
        dbSet: 'text',
        canDel: 'false',
        canEdit: 'false',
      },
      {
        id: getRandomId(),
        dynamicDbId: 'router',
        field: 'orderNo',
        dbSet: 'int default 5555',
        canDel: 'false',
        canEdit: 'false',
      },
    ];
    await dynamicdbFieldDb.addData(dbFieldAddData);
    const dbAddData = [
      {
        id: 'dbField',
        name: '库字段',
      },
      {
        id: 'db',
        name: '库结构',
      },
      {
        id: 'page',
        name: '页面',
      },
      {
        id: 'router',
        name: '路由',
      },
    ];
    const dynamicdbDb = await getDb('db');
    await dynamicdbDb.addData(dbAddData);
    // 初始化dynamicpageDb数据
    const dbFieldPageId = getRandomId();
    const dbPageId = getRandomId();
    const pagePageId = getRandomId();
    const routerPageId = getRandomId();
    // 生成页面配置
    await mockData[`/api/page/addNew`]({
      id: dbFieldPageId,
      dynamicDbId: 'dbField',
      name: '字段列表',
    });
    await mockData[`/api/page/addNew`]({
      id: dbPageId,
      dynamicDbId: 'db',
      name: '库列表',
    });
    await mockData[`/api/page/addNew`]({
      id: pagePageId,
      dynamicDbId: 'page',
      name: '页面列表',
    });
    await mockData[`/api/page/addNew`]({
      id: routerPageId,
      dynamicDbId: 'router',
      name: '路由列表',
    });
    const routerAddData = [
      {
        id: getRandomId(),
        parentName: '',
        path: '/temporary',
        name: 'temporary',
        component: 'layout',
        title: '临时目录',
        icon: 'icon-close',
        orderNo: 1000,
        params: '',
      },
      {
        id: getRandomId(),
        parentName: 'temporary',
        path: '/dynamic/:pageId',
        name: 'dbField',
        component: '@/views/configuration/list/index.vue',
        title: '字段列表',
        icon: '',
        orderNo: 1000,
        params: `{"pageId":"${dbFieldPageId}"}`,
      },
      {
        id: getRandomId(),
        parentName: 'temporary',
        path: '/dynamic/:pageId',
        name: 'db',
        component: '@/views/configuration/list/index.vue',
        title: '库列表',
        icon: '',
        orderNo: 1000,
        params: `{"pageId":"${dbPageId}"}`,
      },
      {
        id: getRandomId(),
        parentName: 'temporary',
        path: '/dynamic/:pageId',
        name: 'page',
        component: '@/views/configuration/list/index.vue',
        title: '页面列表',
        icon: '',
        orderNo: 1000,
        params: `{"pageId":"${pagePageId}"}`,
      },
      {
        id: getRandomId(),
        parentName: 'temporary',
        path: '/dynamic/:pageId',
        name: 'router',
        component: '@/views/configuration/list/index.vue',
        title: '路由列表',
        icon: '',
        orderNo: 1000,
        params: `{"pageId":"${routerPageId}"}`,
      },
    ];
    const dynamicrouterDb = await getDb('router');
    await dynamicrouterDb.addData(routerAddData);
    const dynamicTableBaseDb = await getDb('dynamicTableBase');
    await dynamicTableBaseDb.updateData({
      data: { addNewApi: '/api/page/addNew' },
      search: { dynamicPageId: pagePageId },
    });
  } catch (err) {
    /* empty */
  }
};
