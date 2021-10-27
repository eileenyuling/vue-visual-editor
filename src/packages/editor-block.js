import { defineComponent, inject, onMounted, ref, computed } from "vue"
import BlockResize from "./block-resize"

export default defineComponent({
  props: {
    block: { type: Object },
    updateBlock: {type: Function}
  },
  setup(props) {
    const blockStyles = computed(() => ({
      top: `${props.block.top}px`,
      left: `${props.block.left}px`,
      'z-index': `${props.block.zIndex}`
    }))
    const config = inject('config')
    const blockRef = ref(null)
    onMounted(() => {
      const { offsetWidth, offsetHeight } = blockRef.value
      let block = {
        ...props.block,
        width: offsetWidth,
        height: offsetHeight
      }
      if (props.block.alignCenter) { //拖拽松手时
        block = {
          ...block,
          left: props.block.left - offsetWidth / 2,
          top: props.block.top - offsetHeight / 2,
          alignCenter: false
        }
      }
      props.updateBlock(block)
    })
    return () => {
      const component = config.componentMap[props.block.key]
      const RenderComponent = component.render({...props.block.props,
        width: props.block.width,
        height: props.block.height
      } || {})
      const {width, height} = component.resize || {}
      return (
      <div class="editor-block" style={blockStyles.value} ref={blockRef}>
        {RenderComponent}
        {props.block.focus && (width || height) && <BlockResize block={props.block} component={component} updateBlock={props.updateBlock}></BlockResize>}
      </div>
    )}
  }
})