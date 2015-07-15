define('ajax-html-loader', [
], function(){

	function mergeObjects(){
		var newObj = {};

		for(var obj in arguments){
			for(var key in obj){
				newObj[key] = obj[key];
			}
		}

		return newObj;
	}

	var AjaxModule = function(el, opts){
		this.initialize(el, opts);
	};

	AjaxModule.prototype = {

		defaultOpts: {
			actionType           : 'append', 		//Also possible is replace
			sourceSelector       : 'bam_source',
			targetSelector       : 'bam_target',
			httpMethod           : 'GET',
			httpParams           : null, 			//It is possible to set a function here
			addLoaderClass       : true,
			loaderClass          : 'bam_laoder',
			loaderTargetSelector : 'body'
		},

		initialize: function(el, opts){
			this.el = el;
			this.opts = {};
		},

		getOptions: function(){

		},

		setOptions: function(opts){
			for(var key in opts) {
				this.opts[key] = opts[key];
			}
		}
	};

	return AjaxModule;

});