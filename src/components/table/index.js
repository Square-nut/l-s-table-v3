/*
 * @Author: liruiqing@mediway.cn 
 * @Date: 2022-08-13 09:22:47 
 * @Last Modified by:   liruiqing@mediway.cn 
 * @Last Modified time: 2022-08-13 09:22:47 
 */

import SingleArray from '../../utils/single-array';
import { mapState } from 'vuex';
import { timestamp, uid, event, params } from '../../utils/store-config';

const props = {
	uid: {
		default: 0,
	},
	cols: {
		required: true,
		type: Array,
	},
	asyncSlot: {
		default: {},
	},
};


const tableColumnParser = (() => {
	const rules = [];
	return {
		_parse(props, h) {
			let config = {
				props,
				scopedSlots: {},
			};
			if (typeof props.prop === 'string') {
				props.prop = props.prop.trim();
			}

			for (let i = 0, result; i < rules.length; i++) {
				if ((result = rules[i].call(this, config, h))) {
					return result;
				}
			}
			return config;
		},
		parse(cols, h) {
			return cols.map((v) => {
				if( v._show === true) {
					
				}
				const props = { ...v };
				return h(
					'el-table-column',
					tableColumnParser._parse.call(this, props, h),
					Array.isArray(props.children)
						? tableColumnParser.parse.call(this, props.children, h)
						: undefined
				);
			});
		},
		add(fn) {
			rules.push(fn);
		},
	};
})();

function parseCustomNode(result, scope, h) {
	if (Array.isArray(result)) {
		return result.map((v) => parseCustomNode.call(this, v, scope, h));
	}
	return result;
}

/**
 * 自定义返回值解析器
 * 返回一个function,参数是sopce,createElement
 */
tableColumnParser.add(function ({ props, scopedSlots }, h) {
	if (typeof props.prop === 'function') {
		const func = props.prop;
		delete props.prop;
		scopedSlots.default = (scope) => {
			return parseCustomNode.call(this, func(scope, h), scope, h);
		};
	}
});

/**
 * 自定义表头解析器
 */
tableColumnParser.add(function ({ props, scopedSlots }, h) {
	if (typeof props.label === 'function') {
		const func = props.label;
		delete props.label;
		scopedSlots.header = (scope) => {
			return parseCustomNode.call(this, func(scope, h), scope, h);
		};
	}
});

/**
 * 动态slot解析
 */
tableColumnParser.add(function ({ props, scopedSlots }, h) {
	if (typeof props.slotName === 'string') {
		const func = this.asyncSlot[props.slotName]
		scopedSlots.default = scope => {
			let _func = typeof func === 'object'? func : func(scope, h)
		  return parseCustomNode.call(this, _func, scope, h);
		};
	}
});

/**
 * 多选框
 */
tableColumnParser.add(function ({ props, scopedSlots }, h) {
	if (props.type === 'checkbox') {
		const key = props.key || 'id';
		if (!Array.isArray(this.value)) {
			this.$emit('input', []);
		}
		const value = new SingleArray(this.value, key);

		scopedSlots.header = () => {
			if (this.$attrs.data.length === 0 || !Array.isArray(this.value)) return;
			const isAll = value.has(this.$attrs.data, true);
			const isIndeterminate = value.has(this.$attrs.data, false) && !isAll;
			return (
				<el-checkbox
					indeterminate={isIndeterminate}
					value={isAll}
					onInput={(isChecked) => {
						this.$emit(
							'input',
							value[isChecked ? 'add' : 'delete'](this.$attrs.data)
						);
					}}
				/>
			);
		};
		scopedSlots.default = (prop) => {
			return (
				<el-checkbox
					value={this.value.some((v) => v[key] === prop.row[key])}
					onInput={(isChecked) => {
						this.$emit('input', value[isChecked ? 'add' : 'delete'](prop.row));
					}}
				/>
			);
		};
	}
});

/**
 * 单选框
 */
tableColumnParser.add(function ({ props, scopedSlots }, h) {
	if (props.type === 'radio') {
		const key = props.key || 'id';
		scopedSlots.default = (prop) => {
			return (
				<el-radio
					label={prop.row[key]}
					value={this.value[key]}
					onInput={(value) => {
						this.$emit(
							'input',
							this.$attrs.data.filter((v) => v[key] === value)[0]
						);
					}}
				>
					{props.prop ? prop.row[props.prop] : <span style="display:none" />}
				</el-radio>
			);
		};
	}
});

export default {
	name: 'LTable',
	props,
	watch: {
		sTimestamp() {
			if (
				this.sUID === this.uid ||
				(this.sUID === 0 && this.sEvent === 'doLayout')
			) {
				if (this.$refs['el-table-lq']) this.$refs['el-table-lq'].doLayout()
			}
		},
	},
	computed:{
		...mapState({
			sTimestamp: (state) => state.table[timestamp],
			sUID: (state) => state.table[uid],
			sEvent: (state) => state.table[event],
		}),
	},
	render(h) {
		const props = { ...this.$attrs};

		const on = { ...this.$listeners };
		// 解析表格
		const cols = tableColumnParser.parse.call(this, this.cols, h);
		return h(
			'el-table',
			{
				ref: 'el-table-lq',
				attrs:{id: 'el-table-lq'},
				props,
				on,
			},
			cols
		);
	},
};
