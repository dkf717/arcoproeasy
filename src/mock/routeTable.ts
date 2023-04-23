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
  params: 'text',
  orderNo: 'text',
});

const mockData = {
  '/api/list/route/dataList': async () => {
    const datalist = await routeDb.getDataListOld({
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
    const datalist: any = await routeDb.getDataListOld({
      orderBy: 'parentName,orderNo',
    });
    return successResponseWrap(
      datalist.map((v: any) => ({
        ...v,
        meta: { ...v, params: v.params ? JSON.parse(v.params) : '' },
      }))
    );
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
