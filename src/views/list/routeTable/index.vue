<template>
  <div class="container">
    <Breadcrumb :items="['列表页', '路由列表']" />
    <a-card class="general-card" :title="'路由列表'">
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button type="primary" @click="addNew">
              <template #icon>
                <icon-plus />
              </template>
              {{ '新建' }}
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
        :bordered="false"
        :size="size"
        @page-change="onPageChange"
      >
        <template #columns>
          <a-table-column
            v-for="column in cloneColumns"
            :key="column.dataIndex"
            :title="column.title"
            :data-index="column.dataIndex"
            :align="column.align"
            :width="column.width"
          >
            <template #cell="{ record }">
              <renderCom :cell-data="record" :column="column"></renderCom>
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
        <a-form-item field="parentName" label="父级名称">
          <a-input v-model="form.parentName" />
        </a-form-item>
        <a-form-item field="path" label="路由地址">
          <a-input v-model="form.path" />
        </a-form-item>
        <a-form-item field="name" label="路由名称">
          <a-input v-model="form.name" />
        </a-form-item>
        <a-form-item field="component" label="路由页面">
          <a-input v-model="form.component" />
        </a-form-item>
        <a-form-item field="title" label="路由标题">
          <a-input v-model="form.title" />
        </a-form-item>
        <a-form-item field="icon" label="路由图标">
          <a-input v-model="form.icon" />
        </a-form-item>
        <a-form-item field="orderNo" label="路由排序">
          <a-input-number v-model="form.orderNo" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, watch, nextTick } from 'vue';
  import useLoading from '@/hooks/loading';
  import {
    getRouteDataList,
    PolicyRecord,
    PolicyParams,
    addNewRoute,
  } from '@/api/list';
  import { Pagination } from '@/types/global';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import renderCom from '@/components/renderCom.vue';
  import { random } from 'lodash';
  import { listToTree } from '@/utils/publicJs';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const generateFormModel = () => {
    return {
      number: '',
      name: '',
      contentType: '',
      filterType: '',
      createdTime: [],
      status: '',
    };
  };
  const { loading, setLoading } = useLoading(true);
  const renderData = ref<PolicyRecord[]>([]);
  const formModel = ref(generateFormModel());
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);

  const size = ref<SizeProps>('medium');

  const basePagination: Pagination = {
    current: 1,
    pageSize: 20,
  };
  const formVisible = ref<boolean>(false);
  const pagination = reactive({
    ...basePagination,
  });
  const form = reactive({
    id: '',
    parentName: '',
    path: '',
    name: '',
    component: '',
    title: '',
    icon: '',
    orderNo: 0,
  });
  const columns = computed<any[]>(() => [
    {
      title: '路由地址',
      dataIndex: 'path',
    },
    {
      title: '路由名称',
      dataIndex: 'name',
    },
    {
      title: '路由页面',
      dataIndex: 'component',
    },
    {
      title: '路由标题',
      dataIndex: 'title',
    },
    {
      title: '路由图标',
      dataIndex: 'icon',
    },
    {
      title: '路由排序',
      dataIndex: 'orderNo',
    },
    {
      title: '操作',
      dataIndex: 'operations',
    },
  ]);
  const fetchData = async (
    params: PolicyParams = {
      current: 0,
      pageSize: 0,
    }
  ) => {
    setLoading(true);
    try {
      const { data } = await getRouteDataList(params);

      renderData.value = listToTree({
        list: data.list,
        pIdKey: 'parentName',
        idKey: 'name',
      });
      pagination.current = params.current;
      pagination.total = data.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const search = () => {
    fetchData({
      ...basePagination,
      ...formModel.value,
    } as unknown as PolicyParams);
  };
  const onPageChange = (current: number) => {
    fetchData({ ...basePagination, current });
  };

  fetchData();
  const reset = () => {
    formModel.value = generateFormModel();
  };

  const handleSelectDensity = (
    val: string | number | Record<string, any> | undefined,
    e: Event
  ) => {
    size.value = val as SizeProps;
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
        const sortable = new Sortable(el, {
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
    addNewRoute(form).then((res) => {
      fetchData();
    });
  };
  watch(
    () => columns.value,
    (val) => {
      cloneColumns.value = cloneDeep(val);
      cloneColumns.value.forEach((item, index) => {
        item.checked = true;
      });
      showColumns.value = cloneDeep(cloneColumns.value);
    },
    { deep: true, immediate: true }
  );
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
