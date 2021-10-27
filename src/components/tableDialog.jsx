import { createVNode, defineComponent, render, reactive } from 'vue'
import { ElButton, ElDialog, ElInput, ElTable, ElTableColumn } from 'element-plus'
import _ from 'lodash'
const DialogComponent = defineComponent({
  props: {
    option: {type: Object}
  },
  setup(props, ctx) {
    const state = reactive({
      isShow: false,
      option: props.option,
      data: []
    })
    ctx.expose({
      showDialog(option) {
        state.isShow = true
        state.option = option
        state.data = _.cloneDeep(option.data) || []
      }
    })
    const cancel = () => {
      state.isShow = false
    }
    const confirm = () => {
      state.option.onConfirm && state.option.onConfirm(state.data)
      state.isShow = false
    }
    const add = () => {
      state.data.push({})
    }
    const undo = () => {
      state.data = _.cloneDeep(state.option.data)
    }
    const deleteData = (index) => {
      state.data.splice(index, 1)
    }
    return () => {
      return <ElDialog v-model={state.isShow}>{{
        default: () => {
          return <div>
            <ElButton onClick={add}>添加</ElButton>
            <ElButton onClick={undo}>重置</ElButton>
            <ElTable data={state.data}>
              <ElTableColumn type="index"></ElTableColumn>
              {state.option.config.table.options.map(option => {
                return <ElTableColumn label={option.label}>
                  {{
                    default: ({row}) => {
                      return <ElInput v-model={row[option.field]}></ElInput>
                    }
                  }}
                </ElTableColumn>
              })}
              <ElTableColumn label="操作">
              {{
                default: ({$index}) => {
                  return <ElButton type="danger" onClick={() => deleteData($index)}>删除</ElButton>
                }
              }}
              </ElTableColumn>
            </ElTable>
          </div>
        },
        footer: () => state.option.footer ? <div>
          <ElButton onClick={() => cancel()}>取消</ElButton>
          <ElButton type="primary" onClick={() => confirm()}>确定</ElButton>
        </div> : null
      }}</ElDialog>
    }
  }
})
let vm
export function $tableDialog(option) {
  if (!vm) {
    let el = document.createElement('div')
    vm = createVNode(DialogComponent, {option})
    render(vm, el)
    document.body.appendChild(el)
  }

  let {showDialog} = vm.component.exposed
  showDialog(option)
}