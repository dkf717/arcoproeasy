import Mock from 'mockjs';

import './user';
import './message-box';
import './search-table';
import './card';
import routeTable from './routeTable';

import '@/views/dashboard/workplace/mock';

Mock.setup({
  timeout: '600-1000',
});
const mockData: any = { ...routeTable };
export const getAxiosResponse: any = async (response: any) => {
  return mockData[response.config.url](
    response.config.data && JSON.parse(response.config.data)
  );
};
export const aaa = 1;
