import { failResponseWrap, successResponseWrap } from '@/utils/setup-mock';
import { getRandomId } from '@/utils/publicJs';
import { getDb, getDynamicDb } from '../tools';

export default {
  '/api/configuration/getDataById': async (pageId: string) => {
    try {
      // 获取通用配置
      const dynamicTableBaseDb = await getDb('dynamicTableBase');
      const {
        list: [baseConfig = {}],
      } = await dynamicTableBaseDb.getDataList({
        search: { dynamicPageId: pageId },
      });
      baseConfig.addBtnShow = !!baseConfig.addBtnShow;
      baseConfig.canView = !!baseConfig.canView;
      baseConfig.delBtnShow = !!baseConfig.delBtnShow;

      // 获取表列设置
      const dynamicTableColumnDb = await getDb('dynamicTableColumn');
      const { list: tableColumnList } = await dynamicTableColumnDb.getDataList({
        search: { dynamicPageId: pageId, /* canSet: true, */ isDel: false },
        orderBy: 'orderNo',
      });
      tableColumnList.forEach((v: any) => {
        v.tableShow = !!v.tableShow;
        v.searchShow = !!v.searchShow;
        v.isCustom = !!v.isCustom;
      });
      return successResponseWrap({
        baseConfig,
        tableColumnList,
      });
    } catch (err: any) {
      return failResponseWrap(err.message);
    }
  },
  '/api/configuration/saveData': async ({
    baseConfig = {},
    tableColumnList = [],
  }) => {
    try {
      const dynamicTableBaseDb = await getDb('dynamicTableBase');

      await dynamicTableBaseDb.addData(baseConfig);
      const dynamicTableColumnDb = await getDb('dynamicTableColumn');

      await dynamicTableColumnDb.addData(tableColumnList);
      return successResponseWrap({});
    } catch (err: any) {
      return failResponseWrap(err.message);
    }
  },

  '/api/router/dataList': async () => {
    try {
      const db = await getDb('router');
      const res = await db.getDataList();
      res.list = res.list.map((v: any) => {
        let params;
        try {
          params = JSON.parse(v.params);
        } catch (err) {
          params = '';
        }
        const obj = { ...v, params };
        return {
          ...obj,
          meta: obj,
        };
      });
      return successResponseWrap(res);
    } catch (err: any) {
      return failResponseWrap(err.message);
    }
  },
  '/api/page/addNew': async (data: any) => {
    try {
      // 暂不支持批量添加
      const { id, dynamicDbId } = data;
      // 获取数据库字段
      const dynamicdbFieldDb = await getDb('dbField');
      const { list: fieldList } = await dynamicdbFieldDb.getDataList({
        search: { dynamicDbId },
      });
      // 初始化页面通用设置
      const dynamicTableBaseDb = await getDb('dynamicTableBase');
      await dynamicTableBaseDb.addData({
        id: getRandomId(),
        dynamicPageId: id,
      });
      // 初始化页面列设置
      const dynamicTableColumnDb = await getDb('dynamicTableColumn');
      await dynamicTableColumnDb.addData(
        fieldList.map((v: any) => ({
          id: getRandomId(),
          dynamicPageId: id,
          field: v.field,
          title: v.title || v.field,
          tableShow: v.field !== 'id',
        }))
      );
      const dynamicPageDb = await getDb('page');
      await dynamicPageDb.addData(data);
      const res = await dynamicPageDb.getDataList({
        search: { id: [].concat(data).map((v: any) => v.id) },
      });
      return successResponseWrap(res);
    } catch (err: any) {
      return failResponseWrap(err.message);
    }
  },
};
