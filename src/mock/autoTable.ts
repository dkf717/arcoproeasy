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
  '/api/auto/dataList': async ({
    data,
    temId,
  }: {
    data: any;
    temId: string;
  }) => {
    try {
      const db = await getDb(temId);
      const res = await db.getDataList(data);
      return successResponseWrap(res);
    } catch (err: any) {
      return failResponseWrap(err.message);
    }
  },
  '/api/auto/addNew': async ({ data, temId }: { data: any; temId: string }) => {
    const db = await getDb(temId);
    await db.addData(data);
    return successResponseWrap({});
  },
  '/api/auto/del': async ({ id, temId }: { id: string; temId: string }) => {
    try {
      const db = await getDb(temId);
      await db.deleteData({ search: { id } });
      return successResponseWrap({});
    } catch (err: any) {
      return failResponseWrap(err.message);
    }
  },
};
setupMock({
  setup() {
    Object.keys(mockData).forEach((v) => {
      Mock.mock(new RegExp(v), async () => ({}));
    });
  },
});
export default mockData;
