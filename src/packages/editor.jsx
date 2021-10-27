import { computed, defineComponent, inject, ref } from "vue";
import EditorBlock from "./editor-block";
import './editor.scss'
import useMenuDragger from "./useMenuDragger";
import useFocus from './useFocus'
import useBlockDragger from "./useBlockDragger";
import useCommand from "./useCommand";
import { $dialog } from "../components/dialog";
import { $dropdown } from "../components/dropdown"
import DropdownItem from '../components/dropdownItem'
import EditorOperator from "../components/editorOperator";
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

    const previewRef = ref(false)
    const canvasStyles = computed(() => ({
      width: `${data.value.container.width}px`,
      height: `${data.value.container.height}px`
    }))
    const config = inject('config')
    const updateBlock = (block, index) => {
      data.value.blocks[index] = block
    }
    const canvasRef = ref(null)
    const {dragstart, dragend} = useMenuDragger(canvasRef, data)
    const {blockMousedown, focusData, canvasMounsedown, lastSelectedBlock, clearFocus} = useFocus(data, previewRef, e => {
      mousedown(e)
      closeDropdown()
    })
    const { mousedown, markLine } = useBlockDragger(focusData, lastSelectedBlock, data)
    const { commands } = useCommand(data, focusData)

    const buttons = [
      {label: '撤销', handler: () => {commands.undo()}},
      {label: '重做', handler: () => {commands.redo()}},
      {label: '导入', handler: () => {
        $dialog({
          title: '导入',
          content: '',
          footer: true,
          onConfirm: (content) => {
            commands.updateContainer(JSON.parse(content))
          }
        })
      }},
      {label: '导出', handler: () => {
        $dialog({
          title: '导出',
          content: JSON.stringify(data.value),
          footer: false
        })
      }},
      {label: '置顶', handler: () => {commands.placeTop()}},
      {label: '置底', handler: () => {commands.placeBottom()}},
      {label: '删除', handler: () => {commands.deleteBlocks()}},
      {label: () => previewRef.value ? '编辑' : '预览', handler: () => {
        previewRef.value = !previewRef.value
        clearFocus()
      }},
    ]
    let dropdownCtx = null
    const onContextmenu = (e, block) => {
      e.preventDefault()
      dropdownCtx = $dropdown({
        el: e.target,
        content: () => <div onClick={() => closeDropdown()}>
          <DropdownItem label="删除" onClick={() => {
            commands.deleteBlocks()
          }}></DropdownItem>
          <DropdownItem label="置顶" onClick={() => {commands.placeTop()}}></DropdownItem>
          <DropdownItem label="置底" onClick={() => {commands.placeBottom()}}></DropdownItem>
          <DropdownItem label="查看" onClick={() => {
            $dialog({
              title: '查看节点数据',
              content: JSON.stringify(block)
            })
          }}></DropdownItem>
          <DropdownItem label="导入" onClick={() => {
            $dialog({
              title: '导入节点数据',
              content: '',
              footer: true,
              onConfirm: (blockData) => {
                commands.updateBlock(JSON.parse(blockData), block)
              }
            })}}></DropdownItem>
          </div>
      })
    }
    const closeDropdown = () => {
      dropdownCtx && dropdownCtx.close()
      dropdownCtx = null
    }
    const onCanvasMounsedown = () => {
      canvasMounsedown()
      closeDropdown()
    }
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
          <div class="editor-top">
            {buttons.map(button => {
              const label = typeof button.label === 'function' ? button.label() : button.label
              return <button class="editor-top-btn" onClick={button.handler}>{label}</button>
            })}
          </div>
          <div class="editor-content">
            <div class="editor-canvas" style={canvasStyles.value}
            onMousedown={onCanvasMounsedown}
            ref={canvasRef}>
              {data.value.blocks.map((block, index) => {
                return <EditorBlock block={block}
                class={block.focus ? "block-focus" : ""}
                class={previewRef.value ? "editor-block-preview" : ""}
                onMousedown={e => blockMousedown(e, block, index)}
                updateBlock={(block) => updateBlock(block, index)}
                onContextmenu={e => onContextmenu(e, block, index)}>
                </EditorBlock>
              })}
              {markLine.x !== null && <div class="line-x" style={{top: markLine.x + 'px'}}></div>}
              {markLine.y !== null && <div class="line-y" style={{left: markLine.y + 'px'}}></div>}
            </div>
          </div>
        </div>
        <div class="editor-right">
          <EditorOperator block={lastSelectedBlock.value}
          data={data.value}
          updateContainer={commands.updateContainer}
          updateBlock={commands.updateBlock}></EditorOperator>
        </div>
      </div>
    )
  }
})