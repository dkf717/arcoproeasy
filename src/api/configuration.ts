import axios from 'axios';

export function getConfigurationById(pageId: string) {
  return axios.post<any>('/api/configuration/getDataById', pageId);
}

export function saveConfigurationData(data: {
  baseConfig: any;
  tableColumnList: any[];
}) {
  return axios.post<any>('/api/configuration/saveData', data);
}
// 新增表列
// export function addColumn(data:any) {
//   return axios.post<any>('/api/tableColumn/addColumn', data);
// }
// export function delTem(id: any) {
//   return axios.post<PolicyListRes>('/api/list/tem/del', id);
// }
