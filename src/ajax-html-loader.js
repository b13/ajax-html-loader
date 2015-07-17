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
			ajaxSource           : 'data-alajaxsource',
			sourceSelector       : 'data-alsourceselector',
			targetSelector       : 'data-altargetselector',
			httpMethod           : 'data-almethod',
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
			ajaxSource           : "",
			sourceSelector       : 'al_source',
			targetSelector       : 'al_target',
			httpMethod           : 'GET',
			httpParams           : "", 				//It is possible to set a function here
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
			var ahl = this,
				opts = this.getOptions();

			evt.preventDefault();

			this.loadAjaxContent(
				opts,
				function(responseText, xhr){
					ahl._handleContentLoadSuccess.call(ahl, responseText, xhr)
				}
			);
		},

		_handleContentLoadSuccess: function(responseHTML, xhr){
			var actionType = this.getActionType(),
				extractedContent = this._extractContentFromResponseHTML(responseHTML);

			if(actionType === 'append'){
				this.appendContent(extractedContent);
			}
			else if (actionType === 'replace') {
				this.replaceContent(extractedContent);
			}
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

		_extractContentFromResponseHTML: function(responseHTML){
			var dummyEl = document.createElement( 'html'),
				sourceSelector = this.getSourceSelector();

			dummyEl.innerHTML = responseHTML;

			return dummyEl.querySelector(sourceSelector);
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

		getActionType: function(preventEvaluation){
			return this.getOption('actionType', preventEvaluation);
		},
		getSourceSelector: function(preventEvaluation){
			return this.getOption('sourceSelector', preventEvaluation);
		},
		getTargetSelector: function(preventEvaluation){
			return this.getOption('targetSelector', preventEvaluation);
		},
		getHttpMethod: function(preventEvaluation){
			return this.getOption('httpMethod', preventEvaluation);
		},
		getHttpParams: function(preventEvaluation){
			return this.getOption('httpParams', preventEvaluation);
		},
		doAddLoaderClass: function(preventEvaluation){
			return this.getOption('addLoaderClass', preventEvaluation);
		},
		getLoaderClass: function(preventEvaluation){
			return this.getOption('loaderClass', preventEvaluation);
		},
		getLoaderTargetSelector: function(preventEvaluation){
			return this.getOption('loaderTargetSelector', preventEvaluation);
		},

		getTargetElements: function(){
			var targetSelector = this.getTargetSelector();
			return document.querySelectorAll(targetSelector);
		},

		getRequestUrl: function(){
			var httpMethod = this.getHttpMethod(),
				requestUrl = this.getAjaxSource(),
				httpParams = this.getHttpParams();

			if(httpMethod == 'GET' && httpParams && httpParams.length){
				if(requestUrl.indexOf('?') >= 0) {
					requestUrl += "&";
				} else {
					requestUrl += "?";
				}
				requestUrl += httpParams;
			}
			return requestUrl;
		},

		/**
		 * Copies the opts object and evaluates the functions that are given as opts
		 *
		 * @returns {{}|*}
		 */
		getOptions: function(){
			return mergeObjects(this.opts);
		},

		getOption: function(optionName, preventEvaluation){
			var rawOption = this.opts[optionName];

			if(preventEvaluation || typeof rawOption !== 'function') return rawOption;
			return rawOption.call(this);
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
				xhr = this._createXHR(),
				httpMethod = this.getHttpMethod(),
				httpParams = this.getHttpParams(),
				requestURL = this.getRequestUrl();

			xhr.onreadystatechange = function(){
				if(xhr.readyState == 4){
					if(xhr.status == 200){
						if(typeof onSuccess === 'function') onSuccess.call(ahl, xhr.responseText, xhr);
					} else {
						if(typeof onError === 'function')   onError.call(ahl, xhr.responseText, xhr);
					}
				}
			};

			xhr.open(httpMethod, requestURL, true);
			//Send the proper header information along with the request
			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			if(httpMethod == 'GET'){
				xhr.send();
			} else {
				xhr.send(httpParams);
			}
		},

		appendContent: function(contentToAppend){
			var targetSelector = this.getTargetSelector(),
				targetContainer = document.querySelector(targetSelector);

			if(contentToAppend){
				while (contentToAppend.firstChild) {
					targetContainer.appendChild(contentToAppend.firstChild);
				}
			}
		},

		replaceContent: function(replacementContent){
			var targetSelector = this.getTargetSelector(),
				targetContainer = document.querySelector(targetSelector);

			if(replacementContent){
				while (targetContainer.firstChild) {
					targetContainer.removeChild(targetContainer.firstChild);
				}

				while (replacementContent.firstChild) {
					targetContainer.appendChild(replacementContent.firstChild);
				}
			}
		}
	};

	return AjaxHTMLLoader;

});