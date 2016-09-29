if ('addEventListener' in document) {
		document.addEventListener('DOMContentLoaded', function() {
				FastClick.attach(document.body);
		}, false);
}

// Avoid `console` errors in browsers that lack a console.
(function() {
		var method;
		var noop = function () {};
		var methods = [
			'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
			'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
			'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
			'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
		];
		var length = methods.length;
		var console = (window.console = window.console || {});

		while (length--) {
			method = methods[length];

			// Only stub undefined methods.
			if (!console[method]) {
					console[method] = noop;
			}
		}
}());

/**
 * ScrollFix v0.1
 * http://www.joelambert.co.uk
 *
 * Copyright 2011, Joe Lambert.
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

var ScrollFix = function(elem) {
	// Variables to track inputs
	var startY, startTopScroll;
	
	elem = elem || document.querySelector(elem);
	
	// If there is no element, then do nothing  
	if(!elem)
		return;

	// Handle the start of interactions
	elem.addEventListener('touchstart', function(event){
		startY = event.touches[0].pageY;
		startTopScroll = elem.scrollTop;
		
		if(startTopScroll <= 0)
			elem.scrollTop = 1;

		if(startTopScroll + elem.offsetHeight >= elem.scrollHeight)
			elem.scrollTop = elem.scrollHeight - elem.offsetHeight - 1;
	}, false);
};


// Window Social
var popupCenter = function(url, title, w, h) {
		var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
		var dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;

		var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
		var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

		var left = ((width / 2) - (w / 2)) + dualScreenLeft;
		var top = ((height / 3) - (h / 3)) + dualScreenTop;

		var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

		if (newWindow && newWindow.focus) {
				newWindow.focus();
		}
};



$(function() {
  $('.scroll-to').on('click', function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });
});



$(function() {
	var root = document.documentElement;
	root.className += ' js';

	function boxTop(idBox) {
		var boxOffset = $(idBox).offset().top;
		return boxOffset;
	}

	$(document).ready(function() {
		var $target = $('.animated'),
		animationClass = 'init',
		windowHeight = $(window).height(),
		offset = windowHeight - (windowHeight / 4);

		function animeScroll() {
			var documentTop = $(document).scrollTop();
			$target.each(function() {
				if (documentTop > boxTop(this) - offset) {
					$(this).addClass(animationClass);
				} else {
					$(this).removeClass(animationClass);
				}
			});
		}
		animeScroll();

		$(document).scroll(function() {
			animeScroll();
		});
	});
});


var SPMaskBehavior = function (val) {
	return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00000';
},
spOptions = {
	onKeyPress: function(val, e, field, options) {
		field.mask(SPMaskBehavior.apply({}, arguments), options);
	}
};

