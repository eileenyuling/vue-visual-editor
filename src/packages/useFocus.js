import {computed, ref} from 'vue'
export default function useFocus(data, previewRef, callback) {
  const selectedIndex = ref(-1)
  const lastSelectedBlock = computed(() => {
    return data.value.blocks[selectedIndex.value]
  })
  const blockMousedown = (e, block, index) => {
    if (previewRef.value) {
      return
    }
    e.stopPropagation()
    e.preventDefault()
    if (e.shiftKey) {
      if (focusData.value.focus.length === 1) {
        block.focus = true
      } else {
        block.focus = !block.focus
      }
      //
    } else {
      if (!block.focus) {
        clearFocus()
        block.focus = true
      }
    }
    block.width = e.target.offsetWidth
    block.height = e.target.offsetHeight
    block.top = e.target.offsetTop
    block.left = e.target.offsetLeft
    selectedIndex.value = index
    callback(e)
  }

  const focusData = computed(() => {
    const focus = []
    const unfocus = []
    data.value.blocks.forEach(block => (block.focus ? focus : unfocus).push(block))
    return {
      focus,
      unfocus
    }
  })

  const canvasMounsedown = () => {
    clearFocus()
  }
  const clearFocus = () => {
    data.value.blocks.forEach(block => block.focus = false)
    selectedIndex.value = -1
  }
  return {
    blockMousedown,
    focusData,
    canvasMounsedown,
    lastSelectedBlock,
    clearFocus
  }
}
