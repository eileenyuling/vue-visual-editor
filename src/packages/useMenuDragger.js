import { events } from "./events"

export default function useMenuDragger(canvasRef, data) {
  let currentComponent = null
    const dragenter = (e) => {
      e.dataTransfer.dropEffect = 'move'
    }
    const dragover = (e) => {
      e.preventDefault()
    }
    const dragleave = (e) => {
      e.dataTransfer.dropEffect = 'none'
    }
    const drop = (e) => {
      let blocks = data.value.blocks
      data.value = {
        ...data.value,
        blocks: [
          ...blocks,
          {
            left: e.offsetX,
            top: e.offsetY,
            zIndex: 1,
            key: currentComponent.key,
            alignCenter: true,
            props: {}
          }
        ]
      }
    }
    const dragstart = (e, component) => {
      currentComponent = component
      canvasRef.value.addEventListener('dragenter', dragenter)
      canvasRef.value.addEventListener('dragover', dragover)
      canvasRef.value.addEventListener('dragleave', dragleave)
      canvasRef.value.addEventListener('drop', drop)
      events.emit('start')
    }
    const dragend = () => {
      canvasRef.value.removeEventListener('dragenter', dragenter)
      canvasRef.value.removeEventListener('dragover', dragover)
      canvasRef.value.removeEventListener('dragleave', dragleave)
      canvasRef.value.removeEventListener('drop', drop)
      events.emit('end')
    }
    return {
      dragstart,
      dragend
    }
}