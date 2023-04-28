import axios from 'axios';
// 列表
export function getDynamicDataList(data: { data: any; pageId: string }) {
  return axios.post<any>('/api/dynamic/dataList', data);
}
// 新增
export function addNewDynamic(data: { data: any; pageId: string }) {
  return axios.post<any>('/api/dynamic/addNew', data);
}
// 删除
export function delDynamicById(data: { id: string; pageId: string }) {
  return axios.post<any>('/api/dynamic/delById', data);
}
// 更新
export function updateDynamic(data: { data: any; pageId: string }) {
  return axios.post<any>('/api/dynamic/update', data);
}
