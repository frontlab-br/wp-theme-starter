jQuery(document).ready(function(){'use strict',
	jQuery('#post-formats-select input').change(checkFormate);
	function checkFormate(){
		var formate = jQuery('#post-formats-select input:checked').attr('value');
		if(typeof formate != 'undefined'){
			jQuery('div[id^=format-]').hide();
			jQuery('div[id^=format-'+formate+']').stop(true,true).fadeIn(600);
		}
	}
	jQuery(window).load(function(){'use strict', checkFormate(); })
});