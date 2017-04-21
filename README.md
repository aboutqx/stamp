#notes

切换场景注意取消事件绑定和cancelAnimationFrame

原生css动画比TweenMax流畅，硬件要求低,TweenMax的cssPlugin会引起[reflow](https://developers.google.com/web/fundamentals/performance/rendering/avoid-large-complex-layouts-and-layout-thrashing#avoid-forced-synchronous-layouts)

先进行其他操作，最后再进行classList的加减，防止强制重新布局

flexbox比其它布局更快

观察timeline面板中的requestAnimationFrame触发过程之间的时间和执行事件所需的时间，来分析fps低的原因
在animationFrame的16ms里进行任务，能保证60fps，使用scheduler.js

浏览器图片请求优先级：(资源请求和解析都是异步，除了js)
	1.页面中img标签
	2.js执行的xhr，或者新建标签
	3.css中的背景图
   因此，重要图片直接放在页面html中，次重要放在js的assets-loader中，待assets-loader完成加载再显示页面

js执行完-》domcententloaded触发-》加载css和xhr等外部资源-》finished


png有损压缩能减小很多size,css sprtie优于base64，base64体积会大1/3，会阻塞css的解析

getElementsByClassName 比 querySelectorAll 更快,原生js比jquery快
