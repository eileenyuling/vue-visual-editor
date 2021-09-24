import { reactive } from 'vue'
export default function useBlockDragger(focusData, lastSelectedBlock, data) {
  let dragState = {
    startX: 0,
    startY: 0,
    startPos: []
  }
  let markLine = reactive({
    x: null,
    y: null
  })
  const mousedown = (e) => {
    const {width: BWidth, height: BHeight, left: BLeft, top: BTop} = lastSelectedBlock.value
    dragState = {
      startX: e.clientX,
      startY: e.clientY,
      startLeft: BLeft,
      startTop: BTop,
      startPos: focusData.value.focus.map(({top, left}) => ({top, left})),
      lines: (() => {
        const lines = {x: [], y: []}
        const { unfocus } = focusData.value
        const arr = unfocus.concat([{
          left: 0,
          top: 0,
          width: data.value.container.width,
          height: data.value.container.height
        }])
        arr.forEach(({width: AWidth, height: AHeight, left: ALeft, top: ATop}) => {
          lines.x.push({showTop: ATop, top: ATop}) // 上上对齐
          lines.x.push({showTop: ATop, top: ATop - BHeight}) // 下上对齐
          lines.x.push({showTop: ATop + AHeight, top: ATop + AHeight }) // 上下对齐
          lines.x.push({showTop: ATop + AHeight, top: ATop + AHeight - BHeight}) // 下下对齐
          lines.x.push({showTop: ATop + AHeight / 2, top: ATop + AHeight / 2 - BHeight / 2}) // 中对齐

          lines.y.push({showLeft: ALeft, left: ALeft}) // 左左对齐
          lines.y.push({showLeft: ALeft + AWidth, left: ALeft + AWidth}) // 左右对齐
          lines.y.push({showLeft: ALeft, left: ALeft - AWidth}) // 右左对齐
          lines.y.push({showLeft: ALeft + AWidth, left: ALeft + AWidth - BWidth}) // 右右对齐
          lines.y.push({showLeft: ALeft + AWidth / 2, left: ALeft + AWidth / 2 - BWidth / 2}) // 中对齐
        })
        return lines
      })()
    }
    document.addEventListener('mousemove', mousemove)
    document.addEventListener('mouseup', mouseup)
  }

  const mousemove = (e) => {
    let {clientX: moveX, clientY: moveY} = e
    // 计算当前元素最新的left和top
    // 鼠标移动后 - 鼠标移动前 + left
    let left = moveX - dragState.startX + dragState.startLeft
    let top = moveY - dragState.startY + dragState.startTop
    let lineX = null
    const x = dragState.lines.x
    for (let i = 0; i < x.length; i++) {
      if (Math.abs(top - x[i].top) < 1) {
        lineX = x[i].showTop
        break
      }
    }
    let lineY = null
    const y = dragState.lines.y
    for (let i = 0; i < y.length; i++) {
      if (Math.abs(left - y[i].left) < 1) {
        lineY = y[i].showLeft
        break
      }
    }
    markLine.x = lineX
    markLine.y = lineY
    const dx = moveX - dragState.startX
    const dy = moveY - dragState.startY
    focusData.value.focus.forEach((block, index) => {
      block.left = Number(dragState.startPos[index].left) + dx
      block.top = Number(dragState.startPos[index].top) + dy
    })
  }

  const mouseup = () => {
    document.removeEventListener('mousemove', mousemove)
    document.removeEventListener('mouseup', mouseup)
  }
  return {
    mousedown,
    markLine
  }
}