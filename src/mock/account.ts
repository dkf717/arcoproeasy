import Mock from 'mockjs';
import setupMock, {
  successResponseWrap,
  failResponseWrap,
} from '@/utils/setup-mock';
import DbTable from '@/mock/classUtils';

export const accountDb = new DbTable('account', {
  id: 'text primary key',
  account: 'text', // 模板id
  password: 'text', // 字段名
  //   title: 'text', // 字段标题
  //   fieldType: 'text', // 字段类型
  //   required: 'booble default false', // 必填
  //   readonly: 'booble default false', // 只读
  //   disabled: 'booble default false', // 禁用
  //   placeholder: 'text', // 提示文字
  //   orderNo: 'text default 5555', // 排序
  //   // 选择器
  //   options: 'text', // 选项JSON
});

const mockData = {
  '/api/account/dataList': async (data: any) => {
    try {
      const res = await accountDb.getDataList(data);
      return successResponseWrap(res);
    } catch (err: any) {
      return failResponseWrap(err.message);
    }
  },
  '/api/account/addNew': async (data: any) => {
    await accountDb.addData(data);
    return successResponseWrap({});
  },
  // '/api/list/field/del': async (id: any) => {
  //   try {
  //     await fieldDb.deleteData({ search: { id } });
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
