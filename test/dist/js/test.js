require.config({
	paths: {
		"ajax-html-loader": "contrib/ajax-html-loader",
		requirejs: "contrib/require",
		jquery: "contrib/jquery"
	},
	packages: [

	]
});

var B = B || {};

require([
	'jquery',
	'ajax-html-loader'
], function($, AjaxLoader){

	function initialize(){

		$('.mJS_ajaxLoader').each(function(){
			new AjaxLoader(this);
		});

	}

	// document ready
	$(function() {
		initialize();
	});

	return B;

});