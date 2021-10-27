import { ElButton, ElInput, ElOption, ElSelect } from 'element-plus'
import Range from '../components/range'
function createEditorConfig() {
  const componentList = []
  const componentMap = {}

  return {
    componentList,
    componentMap,
    register: (component) => {
      componentList.push(component)
      componentMap[component.key] = component
    }
  }
}

export const registerConfig = createEditorConfig()
const createInputProp = (label) => ({type: 'input', label})
const createColorProp = (label) => ({type: 'color', label})
const createSelectProp = (label, options) => ({type: 'select', label, options})
const createRangeProp = (label) => ({type: 'range', label})
const createTableProp = (label, table) => ({type: 'table', label, table})
registerConfig.register({
  label: '文本',
  preview: () =>'预览文本',
  render: (props) => <span style={{color: props.color, fontSize: props.fontSize}}>{props.text || '默认文本'}</span>,
  key: 'text',
  props: {
    text: createInputProp('文本内容'),
    color: createColorProp('字体颜色'),
    fontSize: createSelectProp('字体大小', [
      {label: '14px', value: '14px'},
      {label: '16px', value: '16px'},
      {label: '18px', value: '18px'}
    ])
  }
})
registerConfig.register({
  label: '按钮',
  preview: () => <ElButton>预览按钮</ElButton>,
  render: (props) => {
    return <ElButton type={props.type}
    style={{color: props.color,
      height: props.height + 'px',
      width: props.width + 'px'
    }} size={props.size}>{props.text || '默认按钮'}</ElButton>
  },
  key: 'button',
  props: {
    text: createInputProp('文本内容'),
    color: createColorProp('字体颜色'),
    type: createSelectProp('按钮类型', [
      {label: '默认', value: 'primary'},
      {label: '成功', value: 'success'},
      {label: '警告', value: 'warning'},
      {label: '危险', value: 'danger'},
      {label: '文本', value: 'text'}
    ]),
    size: createSelectProp('按钮尺寸', [
      {label: '中等', value: 'medium'},
      {label: '小', value: 'small'},
      {label: '极小', value: 'mini'}
    ])
  },
  resize: {
    width: true,
    height: true
  }
})
registerConfig.register({
  label: '输入框',
  resize: {width: true},
  preview: () => <ElInput placeholder="预览输入框"></ElInput>,
  render: (props) => <ElInput placeholder="渲染输入框" style={{
    height: props.height + 'px',
    width: props.width + 'px'
  }} v-model={props.text}></ElInput>,
  key: 'input',
  props: {
    text: createInputProp('文本内容')
  }
})
registerConfig.register({
  label: '范围选择器',
  preview: () => <Range start="" end=""></Range>,
  render: (props) => {
    return <Range start={props.start} end={props.end}
    onUpdate:start={($event) => props.start = $event}
    onUpdate:end={($event) => props.end = $event}
    ></Range>
  },
  key: 'range',
  props: {
    range: createRangeProp('范围选择')
  }
})
registerConfig.register({
  label: '下拉框',
  preview: () => <ElSelect modelValue=""></ElSelect>,
  render: (props) => <ElSelect v-model={props.value}>
    {(props.data || []).map(item => {
      return <ElOption label={item.label} value={item.value}></ElOption>
    })}
  </ElSelect>,
  key: 'select',
  props: {
    table: createTableProp('下拉选项', {
      options: [
        {label: '显示值', field: 'label'},
        {label: '绑定值', field: 'value'}
      ],
      key: 'label'
    })

  }
})
