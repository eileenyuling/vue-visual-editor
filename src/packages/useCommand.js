import { events } from "./events"
import _ from 'lodash'
import { onUnmounted } from "@vue/runtime-core"

export default function useCommand(data, focusData) {
  const state = {
    commandArray: [],
    commands: {},
    queue: [],
    current: -1,
    destoryArray: []
  }
  register({
    name: 'redo',
    keyboard: 'ctrl + y',
    execute() {
      return {
        redo(){
          const item = state.queue[state.current + 1]
          if (item) {
            item.redo && item.redo()
            state.current += 1
          }
        }
      }
    }
  })

  register({
    name: 'undo',
    keyboard: 'ctrl + z',
    execute() {
      return {
        redo(){
          const item = state.queue[state.current]
          if (item) {
            item.undo && item.undo()
            state.current -= 1
          }
        }
      }
    }
  })
  register({
    name: 'placeTop',
    pushQueue: true,
    execute() {
      const before = _.cloneDeep(data.value.blocks)
      const after = (() => {
        const maxZIndex = focusData.value.unfocus.reduce((prev, block) => {
          return Math.max(prev, block.zIndex)
        }, -Infinity) + 1
        focusData.value.focus.forEach(block => {
          block.zIndex = maxZIndex
        })
        return data.value.blocks
      })()

      return {
        redo() {
          data.value = {...data.value, blocks: after}
        },
        undo() {
          data.value = {...data.value, blocks: before}
        }
      }
    }
  })
  register({
    name: 'placeBottom',
    pushQueue: true,
    execute() {
      const before = _.cloneDeep(data.value.blocks)
      const after = (() => {
        let minZIndex = focusData.value.unfocus.reduce((prev, block) => {
          return Math.min(prev, block.zIndex)
        }, Infinity) - 1
        if (minZIndex < 0) {
          minZIndex = 0
          focusData.value.unfocus.forEach(block => {
            block.zIndex += 1
          })
        }
        focusData.value.focus.forEach(block => {
          block.zIndex = minZIndex
        })
        return data.value.blocks
      })()

      return {
        redo() {
          data.value = {...data.value, blocks: after}
        },
        undo() {
          data.value = {...data.value, blocks: before}
        }
      }
    }
  })
  register({
    name: 'deleteBlocks',
    pushQueue: true,
    execute() {
      const before = _.cloneDeep(data.value.blocks)
      const after = focusData.value.unfocus
      return {
        redo: () => {
          data.value = {...data.value, blocks: after}
        },
        undo: () => {
          data.value = {...data.value, blocks: before}
        }
      }
    }
  })
  register({
    name: 'updateContainer',
    pushQueue: true,
    execute(newValue) {
      let state = {
        before: _.cloneDeep(data.value),
        after: newValue
      }
      return {
        redo: () => {
          data.value = state.after
        },
        undo: () => {
          data.value = state.before
        }
      }
    }
  })
  register({
    name: 'updateBlock',
    pushQueue: true,
    execute(newValue, oldValue) {
      let state = {
        before: _.cloneDeep(data.value.blocks),
        after: (() => {
          const index = data.value.blocks.indexOf(oldValue)
          data.value.blocks.splice(index, 1, newValue)
          return data.value.blocks
        })()
      }
      return {
        redo: () => {
          data.value = {...data.value, blocks: state.after}
        },
        undo: () => {
          data.value = {...data.value, blocks: state.before}
        }
      }
    }
  })
  register({
    name: 'drag',
    pushQueue: true,
    init() {
      this.before = null
      events.on('start', () => {
        this.before = _.cloneDeep(data.value.blocks)
      })
      events.on('end', () => {
        state.commands.drag()
        return () => {
          events.off('start')
          events.off('drop')
        }
      })
    },
    execute() {
      const before = this.before
      const after = data.value.blocks
      return {
        redo(){
          data.value = {...data.value, blocks: after}
        },
        undo() {
          data.value = {...data.value, blocks: before}
        }
      }
    }
  })

  function register(command) {
    state.commandArray.push(command)
    state.commands[command.name] = (...args) => {
      const {redo, undo} = command.execute(...args)
      redo()
      if (command.pushQueue) {
        let { queue, current } = state
        if (queue.length > 0) {
          state.queue = queue.slice(0, current + 1)
        }
        state.queue.push({redo, undo})
        state.current = current + 1
      }
    }
  }

  const keyboardEvent = (() => {
    const keyCodes = {
      '90': 'z',
      '89': 'y'
    }
    const onkeydown = (e) => {
      let keyString = ''
      const { ctrlKey, keyCode } = e
      if (ctrlKey) {
        keyString += `ctrl + ${keyCodes[keyCode]}`
      }
      if (!keyString) {
        return
      }
      state.commandArray.forEach(command => {
        if (command.keyboard === keyString) {
          state.commands[command.name]()
          e.preventDefault()
        }
      })

    }
    const init = () => {
      window.addEventListener('keydown', onkeydown)
      return () => {
        window.removeEventListener('keydown', onkeydown)
      }
    }
    return init
  })();
  (() => {
    state.destoryArray.push(keyboardEvent())
    state.commandArray.forEach(command => {
      command.init && state.destoryArray.push(command.init())
    })
  })();
  onUnmounted(() => {
    state.destoryArray.forEach(fn => fn && fn())
  })
  return state
}
