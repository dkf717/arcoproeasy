import axios from 'axios';

// export function getDataById(id: string) {
//   return axios.post<any>('/api/configuration/getDataById', id);
// }

// export function saveData(data: { baseConfig: any; tableColumnList: any[] }) {
//   return axios.post<any>('/api/configuration/saveData', data);
// }
// // 新增表列
export function addColumn(data: any) {
  return axios.post<any>('/api/tableColumn/add', data);
}
export function delColumn(id: any) {
  return axios.post<any>('/api/tableColumn/del', id);
}
