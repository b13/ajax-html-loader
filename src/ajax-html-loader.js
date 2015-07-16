define('ajax-html-loader', [
], function(){

	/**
	 * Function to merge objects without using additional libs or frameworks
	 * @returns {{}}
	 */
	function mergeObjects(){
		var newObj = {};

		for(var argumentIndex in arguments){
			var obj = arguments[argumentIndex];
			for(var key in obj){
				newObj[key] = obj[key];
			}
		}

		return newObj;
	}

	/**
	 * Constructor expects at least a DOM element and additionally some opts
	 * @param el
	 * @param opts
	 * @constructor
	 */
	var AjaxHTMLLoader = function(el, opts){
		this.initialize(el, opts);
	};

	AjaxHTMLLoader.prototype = {

		/**
		 * Mapping that defines which option can be fed by which html attribute
		 */
		attributeOptionsMapping: {
			actionType           : 'data-alaction',
			sourceSelector       : 'data-alsource',
			targetSelector       : 'data-altarget',
			httpMethod           : 'data-almthod',
			httpParams           : 'data-alparams',
			addLoader            : 'data-alloader',
			loaderClass          : 'data-alloaderclass',
			loaderTargetSelector : 'data-alloadertarget'
		},

		/**
		 * Default options that will be used if nothing else is defined.
		 */
		defaultOpts: {
			actionType           : 'append', 		//The other possible action is replace
			sourceSelector       : 'al_source',
			targetSelector       : 'al_target',
			httpMethod           : 'GET',
			httpParams           : null, 			//It is possible to set a function here
			addLoaderClass       : true,
			loaderClass          : 'al_loader',
			loaderTargetSelector : 'body'
		},

		/**
		 * Initialize function that is called by the "constructor"
		 * @param el
		 * @param opts
		 */
		initialize: function(el, opts){
			console.log("INIT");
			console.log(el);
			this.el = el;
			this.opts = mergeObjects(this.defaultOpts, this._getOptionsFromDataAttributes(), opts);

			this._bindEvents();
		},

		/**
		 * Bind events
		 * @private
		 */
		_bindEvents: function(){
			var ahl = this;
			// Bind event handlers to scope of the object
			var _boundHandleClickEvent = function(){
				ahl._handleClickEvent.apply(ahl, arguments);
			};

			if(this.el.addEventListener){ // W3C DOM
				this.el.addEventListener('click', _boundHandleClickEvent);
			}
			else if (this.el.attachEvent) { // IE DOM
				this.el.attachEvent('onclick', _boundHandleClickEvent);
			}
		},


		_handleClickEvent: function(evt){
			var opts = this.getOptions();

			evt.preventDefault();

			this.loadAjaxContent(
				opts,
				function(){
					alert("SUCCESS");
				},
				function(){
					alert("ERROR");
				}
			);
		},

		_createXHR: function(){
			var xhr;
			if (window.ActiveXObject){
				try
				{
					xhr = new ActiveXObject("Microsoft.XMLHTTP");
				}
				catch(e)
				{
					xhr = null;
				}
			}
			else{
				xhr = new XMLHttpRequest();
			}

			return xhr;
		},

		/**
		 * Extracts options from the html attributes based on the attributeOptionsMapping definition above.
		 * @returns {{}}
		 * @private
		 */
		_getOptionsFromDataAttributes: function(){
			var attributeOpts = {};

			for(var attrOpt in this.attributeOptionsMapping){
				var attributeName = this.attributeOptionsMapping[attrOpt],
					optVal        = this.el.getAttribute(attributeName);

				if(typeof optVal !== 'undefined' && optVal !== null && optVal !== ''){
					attributeOpts[attrOpt] = optVal;
				}
			}

			return attributeOpts;
		},

		getAjaxSource: function(){
			return this.el.getAttribute('href');
		},

		/**
		 * Copies the opts object and evaluates the functions that are given as opts
		 *
		 * @returns {{}|*}
		 */
		getOptions: function(){
			return mergeObjects(this.opts);
		},

		evalOptions: function(options){
			var evaluatedOpts = {};

			for(var optName in options){
				var opt = this.opts[optName];

				//If opt is a function evaluate it otherwhise copy it to the new opts object.
				evaluatedOpts[optName] = typeof opt === 'function' ? opt.call(this) : opt;
			}

			return evaluatedOpts;
		},

		/**
		 * Update the options
		 * @param opts
		 */
		setOptions: function(opts){
			//Call mergeObjects to create a flat copy of the opts object
			this.opts = mergeObjects(this.opts, opts);
		},


		loadAjaxContent: function(opts, onSuccess, onError){
			var ahl = this,
				evaluatedOpts = this.evalOptions(opts),
				xhr = this._createXHR();

			xhr.onreadystatechange = function(){
				if(xhr.readyState == 4){
					if(xhr.status == 200){
						if(typeof onSuccess === 'function') onSuccess.call(ahl, xhr.responseText, xhr);
					} else {
						if(typeof onError === 'function') onError.call(ahl, xhr.responseText, xhr);
					}
				}
			};

			xhr.open(evaluatedOpts.httpMethod, this.getAjaxSource(), true);
			xhr.send();
		}
	};

	return AjaxHTMLLoader;

});