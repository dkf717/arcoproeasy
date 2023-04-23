import Mock from 'mockjs';

import './user';
import './message-box';
import './search-table';
import './card';
import '@/views/dashboard/workplace/mock';
import routeTable from './routeTable';
import temTable from './temTable';
import fieldTable from './fieldTable';
import autoTable from './autoTable';

Mock.setup({
  timeout: '600-1000',
});
const mockData: any = {
  ...routeTable,
  ...temTable,
  ...fieldTable,
  ...autoTable,
};
export const getAxiosResponse: any = async (response: any) => {
  return mockData[response.config.url](
    response.config.data && JSON.parse(response.config.data)
  );
};
export const aaa = 1;
