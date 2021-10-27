import { defineComponent, computed } from "vue";
import { ElInput } from "element-plus";

export default defineComponent({
  props: {
    start: {type: String},
    end: {type: String}
  },
  emits: ['update:start', 'update:end'],
  setup(props, ctx) {
    const start = computed({
      get() {
        return props.start
      },
      set(newValue) {
        ctx.emit('update:start', newValue)
      }
    })
    const end = computed({
      get() {
        return props.end
      },
      set(newValue) {
        ctx.emit('update:end', newValue)
      }
    })
    return () => <div class="range" >
      <ElInput v-model={start.value}></ElInput>
      <div>~</div>
      <ElInput v-model={end.value}></ElInput>
    </div>
  }
})