import { onMounted, reactive, ref } from 'vue';
// 定义下拉框接收的数据格式
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  key?: string;
}
// 定义入参格式
interface FetchSelectProps {
  apiFun: () => Promise<any[]>;
}

export function useFetchSelect(props: FetchSelectProps) {
  const { apiFun } = props;

  const options = ref<SelectOption[]>([]);

  const loading = ref(false);

  /* 调用接口请求数据 */
  const loadData = () => {
    loading.value = true;
    options.value = [];
    return apiFun().then(
      (data) => {
        loading.value = false;
        options.value = data;
        return data;
      },
      (err) => {
        // 未知错误，可能是代码抛出的错误，或是网络错误
        loading.value = false;
        options.value = [
          {
            value: '-1',
            label: err.message,
            disabled: true,
          },
        ];
        // 接着抛出错误
        return Promise.reject(err);
      }
    );
  };

  //   onMounted 中调用接口
  onMounted(() => {
    loadData();
  });

  return reactive({
    options,
    loading,
  });
}
