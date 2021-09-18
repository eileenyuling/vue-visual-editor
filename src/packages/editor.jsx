import { computed, defineComponent, inject, ref } from "vue";
import EditorBlock from "./editor-block";
import './editor.scss'
import useMenuDragger from "./useMenuDragger";
import useFocus from './useFocus'
import useBlockDragger from "./useBlockDragger";
export default defineComponent({
  props: {
    modelValue: {type: Object}
  },
  emits: ['update:modelValue'],
  setup(props, ctx){
    const data = computed({
      get() {
        return props.modelValue
      },
      set(newValue) {
        ctx.emit('update:modelValue', newValue)
      }
    })
    const canvasStyles = computed(() => ({
      width: `${data.value.container.width}px`,
      height: `${data.value.container.height}px`
    }))
    const config = inject('config', config)
    const updateBlock = (block, index) => {
      data.value.blocks[index] = block
    }
    const canvasRef = ref(null)
    const {dragstart, dragend} = useMenuDragger(canvasRef, data)
    const {blockMousedown, focusData, canvasMounsedown} = useFocus(data, e => {
      mousedown(e)
    })
    const { mousedown } = useBlockDragger(focusData)
    return () => (
      <div class="editor">
        <div class="editor-left">
        {config.componentList.map(component => {
          return <div class="editor-left-item" draggable
          onDragstart={e => dragstart(e, component)}
          onDragend={e => dragend(e, component)}>
            <span>{component.label}</span>
            <div>{component.preview()}</div>
          </div>
        })}
        </div>
        <div class="editor-middle">
          <div class="editor-top"></div>
          <div class="editor-content">
            <div class="editor-canvas" style={canvasStyles.value}
            onMousedown={canvasMounsedown}
            ref={canvasRef}>
              {data.value.blocks.map((block, index) => {
                return <EditorBlock block={block}
                class={block.focus ? "block-focus" : ""}
                onMousedown={e => blockMousedown(e, block)}
                updateBlock={(block) => updateBlock(block, index)}>
                </EditorBlock>
              })}
            </div>
          </div>
        </div>
        <div class="editor-right"></div>
      </div>
    )
  }
})