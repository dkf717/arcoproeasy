import axios from 'axios';

export function getAutoDataList(data: any) {
  return axios.post<any>('/api/auto/dataList', data);
}

export function addNewAuto(data: any) {
  return axios.post<any>('/api/auto/addNew', data);
}
// 删除
export function delAuto(data: any) {
  return axios.post<any>('/api/auto/del', data);
}
