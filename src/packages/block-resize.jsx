import { defineComponent } from "vue";

export default defineComponent({
  props: {
    block: {type: Object},
    component: {type: Object},
    updateBlock: {type: Function}
  },
  setup(props) {
    let data = {}
    const { width, height } = props.component.resize || {}
    const onMousemove = (e) => {
      let {clientX, clientY} = e
      let {direction} = data
      let width = data.startWidth,
      height = data.startHeight,
      left = data.startLeft,
      top = data.startTop
      if (direction.x === 'center') {
        clientX = data.startX
      }
      if (direction.y === 'center') {
        clientY = data.startY
      }
      const dx = clientX - data.startX
      const dy = clientY - data.startY
      if (direction.x === 'start') {
        width = data.startWidth - dx
        left = data.startLeft + dx
      }
      if (direction.x === 'end') {
        width = data.startWidth + dx
      }
      if (direction.y === 'start') {
        height = data.startHeight - dy
        top = data.startTop + dy
      }
      if (direction.y === 'end') {
        height = data.startHeight + dy
      }
      props.updateBlock({
        ...props.block,
        width,
        height,
        left,
        top
      })
    }
    const onMouseup = () => {
      document.removeEventListener('mousemove', onMousemove)
      document.removeEventListener('mouseup', onMouseup)
    }
    const onMousedown = (e, direction) => {
      console.log('rops.block', props.block)
      e.stopPropagation()
      data = {
        startX: e.clientX,
        startY: e.clientY,
        startWidth: props.block.width,
        startHeight: props.block.height,
        startLeft: props.block.left,
        startTop: props.block.top,
        direction
      }
      document.addEventListener('mousemove', onMousemove)
      document.addEventListener('mouseup', onMouseup)
    }
    return () => <>
      {width && <>
      <div class="block-resize block-resize-left" onMousedown={e => onMousedown(e, {x: 'start', y: 'center'})}></div>
      <div class="block-resize block-resize-right" onMousedown={e => onMousedown(e, {x: 'end', y: 'center'})}></div>
      </>}
      {height && <>
      <div class="block-resize block-resize-top" onMousedown={e => onMousedown(e, {x: 'center', y: 'start'})}></div>
      <div class="block-resize block-resize-bottom" onMousedown={e => onMousedown(e, {x: 'center', y: 'end'})}></div>
      </>}
      {(width && height) && <>
      <div class="block-resize block-resize-top-left" onMousedown={e => onMousedown(e, {x: 'start', y: 'start'})}></div>
      <div class="block-resize block-resize-top-right" onMousedown={e => onMousedown(e, {x: 'end', y: 'start'})}></div>
      <div class="block-resize block-resize-bottom-left" onMousedown={e => onMousedown(e, {x: 'start', y: 'end'})}></div>
      <div class="block-resize block-resize-bottom-right" onMousedown={e => onMousedown(e, {x: 'end', y: 'end'})}></div>
      </>}
    </>
  }
})