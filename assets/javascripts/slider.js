// g360 sLogos 1.0
// (C) 2018 Tobias Gerlach
// tobias@gerlach360.de
// http://gerlach360.de

(function () {
  
    "use strict";
	
	var maxEl;
	var maximumOut = 6;
	var loops = 0;
	var timegap = 2000;
	var waitToRestart = 600; // should match to css transition duration
	var refreshIntervalId;
	var screenWidth;
	var screenHeight;
	var slHolder = document.getElementById("g360_logoslider");
	var els = slHolder.getElementsByTagName('li');
	var ul = document.getElementById("lsul");
	var numOfEls = els.length;
	var logoslW;
	var elW;
	var ulW;
	var ulW_orig;
	var waitTime;

	screenWidth = window.innerWidth;
	screenHeight = window.innerHeight;
	logoslW = slHolder.clientWidth;
	
	if(numOfEls<maximumOut) {
		maximumOut = numOfEls;
	} 

	if(logoslW <= 500) {
		maxEl = 2;
	  } else if (logoslW <= 812) {
		maxEl = 4;
	  } else {
		maxEl = maximumOut;
	  }
	

	elW = Math.round(logoslW/maxEl);
	ulW = numOfEls*elW;
	ulW_orig = numOfEls*elW;
	ul.style.width = ulW+"px";

	for(var i = 0; i < numOfEls; i++){
	  //do something to each div
	  els[i].id = 'slide_'+i;
	  els[i].style.width = elW+"px";
	  els[i].style.height = elW+"px";
	}

	initSlider();

	// Listen for orientation changes
	window.addEventListener("orientationchange", function() {
	  clearInterval(refreshIntervalId);
		initSlider();
	}, false);

	// Listen for resize changes
	window.addEventListener("resize", function() {
	  clearInterval(refreshIntervalId);
		initSlider();
	}, false);
	
	// when window in background, stop interval
	window.onblur = function() {
		//console.log("onblur event detected!");
		clearInterval(refreshIntervalId);
		loops = 0;
	};
	
	// when window back in focus, restart interval
	window.onfocus = function() {
		//console.log("onfocus event detected!");
		initSlider();
	};
	
	function initSlider() {
		
		// reset & remove clones
		
		loops = 0;
		ul.style.left = 0;
		var paras = document.getElementsByClassName('clone');
		while(paras[0]) {
			paras[0].parentNode.removeChild(paras[0]);
		}

		slHolder = document.getElementById("g360_logoslider");
		els = slHolder.getElementsByTagName('li');
		ul = document.getElementById("lsul");
		numOfEls = els.length;

		screenWidth = window.innerWidth;
		screenHeight = window.innerHeight;
		logoslW = slHolder.clientWidth;
		
		if(numOfEls < maximumOut) {
			maximumOut = numOfEls;
		}

		if(logoslW <= 500) {
			maxEl = 2;
		} else if (logoslW <= 812) {
			maxEl = 4;
		} else {
			maxEl = maximumOut;
		}

		elW = Math.round(logoslW/maxEl);
		ulW = numOfEls*elW;
		ulW_orig = numOfEls*elW;
		ul.style.width = ulW+"px";

		for(var i = 0; i < numOfEls; i++){
			//again: do something to each div
			els[i].style.width = elW+"px";
			els[i].style.height = elW+"px";
		}
		
		ul.className += "ease";
		
		startInterval();
		
	}

	function startInterval() {
		loops = 0;
		ul.style.left = '0px';
		refreshIntervalId = setInterval(doSlide, timegap); // every X Sec 
	}

	function doSlide(){

		loops++;
		ul.className = "ease";
		
		var sleft = ul.offsetLeft;
		var elsGone = -(sleft/elW);
		var elsCome = numOfEls-elsGone;
		var elsMissing = Math.round((maxEl-elsCome)+1);

		if(elsCome <= maxEl) {

			// clone elements
			var toCln = document.getElementById("slide_"+(elsMissing-1));
			var cln = toCln.cloneNode(true);
			cln.id="clone_"+elsMissing;
			cln.className += "clone";
			ul.style.width = (ulW+(elW*elsMissing))+"px"; // breite anpassen
			ul.appendChild(cln); // push clone to end

			if(loops === numOfEls) {
				//console.log("last");
				myMove('last'); // last regular slide
			} else {
				myMove();
			}
		
		} else {
			myMove();
		}
	}


	function myMove(last) {

		var startAt = ul.offsetLeft; // current leftPos
		var shouldGo = startAt-elW; // go there
		ul.style.left = shouldGo + 'px'; 
		
		if(last) {	
			waitTime = setTimeout(reStart, waitToRestart); // wait for slide finish
		}
	}
	
	function reStart() {
		
		ul.classList.remove("ease");
		
		var paras = document.getElementsByClassName('clone');
        while(paras[0]) {
          paras[0].parentNode.removeChild(paras[0]);
        }
        
        loops = 0;
        ul.style.left = '0px';
		clearTimeout(waitTime);
		
	}	
	
}());
