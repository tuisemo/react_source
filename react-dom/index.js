const ReactDom = {
	render,
	setAttribute
}
// 渲染
function render(vnode, container) {
	// 如果vnode是字符串
	if (typeof vnode === 'string') {
		const textNode = document.createTextNode(vnode)
		return container.appendChild(textNode)
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
	return container.appendChild(dom)

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