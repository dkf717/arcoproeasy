import Mock from 'mockjs';
import setupMock, {
  successResponseWrap,
  failResponseWrap,
} from '@/utils/setup-mock';
import DbTable from '@/mock/classUtils';

export const temDb = new DbTable('temList', {
  id: 'text primary key',
  parentId: 'text',
  title: 'text',
  orderNo: 'text',
});

const mockData = {
  '/api/list/tem/dataList': async () => {
    try {
      const datalist = await temDb.getDataListOld({
        orderBy: 'parentId,orderNo',
      });
      return successResponseWrap({
        list: datalist,
      });
    } catch (err: any) {
      return failResponseWrap(err.message);
    }
  },
  '/api/list/tem/addNew': async (data: any) => {
    if (data.parentId && data.parentId !== '-1') {
      // 子级模板从父级模板复制字段信息
      const temList: any = await temDb.getDataListOld({
        search: { id: data.id },
      });
      if (!temList.length) {
        const { fieldDb } = await import('@/mock/fieldTable');
        const fieldList: any = await fieldDb.getDataListOld({
          search: { temId: data.parentId },
        });
        fieldList.forEach((v: any) => {
          v.id += (new Date() as unknown as number) - 0;
          v.temId = data.id;
        });
        await fieldDb.addData(fieldList);
      }
    }
    await temDb.addData(data);
    return successResponseWrap({});
  },
  '/api/list/tem/del': async (id: any) => {
    try {
      await temDb.deleteData({ search: { id } });
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
