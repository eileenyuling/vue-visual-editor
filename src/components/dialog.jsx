import { createVNode, defineComponent, render, reactive } from 'vue'
import { ElButton, ElDialog, ElInput } from 'element-plus'

const DialogComponent = defineComponent({
  props: {
    option: {type: Object}
  },
  setup(props, ctx) {
    const state = reactive({
      isShow: false,
      option: props.option
    })
    ctx.expose({
      showDialog(option) {
        state.isShow = true
        state.option = option
      }
    })
    const cancel = () => {
      state.isShow = false
    }
    const confirm = () => {
      state.option.onConfirm && state.option.onConfirm(state.option.content)
      state.isShow = false
    }
    return () => {
      return <ElDialog v-model={state.isShow}>{{
        default: () => {
          return <ElInput type="textarea" rows={10}
          v-model={state.option.content}></ElInput>
        },
        title: () => state.option.title,
        footer: () => state.option.footer ? <div>
          <ElButton onClick={() => cancel()}>取消</ElButton>
          <ElButton type="primary" onClick={() => confirm()}>确定</ElButton>
        </div> : null
      }}</ElDialog>
    }
  }
})
let vm
export function $dialog(option) {
  if (!vm) {
    let el = document.createElement('div')
    vm = createVNode(DialogComponent, {option})
    render(vm, el)
    document.body.appendChild(el)
  }

  let {showDialog} = vm.component.exposed
  showDialog(option)
}