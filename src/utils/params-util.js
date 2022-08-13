/* eslint-disable */
/*
 * @Author: liruiqing@mediway.cn 
 * @Date: 2022-03-12 11:11:01 
 * @Last Modified by: liruiqing@mediway.cn
 * @Last Modified time: 2022-03-12 16:16:00
 */

const rules = {};

export const get = (type, vm, field) => {
	const params = vm.$route.query;
	const uid = vm.uid;
	for (const i in params) {
		if (`${type}.${uid}` === i) {
			return field
				? rules[type].parse(params[i])[field]
				: rules[type].parse(params[i]);
		}
	}
	return null;
};
export const clear = (type, vm) => {
	const uid = vm.uid;
	const query = { ...vm.$route.query };
	delete query[`${type}.${uid}`];
	if (JSON.stringify(query) !== JSON.stringify(vm.$route.query)) {
		vm.$router.replace({
			query,
		});
	}
};
export const set = (type, vm, params) => {
	const uid = vm.uid;
	const newQuery = { [`${type}.${uid}`]: rules[type].componentization(params) };
	return new Promise((resolve) => {
   
		if (Object.keys(newQuery).every((v) => vm.$route.query[v] == newQuery[v])) {
			resolve(params);
		} else {
			vm.$router.replace(
				{
					query: {
						...vm.$route.query,
						...newQuery,
					},
				},
				resolve(params)
			);
		}
	});
};
export const addRule = (type, rule) => {
	rules[type] = rule;
};

export default class {
	constructor(type, vm) {
		this.type = type;
		this.vm = vm;
	}
	get(field) {
		return get(this.type, this.vm, field);
	}
	set(params) {
		return set(this.type, this.vm, params);
	}
	clear() {
		return clear(this.type, this.vm);
	}
}
/* eslint-disable */