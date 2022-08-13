import { isPromise, isFunction } from '../../utils/get-type'


/**
 * form.submit
 * form.reset
 * form.search
 */

function runCommand(commands) {
  if (commands.length === 0) return
  const command = commands.shift().split('.')
  const provide = this[command[0].toLocaleUpperCase() + `_PROVIDE`]

  if (provide && isFunction(provide[command[1]])) {
    const result = provide[command[1]]()
    if (isPromise(result)) {
      this.loading = true
      return result.then(() => {
        this.loading = false
        return runCommand.call(this, commands)
      }).finally(() => {
        this.loading = false
      })
    } else {
      return runCommand.call(this, commands)
    }
  }
}

export default {
  name: 'HosBizButton',
  data() {
    return {
      loading: false
    }
  },
  props: {
    run: {
      type: String | Array
    },
  },
  inject: {
    FORM_PROVIDE: {
      default: null
    }
  },
  render(h) {
    const props = { ...this.$attrs }
    const eventName = 'click'


    props.loading = this.loading
    const on = {
      [eventName]: val => {
        if (this.run) {
          runCommand.call(this, Array.isArray(this.run) ? this.run : [this.run])
        }

        if (isFunction(this.$listeners.click)) {
          const result = this.$listeners.click(val)
          if (isPromise(result)) {
            this.loading = true
            result.finally(() => {
              this.loading = false
            })
          }
        }
      }
    }

    return <hos-button props={props} on={on}>{this.$slots.default}</hos-button>
    
  }
}