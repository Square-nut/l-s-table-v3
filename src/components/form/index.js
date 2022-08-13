/*
 * @Author: liruiqing@mediway.cn 
 * @Date: 2022-03-12 10:59:15 
 * @Last Modified by: liruiqing@mediway.cn
 * @Last Modified time: 2022-06-20 17:45:47
 */
import Params, { addRule } from '../../utils/params-util'
import { Base64 } from 'js-base64'
import { isFunction, isArray, isObject } from '../../utils/get-type'
import trySyncData from '../../utils/data-patch-v1/try-sync-data'

export const COMPONENT_NAME = 'F'

addRule(COMPONENT_NAME, {
	parse(params) {
		return JSON.parse(Base64.decode(params))
	},
	componentization(params) {
		return Base64.encode(JSON.stringify(params))
	}
})

const props = {
	uid: {
		default() {
			// 如果挂载到table下面，默认使用table的uid
			return this.TABLE_PROVIDE ? this.TABLE_PROVIDE.uid : 0
		}
	},
}

export default {
	render(h) {
		const props = { ...this.$attrs }
		const on = { ...this.$listeners }

		return h('hos-form', {
			ref: 'form',
			props,
			on,
			nativeOn: {
				submit(e) {
					e.preventDefault()
				}
			}
		},  this.$slots.default)

	},
	props,
	provide() {
		return {
			FORM_PROVIDE: this
		}
	},
	inject: {
		TABLE_PROVIDE: {
			default: null
		}
	},
	data() {
		return {
			params: new Params(COMPONENT_NAME, this),
			initialData: {},
		}
	},
	methods: {
		filterTempParams(params, isDelTempParams) {
			params = JSON.parse(JSON.stringify(params))
			if (isDelTempParams) {
				Object.keys(params).forEach(v => {
					if (v.indexOf('TEMP_ARRAY') === 0) {
						delete params[v]
					}
				})
			}
			return params
		},
		async getParams(isDeleteTempParams = true) {
			const valid = await this.$refs.form.validate()
			const params = this.filterTempParams(this.$attrs.model, isDeleteTempParams)
			return valid ? Promise.resolve(params) : Promise.reject(params)
		},
		submit() {
			return this.getParams().then(res => {
				if (isFunction(this.$listeners.submit)) {
					return this.$listeners.submit(res)
				}
			})
		},
		search() {
			return this.getParams(false).then(res => {
				this.params.set(res).then(() => {
					if (isFunction(this.$listeners.search)) {
						const params = this.filterTempParams(res, true)
						return this.$listeners.search(params)
					}
				})
			})
		},
		reset() {
			this.params.clear()
			this.$refs.form.resetFields()
			Object.keys(this.$attrs.model).forEach(prop => this.$attrs.model[prop] = this.initialData[prop])
			this.$emit('reset', this.$attrs.model)
		},
		clear() {
			this.params.clear()
			this.$refs.form.resetFields()
			Object.keys(this.$attrs.model).forEach(prop => {
				if (isObject(this.$attrs.model[prop])) {
					this.$attrs.model[prop] = {}
				} else if (isArray(this.$attrs.model[prop])) {
					this.$attrs.model[prop] = []
				} else {
					this.$attrs.model[prop] = ''
				}
			})
			this.$emit('reset', this.$attrs.model)
		}
	},
	created() {
		const query = this.params.get()
		Object.keys(this.$attrs.model).forEach(prop => {
			this.initialData[prop] = this.$attrs.model[prop]
			if (query && query[prop] !== undefined && this.$attrs.model[prop] !== query[prop]) {
				this.$attrs.model[prop] = query[prop]
			}
		})
		trySyncData(this, '$attrs.model')
	},
}