<template>
  <a-collapse accordion>
    <a-collapse-item key="api" header="页面Api">
      <a-form :model="baseConfig" auto-label-width>
        <a-form-item field="getDataListApi" label="获取列表">
          <a-input v-model="baseConfig.getDataListApi" placeholder="请输入" />
        </a-form-item>
        <a-form-item field="addNewApi" label="新增数据">
          <a-input v-model="baseConfig.addNewApi" placeholder="请输入" />
        </a-form-item>
      </a-form>
    </a-collapse-item>
    <a-collapse-item key="addbtn" header="新增">
      <template #extra>
        <a-switch v-model="baseConfig.addBtnShow" @click.stop="null" />
      </template>
      <a-form :model="baseConfig" auto-label-width>
        <a-form-item field="addBtnIcon" label="按钮图标">
          <a-input
            v-model="baseConfig.addBtnIcon"
            placeholder="请输入按钮图标"
          />
        </a-form-item>
        <a-form-item field="addBtnIcon" label="按钮文字">
          <a-input
            v-model="baseConfig.addBtnText"
            placeholder="请输入按钮文字"
          />
        </a-form-item>
      </a-form>
    </a-collapse-item>
    <a-collapse-item key="viewbtn" header="查看">
      <template #extra>
        <a-switch v-model="baseConfig.canView" @click.stop="null" />
      </template>
      <a-form :model="baseConfig" auto-label-width>
        <a-form-item field="viewBtnIcon" label="按钮图标">
          <a-input
            v-model="baseConfig.viewBtnIcon"
            placeholder="请输入按钮图标"
          />
        </a-form-item>
        <a-form-item field="viewBtnIcon" label="按钮文字">
          <a-input
            v-model="baseConfig.viewBtnText"
            placeholder="请输入按钮文字"
          />
        </a-form-item>
      </a-form>
    </a-collapse-item>
    <a-collapse-item key="delbtn" header="删除">
      <template #extra>
        <a-switch v-model="baseConfig.delBtnShow" @click.stop="null" />
      </template>
      <a-form :model="baseConfig" auto-label-width>
        <a-form-item field="delBtnIcon" label="按钮图标">
          <a-input
            v-model="baseConfig.delBtnIcon"
            placeholder="请输入按钮图标"
          />
        </a-form-item>
        <a-form-item field="delBtnIcon" label="按钮文字">
          <a-input
            v-model="baseConfig.delBtnText"
            placeholder="请输入按钮文字"
          />
        </a-form-item>
      </a-form>
    </a-collapse-item>
  </a-collapse>
</template>

<script setup lang="ts" name="baseConfiguration">
  import { computed } from 'vue';
  // 接收参数
  const emit = defineEmits(['update:baseConfig']);
  const props = defineProps({
    baseConfig: {
      type: Object,
      default: () => ({}),
    },
  });
  const baseConfig = computed({
    get() {
      return props.baseConfig;
    },
    set() {
      emit('update:baseConfig', baseConfig.value);
    },
  });

  // 触发事件
  // 获取路由参数
  // const route = useRoute();
  // const query = route.query;

  // 父组件可调用方法
  // defineExpose({})
</script>

<style scoped lang="less">
  :deep(.arco-form-item) {
    margin-bottom: unset;
  }
</style>
