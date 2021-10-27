import { defineComponent } from 'vue'

const DropdownItem = defineComponent({
  props: {
    label: String
  },
  setup(props) {
    return () => {
      return <div class="dropdown-item">{props.label}</div>
    }
  }
})
export default DropdownItem