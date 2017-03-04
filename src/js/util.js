function getStyle(elem,name){
	//如果属性存在于style[]中，那么他已被设置了，并是最终的
	if(elem.style[name])
		return elem.style[name];
	//否则尝试ie的办法
	else if(elem.currentStyle)
		return elem.currentStyle[name];
	//或者w3c的方法，如果存在的话
	else if(window&&window.getComputedStyle){
		name=name.replace(/([A-Z])/g,"-$1");
		name=name.toLowerCase();
	    var s=window.getComputedStyle(elem,'');
		return s&&s.getPropertyValue(name);
	}//否则用户使用的是其他浏览器，返回null
	else return null;
}
function findAncestor (el, cls) {
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
}
module.exports={getStyle,findAncestor};