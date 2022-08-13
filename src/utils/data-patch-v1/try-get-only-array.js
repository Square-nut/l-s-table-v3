/* eslint-disable */
/*
 * @Author: liruiqing@mediway.cn 
 * @Date: 2022-03-12 11:09:53 
 * @Last Modified by: liruiqing@mediway.cn
 * @Last Modified time: 2022-03-12 11:10:23
 */

const keys = ['list', 'data'];

export const addMatchedPath = (result, key, basePath) => {
	const pi = basePath ? basePath + '.' + key : key;
	result.matched.hasOwnProperty(pi)
		? result.matched[pi]++
		: (result.matched[pi] = 1);
};

export const getDataByImportance = (data, result, field) => {
	const { matched } = result;

	const path = Object.keys(matched).sort((a, b) => matched[b] - matched[a])[0];

	if (path) {
		let tmp = data;
		path.split('.').forEach((v) => {
			tmp = tmp[v];
		});
		result.path = path;
		result[field] = tmp;
	} else {
		result.error = true;
	}
};

function getArrayFromJSON(json, result, basePath = '') {
	const tmpArray = [];
	const tmpJSON = [];
	const tmpArrayPath = [];
	const tmpJSONPath = [];
	let i, l, key;

	for (i = 0, l = keys.length; i < l; i++) {
		key = keys[i];
		if (Array.isArray(json[key])) {
			addMatchedPath(result, key, basePath);
		}
	}

	Object.keys(json).forEach((k) => {
		const v = json[k];
		if (isArray(v)) {
			addMatchedPath(result, k, basePath);
			tmpArrayPath.push(k);
			tmpArray.push(v);
		}
		if (isObject(v)) {
			tmpJSONPath.push(k);
			tmpJSON.push(v);
		}
	});

	if (tmpArray.length === 1) {
		addMatchedPath(result, tmpArrayPath[0], basePath);
	}

	if (tmpArray.length > 1) {
		for (i = 0, l = keys.length; i < l; i++) {
			key = keys[i];
			for (let j = 0; j < tmpArray.length; j++) {
				if (tmpArrayPath[j].includes(key)) {
					addMatchedPath(result, tmpArrayPath[j], basePath);
				}
			}
		}
	}

	for (let x in tmpJSON) {
		return getArrayFromJSON(
			tmpJSON[x],
			result,
			basePath ? basePath + '.' + tmpJSONPath[x] : tmpJSONPath[x]
		);
	}
}

import { isArray, isFunction, isObject, isString } from '../get-type';

export default (data) => {
	const result = {
		data: [],
		matched: {},
		path: '',
		error: false,
	};
	if (isArray(data)) {
		result.data = data;
		return result;
	}
	if (isFunction(data)) {
		data = data();
	}
	if (isString(data)) {
		try {
			data = JSON.parse(data);
		} catch (e) {
			result.error = true;
			return result;
		}
	}
	if (isObject(data)) {
		getArrayFromJSON(data, result);
	}

	getDataByImportance(data, result, 'data');

	// console.log('onlyArray', result)

	return result;
};
/* eslint-disable */