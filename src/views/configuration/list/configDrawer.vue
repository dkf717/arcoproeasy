<template>
  <a-drawer
    :visible="drawerVisible"
    :width="400"
    :on-before-ok="saveConfiguration"
    @ok="drawerVisible = false"
    @cancel="drawerVisible = false"
  >
    <template #title>表格配置</template>
    <a-scrollbar style="height: 100%; overflow: auto">
      <div>
        <a-radio-group v-model="position" type="button" size="mini">
          <a-radio value="base">通用</a-radio>
          <a-radio value="search">搜索</a-radio>
          <a-radio value="column">列表</a-radio>
          <a-radio value="other">其他</a-radio>
        </a-radio-group>
        <baseConfiguration
          v-if="position === 'base'"
          v-model:baseConfig="baseConfig"
        ></baseConfiguration>
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
        <columnConfiguration
          v-if="position === 'column'"
          v-model:tableColumnList="tableColumnList"
        ></columnConfiguration>
      </div>
    </a-scrollbar>
  </a-drawer>
</template>

<script setup lang="ts" name="tableConfig">
  import {
    getConfigurationById,
    saveConfigurationData,
  } from '@/api/configuration';
  import { onMounted, reactive, ref, watch, toRef } from 'vue';
  import { Notification } from '@arco-design/web-vue';
  import baseConfiguration from '../components/baseConfiguration.vue';
  import columnConfiguration from '../components/columnConfiguration.vue';
  // import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';

  // 接收参数
  const props = defineProps({
    configuration: {
      type: Object,
    },
  });

  // 触发事件
  const emit = defineEmits(['configChange']);
  // 获取路由参数
  // const route = useRoute();
  // const query = route.query;
  const position = ref('base');
  const drawerVisible = ref(false);
  // const baseConfigR = ref(configurationC.baseConfig);
  const baseConfig = reactive({});
  const tableColumnList = ref([]);
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
  // 打开抽屉
  const openDrawer = () => {
    const configurationC = JSON.parse(JSON.stringify(props.configuration));
    drawerVisible.value = true;
    Object.assign(baseConfig, configurationC.baseConfig);
    tableColumnList.value = configurationC.tableColumnList;
  };
  // 保存配置
  const saveConfiguration = (done: (closed: boolean) => void) => {
    saveConfigurationData({
      baseConfig,
      tableColumnList: tableColumnList.value,
    })
      .then(() => {
        Notification.success('更新配置成功');
        done(true);
        emit('configChange');
      })
      .catch((err) => {
        Notification.error(err as string);
        done(false);
      });
  };
  // 获取配置
  // 父组件可调用方法
  defineExpose({ openDrawer });
</script>

<style scoped lang="less"></style>
