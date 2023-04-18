<template>
  <div></div>
</template>

<script lang="ts" setup>
  import { useRouter, useRoute } from 'vue-router';
  import { useUserStore } from '@/store';
  import { listToTree } from '@/utils/publicJs';

  const router = useRouter();
  const route = useRoute();
  const userStore = useUserStore();

  const gotoPath = route.params.path as string;
  if (gotoPath && router.getRoutes().find((v) => v.name === gotoPath)) {
    // 有路由参数先与路由列表对比
    router.replace({ name: gotoPath });
  } else {
    // 没传路由参数就获取最靠前的最底层路由
    const tree = listToTree({
      list: userStore.menuList,
      pIdKey: 'parentName',
      idKey: 'name',
    });
    const getFirstFn = (arr: any): any => {
      if (arr[0]?.children?.length) {
        return getFirstFn(arr[0]?.children);
      }
      return arr[0];
    };
    const firstMenuName = getFirstFn(tree).name;
    router.replace({ name: firstMenuName });
  }
</script>

<style scoped lang="less"></style>
