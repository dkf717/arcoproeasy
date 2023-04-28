<script lang="ts">
  import { h, defineComponent } from 'vue';

  export default defineComponent({
    props: ['cellData', 'column'],
    setup(props) {
      const turnFn = (_h: any) => {
        if (props.column.format) {
          try {
            // eslint-disable-next-line no-new-func
            const newFn = new Function(
              'h,value,cellData,column',
              `return ${props.column.format}`
            );
            return newFn(
              _h,
              props.cellData[props.column.field],
              props.cellData,
              props.column
            );
          } catch (error) {
            return props.cellData[props.column.field];
          }
        }
        return _h('div', props.cellData[props.column.field]);
      };
      return () => {
        return turnFn(h);
      };
    },
  });
</script>

<style scoped lang="less"></style>
