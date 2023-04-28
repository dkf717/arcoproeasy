<template>
  <div class="list">
    <configTable ref="tableRef" :configuration="configuration">
      <template #cardExtra>
        <ALink @click="openConfig">编辑</ALink>
      </template>
    </configTable>
    <configDrawer
      ref="drawerRef"
      :configuration="configuration"
      @config-change="configChange"
    ></configDrawer>
  </div>
</template>

<script setup lang="ts" name="list">
  import { useRoute } from 'vue-router';
  import configTable from '@/views/configuration/components/configTable.vue';
  import configDrawer from '@/views/configuration/list/configDrawer.vue';
  import { ref, reactive } from 'vue';
  import { getConfigurationById } from '@/api/configuration';
  import { Notification } from '@arco-design/web-vue';

  // 接收参数
  // const props = defineProps();
  // 触发事件
  // const emit = defineEmits();
  const tableRef = ref();
  const drawerRef = ref();
  const route = useRoute();
  const { params } = route;
  const { pageId } = params;
  const openConfig = () => {
    drawerRef.value.openDrawer();
  };
  const configuration = reactive({});
  const getConfigurationData = async () => {
    try {
      const res = await getConfigurationById(pageId as string);
      Object.assign(configuration, res.data);
    } catch (err) {
      Notification.error(err as string);
    }
  };
  const configChange = () => {
    getConfigurationData();
  };
  // const initPage = async () => {
  getConfigurationData();
  //   initedPage.value = true;
  // };
  // initPage();
  // 父组件可调用方法
  // defineExpose({})
</script>

<style scoped lang="less"></style>
