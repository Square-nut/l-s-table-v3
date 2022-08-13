/* eslint-disable */
const getValue = (o, k) => {
	k.split('.').forEach((v) => {
		o = o[v];
	});
	return o;
};
export default (vm, path) => {
	const data = getValue(vm, path);
	const keys = Object.keys(data);
	keys.forEach((k) => {
		if (k.indexOf('TEMP_ARRAY_') === 0) {
			const arr = k.split('TEMP_ARRAY_')[1].split('_');
			vm.$watch(
				`${path}.${k}`,
				(newValue) => {
					arr.forEach((v) => {
						const val = Array.isArray(newValue)
							? newValue[arr.indexOf(v)]
							: newValue;
						if (val === null) {
							data[v] = undefined;
						} else if (data[v] !== val) {
							data[v] = val;
						}
					});
				},
				{
					immediate: true,
				}
			);
		}
	});
	return data;
};
/* eslint-disable */