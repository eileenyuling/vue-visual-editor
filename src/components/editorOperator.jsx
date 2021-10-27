import { defineComponent, inject, watch, reactive } from "vue";
import { ElButton, ElColorPicker, ElForm, ElFormItem, ElInput, ElInputNumber, ElOption, ElSelect } from "element-plus";
import Range from "./range";
import _ from 'lodash'
import TableEditor from "../packages/table-editor";

const EditorOperator = defineComponent({
  props: {
    block: {type: Object},
    data: {type: Object},
    updateContainer: {type: Function},
    updateBlock: {type: Function}
  },
  setup(props) {
    const config = inject('config')
    const state = reactive({
      editData: {}
    })
    const reset = () => {
      if (!props.block) {
        state.editData = _.cloneDeep(props.data.container)
      } else {
        state.editData = _.cloneDeep(props.block.props)
      }
    }
    const apply = () => {
      if (!props.block) {
        props.updateContainer({...props.data, container: state.editData})
      } else {
        props.updateBlock({...props.block, props: state.editData}, props.block)
      }
    }
    watch(() => props.block, reset, {immediate: true})
    return () => {
      let content = []
      if (props.block) {
        const component = config.componentMap[props.block.key]
        if (component && component.props) {
          content = Object.entries(component.props).map(([propName, propConfig]) => {
            return <ElFormItem label={propConfig.label}>
              {{
                text: () => {
                  return <ElInput v-model={state.editData[propName]}></ElInput>
                },
                fontSize: () => {
                  return <ElSelect v-model={state.editData[propName]}>
                    {propConfig.options.map(option => {
                      return <ElOption label={option.label} value={option.value}></ElOption>
                    })}</ElSelect>},
                color: () => {
                  return <ElColorPicker v-model={state.editData[propName]}></ElColorPicker>
                },
                type: () => {
                  return <ElSelect v-model={state.editData[propName]}>
                  {propConfig.options.map(option => {
                    return <ElOption label={option.label} value={option.value}></ElOption>
                  })}</ElSelect>
                },
                size: () => {
                  return <ElSelect v-model={state.editData[propName]}>
                  {propConfig.options.map(option => {
                    return <ElOption label={option.label} value={option.value}></ElOption>
                  })}</ElSelect>
                },
                range: () => {
                  return <Range start={state.editData.start} onUpdate:start={($event) => {state.editData.start = $event}}
                  end={state.editData.end} onUpdate:end={($event) => {state.editData.end = $event}} ></Range>
                },
                table: () => {
                  return <TableEditor propConfig={propConfig} v-model={state.editData.data}></TableEditor>
                }
              }[propName]()}
            </ElFormItem>
          })
        }

      } else {
        content.push(<>
          <ElFormItem label="容器宽度">
            <ElInputNumber v-model={state.editData.width}></ElInputNumber>
          </ElFormItem>
          <ElFormItem label="容器高度">
            <ElInputNumber v-model={state.editData.height}></ElInputNumber>
          </ElFormItem>
          </>
        )
      }
      return <ElForm labelPosition="top">
          <ElFormItem>
            {content}
            <ElButton type="primary" onClick={() => apply()}>应用</ElButton>
            <ElButton onClick={() => reset()}>重置</ElButton>
          </ElFormItem>
        </ElForm>

    }
  }
})
export default EditorOperator