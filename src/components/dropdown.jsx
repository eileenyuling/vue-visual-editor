import { createVNode, defineComponent, render, reactive, computed } from 'vue'

const DialogComponent = defineComponent({
  props: {
    option: {type: Object}
  },
  setup(props, ctx) {
    const state = reactive({
      isShow: false,
      option: props.option,
      left: 0,
      top: 0
    })
    ctx.expose({
      showDialog(option) {
        state.isShow = true
        state.option = option
        const {top, left, height} = option.el.getBoundingClientRect()
        state.left = left
        state.top = top + height
      },
      closeDialog() {
        state.isShow = false
      }
    })
    const styles = computed(() => ({
      top: state.top + 'px',
      left: state.left + 'px'
    }))
    return () => {
      return state.isShow ? <div class="dropdown" style={styles.value}>
        {state.option.content()}
      </div> : null
    }
  }
})
let vm
export function $dropdown(option) {
  if (!vm) {
    let el = document.createElement('div')
    vm = createVNode(DialogComponent, {option})
    render(vm, el)
    document.body.appendChild(el)
  }
  let {showDialog, closeDialog} = vm.component.exposed
  showDialog(option)

  return {
    close() {
      closeDialog()
    }
  }
}