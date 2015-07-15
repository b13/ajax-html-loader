var B = B || {};


require([
	'jquery',
	'ajax-html-loadere'
], function($, AjaxLoader){

	function initialize(){

		$('mJS_ajaxLoader').each(function(){
			new AjaxLoader(this);
		});

	}

	// document ready
	$(function() {
		initialize();
	});

	return B;

});