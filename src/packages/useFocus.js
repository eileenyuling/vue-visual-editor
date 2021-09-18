import {computed} from 'vue'
export default function useFocus(data, callback) {
  const blockMousedown = (e, block) => {
    e.stopPropagation()
    e.preventDefault()
    if (e.shiftKey) {
      if (focusData.value.length === 1) {
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
      // block.focus = !block.focus
    }
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
    canvasMounsedown
  }
}
