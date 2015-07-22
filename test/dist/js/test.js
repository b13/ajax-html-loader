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

		$('.mJS_ajaxLoaderWithHandlers').each(function(){
			new AjaxLoader(this,{
				beforeLoading: [
					function(){alert("BEFORE LOADING");}
				],
				ajaxSource: function(){
					var randomNumber = Math.floor(Math.random() * 10);
					if(randomNumber % 2 == 0) return "/ajax-source.html";
					return "/invalidPath.html";
				},
				onLoading: function(){alert("ON LOADING")},
				onLoadingSuccess: [
					function(){alert("ON LOADING SUCCESS")}
				],
				onLoadingError: function(){alert("ON LOADING ERROR")}

			})
		});

	}

	// document ready
	$(function() {
		initialize();
	});

	return B;

});