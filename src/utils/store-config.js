export const timestamp = 'biz.timestamp'
export const uid = 'biz.uid'
export const event = 'biz.event'
export const params = 'biz.params'

export function common(state, _params) {
  let _uid = 0
  if (_params && _params._uid) {
    _uid = _params._uid
    delete _params._uid
  }
  state[timestamp] = +new Date()
  state[uid] = _uid
  state[params] = _params
}
