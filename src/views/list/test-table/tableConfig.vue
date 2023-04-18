<template>
  <a-scrollbar style="height: 100%; overflow: auto">
    <div>
      <a-radio-group v-model="position" type="button" size="mini">
        <a-radio value="base">通用</a-radio>
        <a-radio value="search">搜索</a-radio>
        <a-radio value="table">列表</a-radio>
        <a-radio value="other">其他</a-radio>
      </a-radio-group>
      <a-form v-if="position == 'base'" :model="form" layout="vertical">
        <a-form-item field="name" label="Username">
          <a-input
            v-model="form.name"
            placeholder="please enter your username..."
          />
        </a-form-item>
        <a-form-item field="post" label="Post">
          <a-input
            v-model="form.post"
            placeholder="please enter your post..."
          />
        </a-form-item>
        <a-form-item field="isRead">
          <a-checkbox v-model="form.isRead">
            I have read the manual
          </a-checkbox>
        </a-form-item>
      </a-form>
      <template v-if="position == 'search'">
        <a-collapse>
          <a-collapse-item key="rowSelection" header="选择器">
            <template #extra>
              <a-switch />
            </template>
            <div>Beijing Toutiao Technology Co., Ltd.</div>
            <div>Beijing Toutiao Technology Co., Ltd.</div>
          </a-collapse-item>
          <template v-for="column in tableConfig.columns">
            <a-collapse-item
              v-if="!['index', 'operation'].includes(column.dataIndex)"
              :key="column.title"
              :header="column.title"
            >
              <template #extra>
                <a-switch
                  @click.stop="column.searchShow = !column.searchShow"
                />
              </template>
              <div>Beijing Toutiao Technology Co., Ltd.</div>
              <div>Beijing Toutiao Technology Co., Ltd.</div>
            </a-collapse-item>
          </template>
        </a-collapse>
      </template>
      <template v-if="position == 'table'">
        <a-collapse v-model:active-key="tableCollapsActiveKey" accordion>
          <a-collapse-item key="rowSelection" header="选择器">
            <template #extra>
              <a-switch
                v-model="tableConfig.rowSelection.show"
                @click.stop="
                  emit('configChange', JSON.parse(JSON.stringify(tableConfig)))
                "
              />
            </template>
            <a-form :model="tableConfig.rowSelection" auto-label-width>
              <a-form-item field="type" label="类型">
                <a-radio-group
                  v-model="tableConfig.rowSelection.type"
                  @change="
                    emit(
                      'configChange',
                      JSON.parse(JSON.stringify(tableConfig))
                    )
                  "
                >
                  <a-radio value="checkbox">复选框</a-radio>
                  <a-radio value="radio">单选框</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item field="showCheckedAll" label="显示全选">
                <a-switch
                  v-model="tableConfig.rowSelection.showCheckedAll"
                  @change="
                    emit(
                      'configChange',
                      JSON.parse(JSON.stringify(tableConfig))
                    )
                  "
                />
              </a-form-item>
              <a-form-item field="onlyCurrent" label="只选本页">
                <a-switch
                  v-model="tableConfig.rowSelection.onlyCurrent"
                  @change="
                    emit(
                      'configChange',
                      JSON.parse(JSON.stringify(tableConfig))
                    )
                  "
                />
              </a-form-item>
            </a-form>
          </a-collapse-item>
          <template v-for="column in tableConfig.columns">
            <a-collapse-item
              v-if="![''].includes(column.dataIndex)"
              :key="column.title"
              :header="column.title"
              :disabled="!column.tableShow"
            >
              <template #extra>
                <a-switch
                  v-model="column.tableShow"
                  @click.stop="
                    emit(
                      'configChange',
                      JSON.parse(JSON.stringify(tableConfig))
                    )
                  "
                  @change="tableSwitchChange(column.title)"
                />
              </template>
              <a-form :model="column" auto-label-width>
                <a-form-item field="align" label="对齐方式">
                  <a-radio-group
                    v-model="column.align"
                    @change="
                      emit(
                        'configChange',
                        JSON.parse(JSON.stringify(tableConfig))
                      )
                    "
                  >
                    <a-radio value="left">左</a-radio>
                    <a-radio value="center">中</a-radio>
                    <a-radio value="right">右</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item field="width" label="宽度">
                  <a-input-number
                    v-model="column.width"
                    placeholder="Please Enter"
                    @change="
                      emit(
                        'configChange',
                        JSON.parse(JSON.stringify(tableConfig))
                      )
                    "
                  />
                </a-form-item>
                <a-form-item field="format" label="格式化">
                  <a-textarea
                    v-model="column.format"
                    placeholder="Please enter something"
                    allow-clear
                    @change="
                      emit(
                        'configChange',
                        JSON.parse(JSON.stringify(tableConfig))
                      )
                    "
                  />
                </a-form-item>
              </a-form>
            </a-collapse-item>
          </template>
        </a-collapse>
      </template>
    </div>
  </a-scrollbar>
</template>

<script setup lang="ts" name="tableConfig">
  import { reactive, ref } from 'vue';
  // import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';

  // 接收参数
  // const props = defineProps();
  // 触发事件
  const emit = defineEmits(['configChange']);
  // 获取路由参数
  // const route = useRoute();
  // const query = route.query;
  const position = ref('top');
  const form = reactive({
    name: '',
    post: '',
    isRead: false,
  });
  const tableCollapsActiveKey = ref([]);
  const tableConfig = reactive({
    rowSelection: {
      show: true,
      type: 'checkbox',
      showCheckedAll: true,
      onlyCurrent: false,
    },
    columns: [
      {
        title: '序号',
        dataIndex: 'index',
        searchShow: true,
        tableShow: true,
        format: '',
      },
      {
        title: '集合编号',
        dataIndex: 'number',
        tableShow: true,
        format: 'h("div", cellData[column.dataIndex])',
        align: 'center',
      },
      {
        title: '集合名称',
        dataIndex: 'name',
        tableShow: true,
        // eslint-disable-next-line no-template-curly-in-string
        format: '`值是${value}`',
      },
      {
        title: '内容体裁',
        dataIndex: 'contentType',
        tableShow: true,
        format: '',
      },
      {
        title: '筛选方式',
        dataIndex: 'filterType',
        tableShow: true,
        format: '',
      },
      {
        title: '内容量',
        dataIndex: 'count',
        tableShow: true,
        format: '',
      },
      {
        title: '创建时间',
        dataIndex: 'createdTime',
        tableShow: true,
        format: '',
      },
      {
        title: '状态',
        dataIndex: 'status',
        tableShow: true,
        format: '',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        tableShow: true,
        format: '',
      },
    ],
  });
  const tableSwitchChange = (key: string) => {
    const index = tableCollapsActiveKey.value.findIndex((v) => v === key);
    if (~index) {
      tableCollapsActiveKey.value.splice(index, 1);
    }
  };
  emit('configChange', JSON.parse(JSON.stringify(tableConfig)));
  // 父组件可调用方法
  // defineExpose({})
</script>

<style scoped lang="less"></style>
