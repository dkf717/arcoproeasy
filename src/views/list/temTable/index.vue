<template>
  <div class="container">
    <Breadcrumb :items="['列表页', '模板列表']" />
    <div style="display: flex">
      <a-card
        class="general-card"
        :title="'模板列表'"
        :style="{
          minWidth: '300px',
          marginRight: '8px',
        }"
      >
        <a-tree
          ref="treeRef"
          block-node
          :data="treeData"
          show-line
          @update:selected-keys="selectedKeysChange"
        >
          <template #extra="nodeData">
            <a-space>
              <IconPlus
                v-if="!nodeData.parentId || nodeData.parentId == -1"
                style="color: #3370ff"
                @click="() => onIconClick(nodeData)"
              />
              <IconEdit
                v-if="nodeData.parentId"
                style="color: #3370ff"
                @click="() => treeNodeEdit(nodeData)"
              />
              <IconDelete
                v-if="nodeData.parentId && !nodeData.children?.length"
                style="color: #f53f3f"
                @click="() => treeNodeDel(nodeData)"
              />
            </a-space> </template
        ></a-tree>
      </a-card>
      <a-card class="general-card" :title="'字段列表'" style="flex: 1">
        <a-row style="margin-bottom: 16px">
          <a-col :span="12">
            <a-space>
              <a-button v-if="temId" type="primary" @click="addNew">
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
    </div>
    <a-modal
      v-model:visible="treeFormVisible"
      width="auto"
      draggable
      ok-text="保存"
      @ok="treeFromSave"
    >
      <template #title>模板{{ treeForm.id ? '编辑' : '新增' }}</template>
      <a-form auto-label-width :model="treeForm">
        <a-form-item field="title" label="模板标题">
          <a-input v-model="treeForm.title" />
        </a-form-item>
        <a-form-item field="orderNo" label="模板排序">
          <a-input v-model="treeForm.orderNo" />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
      v-model:visible="formVisible"
      width="auto"
      draggable
      @ok="handleOk"
    >
      <template #title> Title </template>
      <a-form auto-label-width :model="form">
        <a-form-item field="field" label="字段名">
          <a-input v-model="form.field" />
        </a-form-item>
        <a-form-item field="title" label="字段标题">
          <a-input v-model="form.title" />
        </a-form-item>
        <a-form-item field="fieldType" label="字段类型">
          <a-input v-model="form.fieldType" />
        </a-form-item>
        <a-form-item field="placeholder" label="提示文字">
          <a-input v-model="form.placeholder" />
        </a-form-item>
        <a-form-item field="orderNo" label="字段排序">
          <a-input v-model="form.orderNo" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  // import引入部分
  import { computed, ref, reactive, watch, nextTick } from 'vue';
  import useLoading from '@/hooks/loading';
  import {
    getRouteDataList,
    PolicyRecord,
    PolicyParams,
    addNewRoute,
    getTemDataList,
    addNewTem,
    delTem,
  } from '@/api/list';
  import { getFieldDataList, addNewField } from '@/api/fieldTable';
  import { Pagination } from '@/types/global';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import renderCom from '@/components/renderCom.vue';
  import { listToTree } from '@/utils/publicJs';
  // import type引入部分
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  // type定义部分
  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };
  // ref组件标记部分
  const treeRef = ref();
  // hook引入部分
  const { loading, setLoading } = useLoading(true);
  // booble绑定部分
  const formVisible = ref(false);
  const treeFormVisible = ref(false);
  // 数字绑定部分
  // 字符串绑定部分
  const size = ref<SizeProps>('medium');
  const temId = ref('');
  // 数组绑定部分
  const renderData = ref<PolicyRecord[]>([]);
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);
  const treeData = ref([]);
  // Map绑定部分
  // 需重置对象生成函数部分
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
  // 需重制对象绑定部分
  const formModel = ref(generateFormModel());
  // 无需重制对象绑定部分
  const basePagination: Pagination = {
    current: 1,
    pageSize: 20,
  };
  const pagination = reactive({
    ...basePagination,
  });
  const form = reactive({
    id: '',
    temId: '', // 模板id
    field: '', // 字段名
    title: '', // 字段标题
    fieldType: '', // 字段类型
    placeholder: '', // 提示文字
    orderNo: '', // 排序
    // 选择器
    options: '', // 选项JSON
  });
  const treeForm = reactive({
    id: '',
    parentId: '',
    title: '',
    orderNo: '',
  });
  // computed部分
  const columns = computed<any[]>(() => [
    {
      title: '字段名',
      dataIndex: 'field',
    },
    {
      title: '字段标题',
      dataIndex: 'title',
    },
    {
      title: '字段类型',
      dataIndex: 'fieldType',
    },
    {
      title: '提示文字',
      dataIndex: 'placeholder',
    },
    {
      title: '字段排序',
      dataIndex: 'orderNo',
    },
    {
      title: '操作',
      dataIndex: 'operations',
      format: `h('button',{on:{click:()=>{console.log(789)}}},'修改')`,
    },
  ]);
  // watch部分
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
  // 方法声明部分
  const getTreeData = async () => {
    setLoading(true);
    try {
      const { data } = await getTemDataList({});
      data.list.forEach((v) => {
        v.key = v.id;
        if (!v.parentId) {
          v.parentId = '-1';
        }
      });
      data.list.unshift({
        key: '-1',
        id: '-1',
        title: '全部',
        disabled: true,
      });
      treeData.value = listToTree({
        list: data.list,
        pIdKey: 'parentId',
        idKey: 'id',
      });
      nextTick(() => {
        treeRef.value.expandAll(true);
      });
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async (data = {}) => {
    setLoading(true);
    try {
      const res = await getFieldDataList({
        search: { temId: temId.value },
        ...data,
      });
      renderData.value = listToTree({
        list: res.data.list,
      });
      // pagination.current = params.current;
      // pagination.total = data.total;
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
    form.temId = temId.value;
    formVisible.value = true;
  };
  // 确定
  const handleOk = () => {
    addNewField(form).then((res: any) => {
      fetchData();
    });
  };
  const onIconClick = (nodeData: any) => {
    const children = nodeData.children || [];
    const id = `${(new Date() as unknown as number) - 0}`;
    const tem = {
      title: '新模板',
      parentId: nodeData.id,
      key: id,
      id,
    };
    addNewTem(tem).then((res: any) => {
      getTreeData();
    });
  };
  const treeNodeEdit = (nodeData: any) => {
    Object.assign(treeForm, nodeData);
    treeFormVisible.value = true;
  };
  const treeFromSave = () => {
    addNewTem(treeForm).then((res: any) => {
      getTreeData();
    });
  };
  // 树节点删除
  const treeNodeDel = (nodeData: any) => {
    delTem(nodeData.id).then((res: any) => {
      getTreeData();
    });
  };
  const selectedKeysChange = (treeNodeKey: any) => {
    temId.value = treeNodeKey;
    fetchData();
  };
  // 方法执行部分
  getTreeData();
  // fetchData();
</script>

<script lang="ts">
  export default {
    name: 'SearchTable',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
    height: 100%;
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
