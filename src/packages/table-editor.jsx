import { defineComponent, computed } from "vue";
import _ from 'lodash'
import { ElButton } from "element-plus";
import {$tableDialog} from '../components/tableDialog'
export default defineComponent({
  props: {
    propConfig: {type: Object},
    modelValue: {type: Array}
  },
  setup(props, ctx) {
    const data = computed({
      get() {
        return props.modelValue
      },
      set(newVal) {
        ctx.emit('update:modelValue', _.cloneDeep(newVal))
      }
    })
    const add = () => {
      $tableDialog({
        config: props.propConfig,
        data: data.value,
        footer: true,
        onConfirm(value) {
          data.value = value
        }
      })
    }
    return () => <div>
      <ElButton onClick={add}>添加</ElButton>
    </div>
  }
})