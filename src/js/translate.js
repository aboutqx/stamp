let t=$('.words'),l=18,i=0,o={p:0},flag=true;
function render(){
	requestAnimationFrame(render)
}

$(document).on('touchstart',function(){
	render()
	TweenMax.fromTo(o, .8, {
	    p: 0
	}, {
	    p: 1,
	    delay: .1,
	    ease: Power2.easeOut,
		onComplete: function() {
	        flag=false
	    }
	})
})