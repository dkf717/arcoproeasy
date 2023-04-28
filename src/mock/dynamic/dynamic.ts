import { failResponseWrap, successResponseWrap } from '@/utils/setup-mock';
import { getDynamicDb } from '../tools';

export default {
  '/api/dynamic/dataList': async ({
    data,
    pageId,
  }: {
    data: any;
    pageId: string;
  }) => {
    try {
      const db = await getDynamicDb(pageId);
      const res = await db.getDataList(data);
      return successResponseWrap(res);
    } catch (err: any) {
      return failResponseWrap(err.message);
    }
  },
  '/api/dynamic/addNew': async ({
    data,
    pageId,
  }: {
    data: any;
    pageId: string;
  }) => {
    try {
      const db = await getDynamicDb(pageId);
      await db.addData(data);
      const res = await db.getDataList({
        search: { id: [].concat(data).map((v: any) => v.id) },
      });
      return successResponseWrap(res);
    } catch (err: any) {
      return failResponseWrap(err.message);
    }
  },
  '/api/dynamic/delById': async ({
    id,
    pageId,
  }: {
    id: string;
    pageId: string;
  }) => {
    try {
      const db = await getDynamicDb(pageId);
      await db.deleteData({ search: { id } });
      return successResponseWrap({});
    } catch (err: any) {
      return failResponseWrap(err.message);
    }
  },
  '/api/dynamic/update': async ({
    data,
    pageId,
  }: {
    data: any;
    pageId: string;
  }) => {
    try {
      const db = await getDynamicDb(pageId);
      await db.updateData(data);
      const res = await db.getDataList(data);
      return successResponseWrap(res);
    } catch (err: any) {
      return failResponseWrap(err.message);
    }
  },
};
