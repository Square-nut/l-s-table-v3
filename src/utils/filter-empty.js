export default function (params) {
	if (!params) return {};
	const _params = JSON.parse(JSON.stringify(params));
	for (let i in _params) {
		if (_params[i] === '') {
			delete _params[i];
		}
	}
	return _params;
}
