import axios from 'axios';
import qs from 'query-string';
import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';

export interface PolicyRecord {
  id?: string;
  number?: number;
  name?: string;
  contentType?: 'img' | 'horizontalVideo' | 'verticalVideo';
  filterType?: 'artificial' | 'rules';
  count?: number;
  status?: 'online' | 'offline';
  createdTime?: string;
  [x: string]: any;
}

export interface PolicyParams extends Partial<PolicyRecord> {
  current: number;
  pageSize: number;
}

export interface PolicyListRes {
  list: PolicyRecord[];
  total: number;
}

export function queryPolicyList(params: PolicyParams) {
  return axios.get<PolicyListRes>('/api/list/policy', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export interface ServiceRecord {
  id: number;
  title: string;
  description: string;
  name?: string;
  actionType?: string;
  icon?: string;
  data?: DescData[];
  enable?: boolean;
  expires?: boolean;
}
// export function queryInspectionList() {
//   return axios.get('/api/list/quality-inspection');
// }

// export function queryTheServiceList() {
//   return axios.get('/api/list/the-service');
// }

// export function queryRulesPresetList() {
//   return axios.get('/api/list/rules-preset');
// }

export function getFieldDataList(data: any) {
  return axios.post<PolicyListRes>('/api/field/dataList', data);
}

export function addNewField(data: any) {
  return axios.post<PolicyListRes>('/api/field/addNew', data);
}

// export function getTemDataList(data: any) {
//   return axios.post<PolicyListRes>('/api/list/tem/dataList', data);
// }

// export function addNewTem(data: any) {
//   return axios.post<PolicyListRes>('/api/list/tem/addNew', data);
// }

// export function delTem(id: any) {
//   return axios.post<PolicyListRes>('/api/list/tem/del', id);
// }
