//SwitchScene.js
import Scheduler from  'scheduling';
import {findAncestor,getStyle} from './util';

//transitionend fix From Modernizr 
function whichTransitionEvent(){
    var t;
    var el = document.createElement('fakeelement');
    var transitions = {
      'transition':'transitionend',
      'OTransition':'oTransitionEnd',
      'MozTransition':'transitionend',
      'WebkitTransition':'webkitTransitionEnd'
    }

    for(t in transitions){
        if( el.style[t] !== undefined ){
            return transitions[t];
        }
    }
}
function getTranslateX(obj)
{
    let style = getStyle(obj,'transform')|| getStyle(obj,'webkitTransform'),
        t = style.split(',')[0];

    return t.substr(12)
    //Return the value AS STRING (with the unit)
}

class SwitchScene{
	constructor(stampList,handleScroll,container){
		this._stampList = stampList;
		this._handleScroll = handleScroll;
		this._container = container;
		this._bstampList = document.querySelector('.bstamp-list');
		this._bstamp = document.getElementsByClassName('b-stamp');
		this._back = document.querySelector('.bstamp-back');
		this._bgs = document.getElementsByClassName('transfomr-bg');
		this._tip = document.getElementById('tip');

		this._isTransform = false;
		this._transParams = [{bgIndx:0,transIndex:0},{bgIndx:1,transIndex:1},{bgIndx:2,transIndex:2},{bgIndx:3,transIndex:3},
			{bgIndx:4,transIndex:4},{bgIndx:5,transIndex:5},{bgIndx:6,transIndex:2},{bgIndx:7,transIndex:6},{bgIndx:8,transIndex:7},
			{bgIndx:9,transIndex:9},{bgIndx:10,transIndex:8}
		]

		this._stampList.addEventListener('click',(e) => this._goBStamp(e))
		this._back.addEventListener('click',(e) => this._goStampList(e))
		this._container.addEventListener(whichTransitionEvent(),(e)=> this._transitionEnd(e))
	}

	_transitionEnd(e){
		if(!(e.target==this._container)) return;
		if(this._container.className.match(/change-scene/)){
			
			this._back.classList.remove('hide')
		} else if(this._container.classList.contains('back-scene')){
			this._handleScroll.start()
			this._container.classList.remove('back-scene');	
			this._tip.style.opacity = 1;
			this._isTransform = false;
		}
	}

	_goBStamp(e){
		// console.timeStamp('转场动画');
		let t;
		if(e.target.classList.contains('s-stamp')){
			t = e.target
		}else{
			t = findAncestor(e.target,'s-stamp')
		}
		if(!(t.classList.contains('in-mask'))||this._isTransform||this._container.classList.contains('back-scene')) return;
		document.querySelector('.click-wrapper')&&this._tip.removeChild(document.querySelector('.click-wrapper'))

		this._tip.style.opacity = 0;

		this._isTransform = true;
		this._handleScroll.stop()
		
		// document.querySelector('.transfomr-bg').classList.add('change-scene2');
		this._bstampList.classList.remove('hide');
		for(let i=0;i<this._bstamp.length;i++){
			this._hideElement(this._bstamp[i])
		}
		let index = this._handleScroll.curIndex;
		this._bstamp[index].classList.remove('hide')


		//do animation last

		this._container.classList.add('change-scene'+(this._transParams[index].transIndex+1));
		this._hideElement(this._bgs)
		this._showElement(this._bgs[this._transParams[index].bgIndx])
		
	}

	_goStampList(){
		
		this._hideElement(this._bstampList);
		this._hideElement(this._back);
		this._container.className='container back-scene';	
		
	}

	_hideElement(elem){
		if(elem.length>0){
			for(let i=0;i<elem.length;i++){
				if(!elem[i].classList.contains('hide')){
					elem[i].classList.add('hide');
				}
			}
		}else if(!elem.classList.contains('hide')){
			elem.classList.add('hide');
		}
	}

	_showElement(elem){
		if(elem.classList.contains('hide')){
			elem.classList.remove('hide');
		}
	}
}
export default SwitchScene;