// export default function(value){
//   console.log('log render-label this:',this)
//   return typeof value === 'string'? value: '列'+i
//   // return typeof value === 'string'? value: value({}, this.$createElement)
// }
export default class {
	constructor() {
		this.i = 0;
	}
	getLabel(value) {
		this.value = value;
		return typeof this.value === 'string' ? this.value : '自定义列' + ++this.i;
	}
}
