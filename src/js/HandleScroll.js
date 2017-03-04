//handleScroll.js
import Scheduler from  'scheduling';


const getMouse = function (mEvent, mTarget) {

	const o = mTarget || {};
	if(mEvent.touches) {
		o.x = mEvent.touches[0].pageX;
		o.y = mEvent.touches[0].pageY;
	} else {
		o.x = mEvent.clientX;
		o.y = mEvent.clientY;
	}

	return o;
};
const getBorder = function(dom){
	let t = dom.getBoundingClientRect();
	return {
		left:t.left,
		right:t.right
	}
}
class HandleScroll{
	constructor(container,targetList,mask,smallStamp){
		this._listenerTarget = container;
		this._stampList = targetList;
		this._smallStamp = smallStamp;
		this._mask = mask;
		this._mouse = {x:0};
		this._preMouse = {x:0};
		this._down=false;
		this._curIndex = 0;
		this._startTime = 0;
		this._endTime = 0;
		this._tx = 0;
		this._targetTX = 0;
		this._preTX = 0;
		this.moveSpeed = .12;
		this.moveSensitivity = 1.5;
		this.timer = null;
		this._rightLimit = 5731;//this._stampList.clientWidth
		this._stampWidth = 482;//避免强制同步布局事件的发生
		this._stampRight = 31;
		this.onDown = this._onDown.bind(this);
		this.onMove = this._onMove.bind(this);
		this.onUp = this._onUp.bind(this);
	
		this._maskLeft = getBorder(this._mask).left;
		this._maskRight = getBorder(this._mask).right;

		this.tipLeft = document.querySelector('.arrow-left');
		this.tipRight = document.querySelector('.arrow-right');
		
	}

	start(){
		this._addListener();
		this.scrollFrame = Scheduler.addEF(() => this._loop());
	}

	stop(){
		this._removeListener();
		Scheduler.removeEF(this.scrollFrame)
	}

	_addListener(){
		if("ontouchstart"in window){
			this._listenerTarget.addEventListener('touchstart',  this.onDown);
			this._listenerTarget.addEventListener('touchmove',  this.onMove);
			window.addEventListener('touchend', this.onUp);
		} else {
			this._listenerTarget.addEventListener('mousedown', this.onDown);	
			this._listenerTarget.addEventListener('mousemove', this.onMove);	
			window.addEventListener('mouseup', this.onUp);
		}
	}

	_removeListener(){
		if("ontouchstart"in window){
			this._listenerTarget.removeEventListener('touchstart',  this.onDown);
			this._listenerTarget.removeEventListener('touchmove',  this.onMove);
			window.removeEventListener('touchend', this.onUp);
		} else {
			this._listenerTarget.removeEventListener('mousedown', this.onDown);	
			this._listenerTarget.removeEventListener('mousemove', this.onMove);	
			window.removeEventListener('mouseup', this.onUp);
		}
	}

	_onDown(e){
		getMouse(e, this._mouse);
		getMouse(e, this._preMouse);
		this._down=true;
		this._startTime = new Date().getTime();
		this._preTX = this._targetTX;
		//clearTimeout(this._timer)
		//this._mask.classList.remove('hide')

	}

	_onMove(e){
		getMouse(e, this._mouse);
		if(e.touches) { e.preventDefault(); }
		
		if(this._down){
			
			let diffX = (this._mouse.x - this._preMouse.x);
			this._targetTX = this._preTX + diffX*this.moveSensitivity;

			this._targetTX = this._setLimit(this._targetTX ,-(this._rightLimit*10/11+300),300)
		}
	}

	_onUp(e){
		
		if(this._down){
			this._down=false;
			this._endTime = new Date().getTime();

			let diffX = (this._mouse.x - this._preMouse.x);
			let result;
			//this._timer=setTimeout(()=>this._mask.classList.add('hide'),2.25)
			// console.log('diffX'+diffX)
			if(this._targetTX > 0) {
				this._goMask(0)
				return;
			} else if(this._targetTX < -(this._rightLimit*10/11)){
				this._goMask(this._smallStamp.length-1)
			}
			if(this._endTime - this._startTime < 300){

				if(diffX < 0){
					this._curIndex++
				} else if(diffX > 0){
					this._curIndex--
				} else {//click no transform
					return;
				}
				this._curIndex = this._setLimit(this._curIndex,0,this._smallStamp.length-1)
				this._goMask(this._curIndex)
				return;
			}
			for(let i=0;i<this._smallStamp.length;i++){
				if(diffX < 0){//向左
					
					let t = getBorder(this._smallStamp[i]);
					if(this._maskRight - t.left  > this._stampWidth/2 && t.left > this._maskLeft){
						result = i;
						break;
					}		
					
				} else if(diffX > 0){//向右
			
					let t = getBorder(this._smallStamp[i]);
					if(t.right - this._maskLeft> this._stampWidth/2){
						result = i;
						break;
					}
				
				} else result = this._curIndex;
			}
			if(!result) result = this._curIndex;
			console.log(result)
			this._goMask(result)

			// if(this._mouse.y - this._preMouse.y<500){//pure horizen

			// } else{
			// 	//go back
			// 	
			// 	this._goMask(this._curIndex)
				
			// }
		}

	}

	//make i stamp in screen center
	_goMask(mIndex){
		let t = this._smallStamp[mIndex];
		let move = mIndex*(this._stampWidth+this._stampRight)

		this._targetTX = -move;
		this._curIndex = mIndex;

		if(mIndex !== 0) {
			this.tipLeft.style.opacity=1;
		} else {
			this.tipLeft.style.opacity=0;
		}
		if(mIndex == 10){
			this.tipRight.style.opacity=0;
		} else {
			this.tipRight.style.opacity=1;
		}
	}

	_fullInMask(){
		let result=null;
		for(let i=0;i<this._smallStamp.length;i++){
			let t = getBorder(this._smallStamp[i]);
			
			if(t.left>this._maskLeft-50&&t.right<this._maskRight+50){
				result = i
			}
		}
		return result;
	}


	_halfPassMask(){
		//向左向右的halfpass不同
		let result=null;
		let diffX = (this._mouse.x - this._preMouse.x);
		// console.log('diffx'+diffX)
		
		if(diffX < 0){//向右
			for(let i=0;i<this._smallStamp.length;i++){
				let t = getBorder(this._smallStamp[i]);
				
				if(t.left - this._maskRight > this._stampWidth/2){
					result = i;
					break;
				}
			}
		} else if(diffX > 0){//向左
			for(let i=0;i<this._smallStamp.length;i++){
				let t = getBorder(this._smallStamp[i]);
				if(t.right - this._maskLeft> this._stampWidth/2){
					result = i;
					break;
				}
			}

		} else result = this._curIndex;
		
		return result;
	}

	//set class which is in mask
	_setMaskClass(){
		let i = this._fullInMask();
		let t = document.querySelector('.in-mask');

		if(i||i==0){
			if(!(t==this._smallStamp[i])){
				t&&t.classList.remove('in-mask');
				this._smallStamp[i].classList.add('in-mask');
				this._mask.classList.add('show-dot')
			}	
			
		} else {
			t&&t.classList.remove('in-mask');
			this._mask.classList.remove('show-dot')
		}
		
	}

	_loop(){

		this._easeNumber();

		this._setMaskClass();
		this._stampList.style.transform = 'translate3d('+this._tx+'px,0,0)';
		this._stampList.style.webkitTransform = 'translate3d('+this._tx+'px,0,0)';
		
		document.querySelector('.redline').style.transform = 'translate3d('+this._tx+'px,0,0)';
		document.querySelector('.redline').style.webkitTransform = 'translate3d('+this._tx+'px,0,0)';
	}

	_easeNumber(){
		//this._targetTX = this._setLimit(this._targetTX,-(this._stampList.clientWidth*10/11),0);
		
		this._tx += (this._targetTX- this._tx) * this.moveSpeed;	
		if(Math.abs(this._targetTX - this._tx) < 0.0001) {
			this._tx = this._targetTX;
		}
	}

	_setLimit(value,min,max){
		if(value > max ){
			value = max;
		}

		if(value < min){
			value = min;
		}
		return value;
	}

	get curIndex(){
		return this._curIndex
	}
}
export default HandleScroll;