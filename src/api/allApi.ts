import axios from 'axios';
// 获取路由列表
export function getRouterDataList(data?: any) {
  return axios.post<any>('/api/router/dataList', data);
}
// 获取路由树
export function getRouterDataTree(data: any) {
  return axios.post<any>('/api/router/dataTree', data);
}
