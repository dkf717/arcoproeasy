<script setup name="Index" lang="ts">
  import { useAutoRequest } from '@/hooks/test-loading';

  function submitApi(text: string) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 模拟接口调用有概率出错
        if (Math.random() > 0.5) {
          resolve({
            status: 'ok',
            text,
          });
        } else {
          reject(new Error('不小心出错了！'));
        }
      }, 3000);
    });
  }
  const [loading, submit] = useAutoRequest(submitApi);

  function onSubmit() {
    submit('aaa').then((res: any) => {
      console.log('res', res);
    });
  }
</script>

<template>
  <div class="col">
    <a-button :loading="loading" @click="onSubmit">提交</a-button>
  </div>
</template>
