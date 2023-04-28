<template>
  <div class="container">
    <Breadcrumb :items="['列表页', '路由列表']" />
    <a-card class="general-card" :title="'路由列表'">
      <template #extra>
        <!-- <a-link @click="jump">跳转</a-link>
        <a-link @click="drawerVisible = true">编辑</a-link> -->
        <slot name="cardExtra"></slot>
      </template>
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
        @page-change="pageChange"
        @page-size-change="pageSizeChange"
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
        <a-form-item
          v-for="(column, index) in columns"
          :key="index"
          :field="column.field"
          :label="column.title"
        >
          <a-input
            :model-value="form[column.field]"
            @update:model-value="form[column.field] = $event"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  // import引入部分
  import { ref, reactive, watch, nextTick } from 'vue';

  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import renderCom from '@/components/renderCom.vue';
  import { useRoute } from 'vue-router';
  import { getFieldDataList } from '@/api/fieldTable';
  import { getAutoDataList, addNewAuto } from '@/api/autoTable';
  import { Notification } from '@arco-design/web-vue';
  // import type引入部分
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';

  // ref组件标记部分

  // hook引入部分
  import useLoading from '@/hooks/loading';

  const { loading, setLoading } = useLoading(true);
  const route = useRoute();
  const { params } = route;
  const temId = params.id;

  // type定义部分
  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

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
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await getAutoDataList({
        temId,
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
    addNewAuto({ temId, data: form }).then(() => {
      fetchData();
    });
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
  const getTableColumns = async () => {
    try {
      const res = await getFieldDataList({ search: { temId } });
      columns.value = res.data.list.map((v) => ({ ...v, dataIndex: v.field }));
    } catch (err) {
      Notification.error(err as string);
    }
  };
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
  // 方法执行部分
  fetchData();
  getTableColumns();
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
