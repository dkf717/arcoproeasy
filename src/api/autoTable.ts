import axios from 'axios';

export function getAutoDataList(data: any) {
  return axios.post<any>('/api/auto/dataList', data);
}

export function addNewAuto(data: any) {
  return axios.post<any>('/api/auto/addNew', data);
}

// export function delTem(id: any) {
//   return axios.post<PolicyListRes>('/api/list/tem/del', id);
// }
