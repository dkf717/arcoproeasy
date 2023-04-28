import { failResponseWrap, successResponseWrap } from '@/utils/setup-mock';
import DbTable from './classUtils';
// 数据库对象
const DbO: any = {};
// 数据库配置对象
const DbConfigO: any = {
  init: {
    id: 'text primary key',
    dynamicDbId: 'text', // 数据库id--关联
    field: 'text', // 字段名
    title: 'text', // 字段标题
    dbSet: 'text default text', // 数据库设置
    canDel: 'boolean default true', // 能否删除
    canEdit: 'boolean default true', // 能否修改
  },
  dynamicTableBase: {
    id: 'text primary key',
    dynamicPageId: 'text', // 页面id--关联
    addBtnShow: 'boolean default true', // 新增按钮展示
    addBtnIcon: 'text', // 新增按钮图标
    addBtnText: 'text', // 新增按钮文字
    canView: 'boolean default true', // 能否查看
    viewBtnIcon: 'text', // 查看按钮图标
    viewBtnText: 'text', // 查看按钮文字
    delBtnShow: 'boolean default true', // 新增按钮展示
    delBtnIcon: 'text', // 新增按钮图标
    delBtnText: 'text', // 新增按钮文字
    getDataListApi: 'text', // 获取列表api
    addNewApi: 'text', // 新增数据api
  },
  dynamicTableColumn: {
    id: 'text primary key',
    dynamicPageId: 'text', // 页面id--关联
    field: 'text', // 字段名
    title: 'text', // 字段标题
    align: `text default 'left'`, // 对齐方式
    width: 'int default 0', // 宽度
    tableShow: 'boolean default false', // 列表中展示
    searchShow: 'boolean default false', // 搜索中展示
    canSet: 'boolean default false', // 能否配置
    isCustom: 'boolean default false', // 是否自定义
    isDel: 'boolean default false', // 是否删除
    orderNo: 'int default 5555', // 排序
  },
};
export const getDynamicdbFieldDb = async () => {
  const dynamicdbFieldDb = new DbTable();
  await dynamicdbFieldDb.createTable('dynamicdbField', DbConfigO.init);
  return dynamicdbFieldDb;
};
// 获取数据库操作对象
export const getDb = async (dbName: string) => {
  if (DbO[dbName]) return DbO[dbName];
  const db = new DbTable();
  if (DbConfigO[dbName]) {
    await db.createTable(dbName, DbConfigO[dbName]);
    DbO[dbName] = db;
    return db;
  }
  // 先进行检测
  const dynamicdbFieldDbExist = await db.checkExist('dynamicdbField');
  // 使用
  if (!dynamicdbFieldDbExist) {
    const dynamicdbFieldDb = new DbTable();
    await dynamicdbFieldDb.createTable('dynamicdbField', DbConfigO.init);
    DbO.dynamicdbField = dynamicdbFieldDb;
    // eslint-disable-next-line import/no-cycle
    const { initDb } = await import('./initDb');
    await initDb();
    if (DbO[dbName]) return DbO[dbName];
  }
  const dbFieldDb = await getDynamicdbFieldDb();
  const { list: fieldList }: { list: any[] } = await dbFieldDb.getDataList({
    search: { dynamicDbId: dbName },
  });
  const config: any = {};
  fieldList.forEach((v) => {
    config[v.field] = v.dbSet;
  });
  await db.createTable(`dynamic${dbName}`, config);
  DbO[dbName] = db;
  return db;
};

// 获取动态数据库操作对象
export const getDynamicDb = async (pageId: string) => {
  if (DbO[pageId]) return DbO[pageId];
  const dynamicPageDb = await getDb(`page`);
  const {
    list: [{ dynamicDbId }],
  }: any = await dynamicPageDb.getDataList({ search: { id: pageId } });
  const db = await getDb(dynamicDbId);
  DbO[pageId] = db;
  return db;
};
// 初始化接口拦截
export const initMockData = (dbName: string) => ({
  // 获取列表
  [`/api/${dbName}/dataList`]: async (data: any) => {
    try {
      const db = await getDb(dbName);
      const res = await db.getDataList(data);
      return successResponseWrap(res);
    } catch (err: any) {
      return failResponseWrap(err.message);
    }
  },
  // 新增并返回新增后的数据
  [`/api/${dbName}/addNew`]: async (data: any) => {
    try {
      const db = await getDb(dbName);
      await db.addData(data);
      const res = await db.getDataList({
        search: { id: [].concat(data).map((v: any) => v.id) },
      });
      return successResponseWrap(res);
    } catch (err: any) {
      return failResponseWrap(err.message);
    }
  },
  // 通过Id删除
  [`/api/${dbName}/delById`]: async (id: any) => {
    try {
      const db = await getDb(dbName);
      await db.deleteData({ search: { id } });
      return successResponseWrap({});
    } catch (err: any) {
      return failResponseWrap(err.message);
    }
  },
  // 更新并返回更新后数据
  [`/api/${dbName}/update`]: async (data: any) => {
    try {
      const db = await getDb(dbName);
      await db.updateData(data);
      const res = await db.getDataList(data);
      return successResponseWrap(res);
    } catch (err: any) {
      return failResponseWrap(err.message);
    }
  },
});
