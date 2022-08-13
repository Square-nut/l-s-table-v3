/*
 * @Author: liruiqing@mediway.cn 
 * @Date: 2022-03-12 10:58:52 
 * @Last Modified by: liruiqing@mediway.cn
 * @Last Modified time: 2022-06-09 17:16:25
 */
import Params, { addRule } from '../../utils/params-util';
export const COMPONENT_NAME = 'P';

const props = {
	uid: {
		default: 0,
	},
};

addRule(COMPONENT_NAME, {
	parse(params) {
		params = params.split('.');
		return {
			current: +params[0],
			size: +params[1],
		};
	},
	componentization(params) {
		return Object.keys(params)
			.map((v) => params[v])
			.join('.');
	},
});

export default {
	data() {
		return {
			timer: null,
			params: new Params(COMPONENT_NAME, this),
		};
	},
	props,
	render(h) {
		const props = { ...this.$attrs };
		const on = { ...this.$listeners };
		props.layout =
			props.layout || 'sizes, prev, pager, next, jumper, ->, total';
		props.current = this.params.get('current') || props.currentPage || 1;
		props.size = this.params.get('size') || props.pageSize || 10;
		
		on['current-change'] = (val) => {
			const query = {
				current: val,
				size: props.pageSize,
			};

			this.params.set(query).then(() => {
				this.$emit('current-change', val);
			});
		};

		on['size-change'] = (val) => {
			const query = {
				current: props.currentPage,
				size: val,
			};
			this.params.set(query).then(() => {
				this.$emit('size-change', val);
			});
		};
		return h('hos-pagination', {
			props,
			on,
		}, this.$slots.default);
	},
	methods: {
		getParams() {
			const current = this.params.get('current') || this.$attrs.currentPage || 1;
			const size = this.params.get('size') || this.$attrs.pageSize || 10;
			return Promise.resolve({ current, size });
		},
	},
};
