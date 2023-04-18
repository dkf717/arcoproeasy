import Mock from 'mockjs';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';
import DbTable from '@/mock/classUtils';

const routeDb = new DbTable('routeList', {
  id: 'text primary key',
  parentName: 'text',
  path: 'text',
  name: 'text',
  component: 'text default layout',
  title: 'text',
  icon: 'text',
  orderNo: 'text',
});

const mockData = {
  '/api/list/route/dataList': async () => {
    const datalist = await routeDb.getDataList({
      orderBy: 'parentName,orderNo',
    });
    return successResponseWrap({
      list: datalist,
    });
  },
  '/api/list/route/addNew': async (data: any) => {
    await routeDb.addData(data);
    return successResponseWrap({});
  },
  '/api/user/getMenu': async () => {
    const datalist: any = await routeDb.getDataList({
      orderBy: 'parentName,orderNo',
    });
    return successResponseWrap(datalist.map((v: any) => ({ ...v, meta: v })));
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
