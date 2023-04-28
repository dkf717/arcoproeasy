import Mock from 'mockjs';

import './user';
import './message-box';
import './search-table';
import './card';
import '@/views/dashboard/workplace/mock';
// import '@/mock/initDb';
import dynamic from './dynamic';
import routeTable from './routeTable';
import temTable from './temTable';
import fieldTable from './fieldTable';
import autoTable from './autoTable';
import account from './account';

Mock.setup({
  timeout: '600-1000',
});
const mockData: any = {
  ...dynamic,
  ...routeTable,
  ...temTable,
  ...fieldTable,
  ...autoTable,
  ...account,
};
export const getAxiosResponse: any = async (response: any) => {
  let { data } = response.config;
  try {
    data = JSON.parse(response.config.data);
  } catch (err) {
    /* empty */
  }
  return mockData[response.config.url](data);
};
export const aaa = 1;
