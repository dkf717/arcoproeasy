import Mock from 'mockjs';
import setupMock, {
  successResponseWrap,
  failResponseWrap,
} from '@/utils/setup-mock';
import DbTable from '@/mock/classUtils';
import { temDb } from '@/mock/temTable';
import { fieldDb } from '@/mock/fieldTable';

// const temDb = new DbTable('temList', {
//   id: 'text primary key',
//   parentId: 'text',
//   title: 'text',
//   orderNo: 'text',
// });
const DbO: any = {};
const getDb = async (temId: string) => {
  const temPId = (
    (await temDb.getDataListOld({ search: { id: temId } })) as any[]
  )[0].parentId;
  const fieldList: any[] = (await fieldDb.getDataListOld({
    search: { temId: temPId },
  })) as any[];
  const config: any = {};
  fieldList.forEach((v) => {
    config[v.field] = v.dbSet || 'text';
  });

  const db = new DbTable(`table_${temPId}`, config);
  DbO[temId] = db;
  return db;
};
const mockData = {
  '/api/auto/dataList': async (data: any) => {
    try {
      const db = await getDb(data.temId);
      // const datalist = await db.getDataListOld({});
      const res = await db.getDataList(data);
      return successResponseWrap(res);
    } catch (err: any) {
      return failResponseWrap(err.message);
    }
  },
  '/api/auto/addNew': async (data: any) => {
    const db = await getDb(data.temId);
    // if (data.parentId && data.parentId !== '-1') {
    //   // 子级模板从父级模板复制字段信息
    //   const temList: any = await temDb.getDataListOld({ search: { id: data.id } });
    //   if (!temList.length) {
    //     const { fieldDb } = await import('@/mock/fieldTable');
    //     const fieldList: any = await fieldDb.getDataListOld({
    //       search: { temId: data.parentId },
    //     });
    //     fieldList.forEach((v: any) => {
    //       v.id += (new Date() as unknown as number) - 0;
    //       v.temId = data.id;
    //     });
    //     await fieldDb.addData(fieldList);
    //   }
    // }
    await db.addData(data.data);
    return successResponseWrap({});
  },
  // '/api/list/tem/del': async (id: any) => {
  //   try {
  //     await temDb.deleteData({ search: { id } });
  //     return successResponseWrap({});
  //   } catch (err: any) {
  //     return failResponseWrap(err.message);
  //   }
  // },
};
setupMock({
  setup() {
    Object.keys(mockData).forEach((v) => {
      Mock.mock(new RegExp(v), async () => ({}));
    });
  },
});
export default mockData;
