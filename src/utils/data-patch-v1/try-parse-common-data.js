/* eslint-disable */
/*
 * @Author: liruiqing@mediway.cn 
 * @Date: 2022-03-12 11:10:00 
 * @Last Modified by:   liruiqing@mediway.cn 
 * @Last Modified time: 2022-03-12 11:10:00 
 */

import tryGetOnlyArray from './try-get-only-array';
import tryGetPaginationParams from './try-get-pagination-params';
import {
	isArray,
	isObject,
	isFunction,
	isString,
	isPromise,
} from '../get-type';

const getValue = (o, k) => {
	k.split('.').forEach((v) => {
		o = o[v];
	});
	return o;
};

const parseRules = {
	default(resolve, reject, data, field) {
		resolve(field ? getValue(data, field) : data);
	},
	array(resolve, reject, data, field) {
		let result;
		if (isArray(data)) {
			resolve(data);
		} else if (isObject(data)) {
			result = field ? getValue(data, field) : tryGetOnlyArray(data).data;

			if (isString(result)) {
				try {
					result = JSON.parse(result);
				} catch {}
			}

			if (isArray(result)) {
				resolve(result);
			} else {
				reject('type error');
			}
		} else {
			reject('type error');
		}
	},
	table(resolve, reject, data, field) {
		let listField, totalField;

		if (isObject(field)) {
			listField = field.list;
			totalField = field.total;
		} else {
			listField = field;
		}

		parseRules.array(
			(array) => {
				resolve({
					list: array,
					total: totalField
						? getValue(data, totalField)
						: tryGetPaginationParams(data).total,
				});
			},
			reject,
			data,
			listField
		);
	},
};

export default (data, rule, api) => {
	if (rule)
		return new Promise((resolve, reject) => {
			const parseRule =
				parseRules[rule.toLocaleLowerCase()] || parseRules.default;

			let field;
			let promise;

			if (isFunction(data)) {
				data = data();
			}

			if (isString(data)) {
				const r = /(?:\()(.+)(?:\))/.exec(data);
				if (r && r.length >= 2) {
					data = data.replace(r[0], '');
					field = r[1];
				}

				const params = {};
				const tmpArr = data.split('?');
				if (tmpArr.length >= 2) {
					data = tmpArr[0];
					tmpArr[1].split('&').forEach((v) => {
						v = v.split('=');
						params[v[0]] = v[1];
					});
				}
				promise = api(data, params);
			}

			if (isPromise(data)) {
				promise = data;
			}

			if (isObject(data)) {
				/**
				 * api|url|data 请求地址 <String|Promise>
				 * field 数据字段
				 */
				const request = data.data || data.url || data.api;
				field = data.field;
				if (isPromise(request)) {
					promise = request;
				}
				if (isString(request)) {
					promise = api(data.api || data.url, data.params);
				}
			}

			if (promise) {
				promise.then(
					(response) => {
						parseRule(resolve, reject, response, field);
					},
					(err) => {
						reject(err);
					}
				);
			} else {
				parseRule(resolve, reject, data, field);
			}
		});
};
/* eslint-disable */