<template>
<Editor v-model="state"></Editor>
</template>

<script>
import { ref } from '@vue/reactivity'
import data from './data.json'
import Editor from './packages/editor.jsx'
import { registerConfig as config} from './utils/editor-config.jsx'
import { provide } from '@vue/runtime-core'
export default {
  components: {
    Editor
  },
  setup() {
    provide('config', config)
    const state = ref(data)
    return {
      state
    }
  }
}
</script>

<style>
body {
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
