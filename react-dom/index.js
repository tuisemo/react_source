import Component from "./component";
const ReactDom = {
	render,
	setAttribute
}
// 渲染
function render(vnode, container) {
	return container.appendChild(_render(vnode))
}
function createComponent(comp, props) {
	let inst;
	// 如果是类组件，则返回创建实例，返回
	if (comp.prototype && comp.prototype.render) {
		inst = new comp(props)
	} else {
		// 如果是函数组件，则将其扩展成类组件，方便后面统一管理
		inst = new Component(props)
		inst.constructor = comp
		inst.render = function () {
			return this.constructor(props)
		}
	}
	return inst;

}
function _render(vnode, container) {
	if (vnode === undefined || vnode === null || typeof vnode === 'boolean') return;
	// 如果vnode是字符串
	if (typeof vnode === 'string') {
		const textNode = document.createTextNode(vnode)
		return textNode
	}
	// 如果tag是函数，则渲染组件
	if (typeof vnode.tag === 'function') {
		// 1.创建组件
		const component = createComponent(vnode.tag, vnode.attrs)
		// 2.设置组件属性
		setComponentProps(component, vnode.attrs)
		// 3.组件渲染的节点对象返回
		return component.base

	}

	// 如果vnode是虚拟DOM对象
	const { tag, attrs, childrens } = vnode
	const dom = document.createElement(tag)
	if (attrs) {
		Object.keys(attrs).forEach(key => {
			const value = attrs[key]
			setAttribute(dom, key, value)
		})
	}
	// 渲染子节点
	childrens.forEach(child => render(child, dom))
	return dom

}
// 设置属性
function setAttribute(dom, key, value) {
	// className转换为class
	if (key === 'className') {
		key = 'class'
	}
	// 如果是事件
	if (/on\w+/.test(key)) {
		// 转小写
		key = key.toLowerCase()
		dom[key] = value || ''
	} else if (key === 'style') {
		// style可能是string/object
		if (!value || typeof value === 'string') {
			dom.style.cssText = value || ''
		} else if (typeof value === 'object') {
			for (let k in value) {
				if (typeof value[k] === 'number') {
					dom.style[k] = value[k] || ''
				} else {
					dom.style[k] = value[k]
				}
			}
		}
	} else {
		// 其他属性
		if (key in dom) {
			dom[key] = value || ''
		}
		if (value) {
			// 更新值
			dom.setAttribute(key, value)
		} else {
			dom.removeAttribute(key)
		}
	}
}
export default ReactDom