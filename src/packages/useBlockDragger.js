export default function useBlockDragger(focusData) {
  let moved = false
  const mousedown = (e) => {
    moved = false
    dragState = {
      startX: e.clientX,
      startY: e.clientY,
      startPos: focusData.value.focus.map(({top, left}) => ({top, left}))
    }
    document.addEventListener('mousemove', mousemove)
    document.addEventListener('mouseup', mouseup)
  }
  let dragState = {
    startX: 0,
    startY: 0,
    startPos: []
  }
  const mousemove = (e) => {
    moved = true
    let {clientX: moveX, clientY: moveY} = e
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
    moved
  }
}