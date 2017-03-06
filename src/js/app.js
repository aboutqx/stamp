import '../scss/main.scss';
import './preventTopMargin';

import AssetsLoader from 'assets-loader';
import HandleScroll from './HandleScroll';
import SwitchScene from './SwitchScene';
import Scheduler from  'scheduling';
import { TweenMax,TimelineMax } from 'gsap';

let ua = navigator.userAgent.toLowerCase().toString();
const detectBrowser = {
	isWechat:function() {
		return (/MicroMessenger/i).test(ua)
	},
	isNeteaseNes:function(){
		return (/newsapp/i).test(ua)
	}
};

(function(){
    if (!(ua.indexOf('newsapp') > -1)) {//是
        $(".main_share_btn").show();
        $('.gentie').addClass('newsapp');

    }else{
        $(".main_share_btn").hide();
        $('.gentie').removeClass('newsapp');
    }
})()
const assets = [
	{ id:'moveBg', url:'http://img1.cache.netease.com/f2e/news/dada_stamp/dist/distImg/bs12-move.png' },
];
	
window.getAsset = function(id) {	return window.assets.find( (a) => a.id === id).file;	}

if(document.body) {
	_loadAnimation();
} else {
	window.addEventListener('DOMContentLoaded', _loadAnimation);	
}

function _loadAnimation () {
	let loader = document.querySelector('.Loading-Bar');
	let loaderText = document.querySelector('.loader-text');
	let loaderWrapper = document.querySelector('.loader-wrapper');


	let number = {
		var:0
	}
	let t = new TimelineMax();
	t.fromTo(loaderWrapper, 3, {
	    yPercent: 80,
	    skewY: -50
	}, {
	    yPercent: 0,
	    skewY: 0,
	    ease: Expo.easeOut
	}).fromTo(loaderText, 3, {
        yPercent: 400,
        opacity:1
    }, {
        yPercent: 0,
        ease: Expo.easeOut
    }, "-=3").to(loaderWrapper, 2.5, {
        scale: .8,
        ease: Expo.easeOut
    }, "-=1.2").to(loaderWrapper,3,{

		 yPercent: -450,
		 ease: Expo.easeIn,
		 onComplete:() => {
			document.body.removeChild(loader)
			_init()
		}
	}, "-=2.2").to(loaderWrapper,3,{
		skewY: 30,
	}, "-=1.7").to(loader,2,{
		
		opacity:0
		
	},"-=2.2")
	TweenMax.to(number,3,{
		var:50,
		onUpdate:() => document.querySelector('.text').innerHTML = 2 * Math.ceil(number.var),

	})
}

function _init() {
	let music = document.querySelector('audio');
	
	window.addEventListener('touchstart',()=>{
		document.querySelector('.click-wrapper').classList.add('fade');
		music.play()
	})
	document.addEventListener("visibilitychange",()=>{
		document.hidden ? music.pause() : music.play()
	})
	//	LOADING ASSETS
	if(assets.length > 0) {

		let loader = new AssetsLoader({
			assets:assets
		}).on('error', function (error) {
			console.error(error);
		}).on('progress', function (p) {
			
			
		}).on('complete', _onImageLoaded)
		.start();


	} else {
		_onImageLoaded()
	}

}

function _onImageLoaded(o) {
	//	ASSETS
	//此时页面中img已经加载
	console.log('Image Loaded : ', o);
	window.assets = o;

	let smallStamp = document.getElementsByClassName('s-stamp');
	let container = document.querySelector('.container');
	let stampList = document.querySelector('.stamp-list');


	document.querySelector('.b-stamp11 .move').style.backgroundImage ='url(http://img1.cache.netease.com/f2e/news/dada_stamp/dist/distImg/bs12-move.png)'
	

	setTimeout(()=> {
		document.body.classList.add('loaded');

		_addIconAnimation();
		
		document.querySelector('.about-btn').addEventListener('touchstart',_toggleAbout)
		document.querySelector('.share-btn').addEventListener('click',()=>{
			h5Share.share();
			neteaseTracker( false, "http://click.dada.163.com/dada_stamp/share/weixin", "", "dadaclick" );
		})
		document.querySelector('.continue-btn').addEventListener('click',_toggleAbout)

		let handleScroll=new HandleScroll(container,stampList,document.querySelector('.stamp-mask'),smallStamp);
		new SwitchScene(stampList,handleScroll,container)
		handleScroll.start()
	}, 50);

	// var supportsMixBlendMode = window.getComputedStyle(document.body).mixBlendMode;
	// if(supportsMixBlendMode) document.body.classList.add('support-blend')
	// if(detectBrowser.isWechat()) document.body.classList.remove('support-blend')


	// let gifs = [{},{path:'img/bs2.gif'},{path:'img/bs3.gif'},{path:'img/bs4.gif'},{path:'img/bs5.gif'}],bstamp=document.getElementsByClassName('b-stamp');
	// for(let i=0;i<gifs.length;i++){
	// 	if(gifs[i].path){
	// 		Scheduler.defer(function() {
	// 			let img = new Image();
	// 			img.onload = function() {
	// 				bstamp[i].querySelector('.bstamp-img').appendChild(img)
	// 			}
	// 			img.src = gifs[i].path;
	// 		})
	// 	}	
	// }
}


function _addIconAnimation() {
	let t = new TimelineMax({repeat:-1}),r=document.querySelector('.arrow-right-wrapper'),
	  l = document.querySelector('.arrow-left-wrapper')

	t.fromTo(r, 2, {
	    xPercent: 0,
	}, {
	    xPercent: 40,
	    ease:Elastic.easeOut.config(1, 0.3)
	})
	.to(r,1,{
		xPercent: 0,
		ease: Expo.ease
	})
	.fromTo(l, 2, {
	    xPercent: 0,
	}, {
	    xPercent: -40,
	    ease:Elastic.easeOut.config(1, 0.3)
	},'-=3')
	.to(l,1,{
		xPercent: 0,
		ease: Expo.ease
	})

}
let aboutDafault = false,aboutPage = document.getElementById('about-page'),aboutBtn = document.querySelector('.about-btn');
function  _toggleAbout() {
	if(!aboutDafault){
		//show page
		aboutPage.classList.add('flex')
		aboutDafault = true;
		aboutBtn.classList.add('show')
	} else{
		//hide page
		aboutPage.classList.remove('flex')
		aboutDafault = false;
		aboutBtn.classList.remove('show')
	}
}