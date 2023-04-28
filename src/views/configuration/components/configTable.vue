<template>
  <div class="container">
    <Breadcrumb :items="['**', '**']" />
    <a-card class="general-card">
      <template #extra>
        <slot name="cardExtra"></slot>
      </template>
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button
              v-if="baseConfig?.addBtnShow"
              :class="{
                'arco-btn-only-icon':
                  baseConfig?.addBtnIcon && !baseConfig?.addBtnText,
              }"
              type="primary"
              @click="addNew"
            >
              <template
                v-if="baseConfig?.addBtnIcon || !baseConfig?.addBtnText"
                #icon
              >
                <component
                  :is="baseConfig?.addBtnIcon || 'icon-plus'"
                ></component>
              </template>
              <template
                v-if="baseConfig?.addBtnText || !baseConfig?.addBtnIcon"
              >
                {{ baseConfig?.addBtnText || '新增' }}
              </template>
            </a-button>
          </a-space>
        </a-col>
        <a-col
          :span="12"
          style="display: flex; align-items: center; justify-content: end"
        >
          <a-tooltip :content="'刷新'">
            <div class="action-icon" @click="search"
              ><icon-refresh size="18"
            /></div>
          </a-tooltip>
          <a-tooltip :content="'列设置'">
            <a-popover
              trigger="click"
              position="bl"
              @popup-visible-change="popupVisibleChange"
            >
              <div class="action-icon"><icon-settings size="18" /></div>
              <template #content>
                <div id="tableSetting">
                  <div
                    v-for="(item, index) in showColumns"
                    :key="item.dataIndex"
                    class="setting"
                  >
                    <div style="margin-right: 4px; cursor: move">
                      <icon-drag-arrow />
                    </div>
                    <div>
                      <a-checkbox
                        v-model="item.checked"
                        @change="
                          handleChange($event, item as TableColumnData, index)
                        "
                      >
                      </a-checkbox>
                    </div>
                    <div class="title">
                      {{ item.title === '#' ? '序列号' : item.title }}
                    </div>
                  </div>
                </div>
              </template>
            </a-popover>
          </a-tooltip>
        </a-col>
      </a-row>
      <a-table
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        :columns="(cloneColumns as TableColumnData[])"
        :data="renderData"
        :bordered="{ cell: true }"
        :size="size"
        @page-change="pageChange"
        @page-size-change="pageSizeChange"
        @row-click="rowClick"
      >
        <template #tr>
          <tr
            :style="{
              cursor:
                baseConfig?.canView &&
                !baseConfig?.viewBtnIcon &&
                !baseConfig?.viewBtnText
                  ? 'pointer'
                  : '',
            }"
          />
        </template>
        <template #columns>
          <a-table-column
            v-for="column in cloneColumns"
            :key="column.field"
            :title="column.title"
            :data-index="column.field"
            :align="column.align"
            :width="column.width"
          >
            <template #cell="{ record }">
              <renderCom :cell-data="record" :column="column"></renderCom>
            </template>
          </a-table-column>
          <a-table-column title="操作" data-index="operations">
            <template #cell="{ record }">
              <a-space>
                <a-link
                  v-if="
                    baseConfig?.canView &&
                    (baseConfig?.viewBtnIcon || baseConfig?.viewBtnText)
                  "
                  :hoverable="false"
                  :icon="baseConfig.viewBtnIcon"
                  @click.stop="viewRow(record)"
                >
                  <template v-if="baseConfig?.viewBtnIcon" #icon>
                    <component
                      :is="baseConfig?.viewBtnIcon"
                      :title="baseConfig?.viewBtnText || '查看'"
                      style="font-size: 16px"
                    ></component>
                  </template>
                  <template v-if="baseConfig?.viewBtnText">{{
                    baseConfig.viewBtnText
                  }}</template>
                </a-link>
                <a-link
                  v-if="baseConfig?.delBtnShow"
                  status="danger"
                  :hoverable="false"
                  :icon="
                    !!(
                      (baseConfig?.delBtnShow &&
                        !baseConfig?.delBtnIcon &&
                        !baseConfig?.delBtnText) ||
                      baseConfig?.delBtnIcon
                    )
                  "
                  @click.stop="delRow(record)"
                >
                  <template
                    v-if="
                      !!(
                        (baseConfig?.delBtnShow &&
                          !baseConfig?.delBtnIcon &&
                          !baseConfig?.delBtnText) ||
                        baseConfig?.delBtnIcon
                      )
                    "
                    #icon
                  >
                    <component
                      :is="
                        baseConfig?.delBtnIcon
                          ? baseConfig?.delBtnIcon
                          : baseConfig?.delBtnShow && !baseConfig?.delBtnText
                          ? 'icon-delete'
                          : ''
                      "
                      :title="baseConfig?.delBtnText || '删除'"
                      style="font-size: 16px"
                    ></component>
                  </template>
                  <template v-if="baseConfig?.delBtnText">{{
                    baseConfig.delBtnText
                  }}</template>
                </a-link>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
    <a-modal
      v-model:visible="formVisible"
      width="auto"
      draggable
      @ok="handleOk"
    >
      <template #title> Title </template>
      <a-form auto-label-width :model="form">
        <!-- <template > -->
        <a-form-item
          v-for="(column, index) in formColumns"
          :key="index"
          :field="column.field"
          :label="column.title"
        >
          <a-input
            :model-value="form[column.field]"
            @update:model-value="form[column.field] = $event"
          />
        </a-form-item>
        <!-- </template> -->
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  // import引入部分
  import { ref, reactive, watch, nextTick, toRef, toRefs, computed } from 'vue';

  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import renderCom from '@/components/renderCom.vue';
  import { useRoute } from 'vue-router';
  import { getFieldDataList } from '@/api/fieldTable';
  import { getAutoDataList, addNewAuto, delAuto } from '@/api/autoTable';
  import { Notification, Modal } from '@arco-design/web-vue';

  // import type引入部分
  import type {
    TableColumnData,
    TableData,
  } from '@arco-design/web-vue/es/table/interface';

  // ref组件标记部分

  // hook引入部分
  import useLoading from '@/hooks/loading';
  import axios from 'axios';
  import {
    addNewDynamic,
    delDynamicById,
    getDynamicDataList,
  } from '@/api/dynamic';

  const { loading, setLoading } = useLoading(true);
  const route = useRoute();
  const { params } = route;
  const { pageId } = params as { pageId: string };

  // type定义部分
  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };
  const props = defineProps({
    configuration: {
      type: Object,
    },
  });
  const baseConfig = computed(() => props?.configuration?.baseConfig);
  const tableColumnList = computed(() => props?.configuration?.tableColumnList);
  // booble绑定部分
  const formVisible = ref<boolean>(false);
  // 数字绑定部分
  // 字符串绑定部分
  const size = ref<SizeProps>('medium');
  // 数组绑定部分
  const renderData = ref<any[]>([]);
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);
  // Map绑定部分
  // 需重置对象生成函数部分
  const generatePagination = () => ({
    current: 1,
    pageSize: 10,
    total: 0,
    showPageSize: true,
    showJumper: true,
    showTotal: true,
  });
  // 需重制对象绑定部分
  const pagination = reactive(generatePagination());
  // 无需重制对象绑定部分
  // computed部分
  // watch部分
  // 方法声明部分

  const form = reactive<any>({});
  const columns = ref<any[]>([]);
  const formColumns = ref<any[]>([]);
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await getAutoDataList({
        pageId,
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
      });
      renderData.value = data.list;
      pagination.total = data.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const search = () => {
    fetchData();
  };

  const handleChange = (
    checked: boolean | (string | boolean | number)[],
    column: Column,
    index: number
  ) => {
    if (!checked) {
      cloneColumns.value = showColumns.value.filter(
        (item) => item.dataIndex !== column.dataIndex
      );
    } else {
      cloneColumns.value.splice(index, 0, column);
    }
  };

  const exchangeArray = <T extends Array<any>>(
    array: T,
    beforeIdx: number,
    newIdx: number,
    isDeep = false
  ): T => {
    const newArray = isDeep ? cloneDeep(array) : array;
    if (beforeIdx > -1 && newIdx > -1) {
      // 先替换后面的，然后拿到替换的结果替换前面的
      newArray.splice(
        beforeIdx,
        1,
        newArray.splice(newIdx, 1, newArray[beforeIdx]).pop()
      );
    }
    return newArray;
  };

  const popupVisibleChange = (val: boolean) => {
    if (val) {
      nextTick(() => {
        const el = document.getElementById('tableSetting') as HTMLElement;
        return new Sortable(el, {
          onEnd(e: any) {
            const { oldIndex, newIndex } = e;
            exchangeArray(cloneColumns.value, oldIndex, newIndex);
            exchangeArray(showColumns.value, oldIndex, newIndex);
          },
        });
      });
    }
  };
  // 新增
  const addNew = () => {
    form.id = `${(new Date() as unknown as number) - 0}`;
    formVisible.value = true;
  };
  // 确定
  const handleOk = () => {
    https.addNew(form).then(() => {
      getDataList();
    });
  };
  const https: any = {};
  const getDataList = async () => {
    setLoading(true);
    try {
      const { data } = await https.getDataList({
        pageId,
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
      });
      renderData.value = data.list;
      pagination.total = data.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  watch(
    () => columns.value,
    (val) => {
      cloneColumns.value = cloneDeep(val);
      cloneColumns.value.forEach((item) => {
        item.checked = true;
      });
      showColumns.value = cloneDeep(cloneColumns.value);
    },
    { deep: true, immediate: true }
  );
  watch(
    () => baseConfig.value,
    (val) => {
      if (val) {
        if (val.getDataListApi) {
          https.getDataList = (data: any) =>
            axios.post<any>(val.getDataListApi, data);
        } else {
          https.getDataList = (data: any) =>
            getDynamicDataList({ data, pageId });
        }
        if (val.addNewApi) {
          https.addNew = (data: any) => axios.post<any>(val.addNewApi, data);
        } else {
          https.addNew = (data: any) => addNewDynamic({ data, pageId });
        }
        if (val.delApi) {
          https.delById = (id: string) => axios.post<any>(val.delApi, id);
        } else {
          https.delById = (id: string) => delDynamicById({ id, pageId });
        }
        getDataList();
      }
    },
    { deep: true, immediate: true }
  );
  watch(
    () => tableColumnList.value,
    (val) => {
      if (val) {
        columns.value = JSON.parse(JSON.stringify(val)).filter(
          (v: any) => v.tableShow
        );
        formColumns.value = JSON.parse(JSON.stringify(val)).filter(
          (v: any) => !v.isCustom
        );
      }
    },
    { deep: true, immediate: true }
  );
  // const getTableColumns = async () => {
  //   try {
  //     const res = await getFieldDataList({ search: { temId } });
  //     columns.value = res.data.list.map((v) => ({ ...v, dataIndex: v.field }));
  //   } catch (err) {
  //     Notification.error(err as string);
  //   }
  // };
  const pageChange = (current: number) => {
    if (pagination.current !== current) {
      pagination.current = current;
      fetchData();
    }
  };
  const pageSizeChange = (pageSize: number) => {
    pagination.pageSize = pageSize;
    if (pagination.current === 1) {
      fetchData();
    }
  };
  // 行点击
  const rowClick = (record: TableData) => {
    if (
      baseConfig.value?.canView &&
      !baseConfig.value?.viewBtnIcon &&
      !baseConfig.value?.viewBtnText
    ) {
      viewRow(record);
    }
  };
  // 查看行
  const viewRow = (record: TableData) => {
    // form.id = `${(new Date() as unknown as number) - 0}`;
    Object.assign(form, record);
    formVisible.value = true;
  };
  // 删除行
  const delRow = (record: TableData) => {
    Modal.info({
      content: '确定删除吗？',
      onOk: () => {
        https.delById(record.id).then((res: any) => {
          getDataList();
        });
      },
    });
  };
  // 方法执行部分
  // fetchData();
  // getTableColumns();
</script>

<script lang="ts">
  export default {
    name: 'SearchTable',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }
  :deep(.arco-table-th) {
    &:last-child {
      .arco-table-th-item-title {
        margin-left: 16px;
      }
    }
  }
  .action-icon {
    margin-left: 12px;
    cursor: pointer;
  }
  .active {
    color: #0960bd;
    background-color: #e3f4fc;
  }
  .setting {
    display: flex;
    align-items: center;
    width: 200px;
    .title {
      margin-left: 12px;
      cursor: pointer;
    }
  }
</style>
