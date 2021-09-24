import {computed, ref} from 'vue'
export default function useFocus(data, callback) {
  const selectedIndex = ref(-1)
  const lastSelectedBlock = computed(() => {
    return data.value.blocks[selectedIndex.value]
  })
  const blockMousedown = (e, block, index) => {
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
  }
  return {
    blockMousedown,
    focusData,
    canvasMounsedown,
    lastSelectedBlock
  }
}
