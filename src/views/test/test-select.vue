<script setup name="DDemo" lang="ts">
  import { useFetchSelect } from '@/hooks/test-select';

  //   模拟调用接口
  function getRemoteData() {
    return new Promise<any[]>((resolve, reject) => {
      setTimeout(() => {
        // 模拟接口调用有概率出错
        if (Math.random() > 0.5) {
          resolve([
            {
              key: 1,
              label: '苹果',
              value: 1,
            },
            {
              key: 2,
              label: '香蕉',
              value: 2,
            },
            {
              key: 3,
              label: '橘子',
              value: 3,
            },
          ]);
        } else {
          reject(new Error('不小心出错了！'));
        }
      }, 3000);
    });
  }

  // 将之前用的 options,loading，和调用接口的逻辑都抽离到hook中
  const selectBind = useFetchSelect({
    apiFun: getRemoteData,
  });
</script>

<template>
  <div>
    <!-- 将hook返回的接口，通过 v-bind 绑定给组件 -->
    <a-select v-bind="selectBind" />
  </div>
</template>
