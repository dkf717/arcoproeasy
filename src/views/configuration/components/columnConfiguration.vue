<template>
  <div>
    <a-collapse
      ref="collapseRef"
      v-model:active-key="collapseActiveKey"
      accordion
    >
      <template #expand-icon>
        <icon-unordered-list style="cursor: move" />
      </template>
      <a-collapse-item
        v-for="column in tableColumnList"
        v-show="!column.isDel"
        :key="column.id"
        :disabled="!column.tableShow"
      >
        <template #header>
          <a-input
            v-model="column.title"
            :disabled="!column.tableShow"
            @click.stop="null"
          />
        </template>
        <template #extra>
          <a-space>
            <a-link
              v-if="column.isCustom"
              status="danger"
              :hoverable="false"
              icon
              @click.stop="delColumnBtnClick(column)"
            >
              <template #icon>
                <icon-delete style="font-size: 20px" />
              </template>
            </a-link>
            <a-switch
              v-model="column.tableShow"
              @click.stop="tableShowChange(column.id)"
            />
          </a-space>
        </template>
        <a-form :model="column" auto-label-width>
          <a-form-item field="field" label="字段">
            <a-input
              v-model="column.field"
              :disabled="!column.isCustom"
              placeholder="请输入字段"
            />
          </a-form-item>
          <a-form-item field="align" label="对齐方式">
            <a-radio-group v-model="column.align">
              <a-radio value="left">左</a-radio>
              <a-radio value="center">中</a-radio>
              <a-radio value="right">右</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item field="width" label="宽度">
            <a-input-number v-model="column.width" placeholder="请输入宽度" />
          </a-form-item>
        </a-form>
      </a-collapse-item>
    </a-collapse>
    <a-button type="primary" @click="addColumnBtnClick">新增列</a-button>
  </div>
</template>

<script setup lang="ts" name="columnConfiguration">
  import { addColumn, delColumn } from '@/api/tableColumn';
  import Sortable from 'sortablejs';
  import { nextTick, watch, computed, ref } from 'vue';
  import { useRoute } from 'vue-router';

  // 接收参数
  const emit = defineEmits(['update:tableColumnList']);
  const props = defineProps({
    tableColumnList: {
      type: Object,
      default: () => ({}),
    },
  });
  const route = useRoute();
  const { params } = route;
  const temId = params.id;
  const collapseRef = ref();
  const tableColumnList = computed({
    get() {
      return props.tableColumnList;
    },
    set() {
      emit('update:tableColumnList', tableColumnList.value);
    },
  });
  const collapseActiveKey = ref([]);
  const tableShowChange = (key: string) => {
    const index = collapseActiveKey.value.findIndex((v) => v === key);
    if (~index) {
      collapseActiveKey.value.splice(index, 1);
    }
    // if (
    //   !column.tableShow &&
    //   collapseActiveKey.value.includes(column.id as never)
    // ) {
    //   collapseActiveKey.value = [];
    // }
  };
  // 触发事件
  // 获取路由参数
  // const route = useRoute();
  // const query = route.query;
  // watch(
  //   () => tableColumnList.value,
  //   (val) => {},
  //   { immediate: true }
  // );
  // 对表列排序
  const sortTableColumnList = (oldIndex: number, newIndex: number) => {
    // const arr = JSON.parse(JSON.stringify(tableColumnList.value));
    tableColumnList.value.splice(
      newIndex,
      0,
      tableColumnList.value.splice(oldIndex, 1).pop()
    );
    tableColumnList.value.forEach((v: any, i: number) => {
      v.orderNo = i;
    });
    // tableColumnList.value = arr;
    // let arr = [];
    // tableColumnList.value.forEach((v: any, i: number)=>{
    // })
    // tableColumnList.value = tableColumnList.value.map((v: any, i: number) => {
    //   if (i === oldIndex) {
    //     return { ...v, orderNo: newIndex };
    //   }
    //   if (i === newIndex) {
    //     orderNo += 2;
    //   } else {
    //     orderNo += 1;
    //   }
    //   return { ...v, orderNo };
    // });
  };
  // 删除列
  const delColumnBtnClick = (column: any) => {
    delColumn(column.id).then((res) => {
      const index = tableColumnList.value.findIndex(
        (v: any) => v.id === column.id
      );
      tableColumnList.value.splice(index, 1);
    });
  };
  // 新增列
  const addColumnBtnClick = () => {
    const newColumn = {
      id: `${(new Date() as unknown as number) - 0}`,
      pageId: temId,
      canSet: true,
      isCustom: true,
    };

    addColumn(newColumn).then((res: any) => {
      tableColumnList.value.push(res.data.list[0]);
    });
  };
  nextTick(() => {
    return new Sortable(collapseRef.value.$el, {
      handle: '.arco-collapse-item-icon-hover',
      onEnd(e: any) {
        const { oldIndex, newIndex } = e;
        sortTableColumnList(oldIndex, newIndex);
        // exchangeArray(cloneColumns.value, oldIndex, newIndex);
        // exchangeArray(showColumns.value, oldIndex, newIndex);
      },
    });
  });
  // 父组件可调用方法
  // defineExpose({})
</script>

<style scoped lang="less">
  :deep(.arco-form-item) {
    margin-bottom: unset;
  }
</style>
