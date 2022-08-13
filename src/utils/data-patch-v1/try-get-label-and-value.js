/* eslint-disable */
/*
 * @Author: liruiqing@mediway.cn 
 * @Date: 2022-03-12 11:09:45 
 * @Last Modified by: liruiqing@mediway.cn
 * @Last Modified time: 2022-03-12 11:10:29
 */

// 没有规范时的临时替代方案,存在读取错误可能性
const DICT = [];

DICT.push({
	label: 'name',
	value: 'id',
});

DICT.push({
	label: 'name',
	value: 'code',
});

DICT.push({
	label: 'lable',
	value: 'value',
});

DICT.push({
	label: 'categoryName',
	value: 'id',
});

export default (data) => {
	if (!Array.isArray(data) || data.length === 0) return null;
	for (let i = 0, len = DICT.length; i < len; i++) {
		const { label, value } = DICT[i];
		if (data.every((v) => v.hasOwnProperty(label) && v.hasOwnProperty(value))) {
			return DICT[i];
		}
	}
	return null;
};
/* eslint-disable */