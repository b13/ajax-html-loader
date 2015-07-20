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
	 * Utility class to check if an element contains a given class
	 *
	 * @param element
	 * @param cls
	 * @returns {boolean}
	 */
	function hasClass(element, cls) {
		return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
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
			showLoader           : 'data-alloader',
			loaderClass          : 'data-alloaderclass',
			loaderTargetSelector : 'data-alloadertarget',
			group                : 'data-algroup'
		},

		/**
		 * Default options that will be used if nothing else is defined.
		 */
		defaultOpts: {
			// Defines if loaded content should replace the target content or should be appended to target content
			// Valid types are 'append' or 'replace'
			actionType           : 'append',

			// URL of the source that will be loaded
			ajaxSource           : "",

			// Selector of the element that contains the content that will be appended or will replace the target content.
			sourceSelector       : 'al_source',

			// Selector of the element that contains the content to which the new content will be appended, or the
			// content that will be replaced.
			targetSelector       : 'al_target',

			// HTTP method that will be used in the ajax request. POST is tested. Others are not testet, yet.
			httpMethod           : 'GET',

			// HTTP params that will be either send as GET parameters or in the request body, depending on the httpMethod.
			httpParams           : "",

			// Define if a loader css class should be added while loading
			showLoader           : false,

			// Class that will be added if showLoader is true
			loaderClass          : 'al_loader',

			// Element selector to which the loaderClass will be added if showLoader is true.
			loaderTargetSelector : 'body',

			// Group can be defined if multiple links should work as if they would have only one loader.
			group                : ''
		},

		/**
		 * Private prototype attribute, to manage group states.
		 */
		_groupStates: {},

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

			//Bind click event listener to the link element
			if(this.el.addEventListener){ // W3C DOM
				this.el.addEventListener('click', _boundHandleClickEvent);
			}
			else if (this.el.attachEvent) { // IE DOM
				this.el.attachEvent('onclick', _boundHandleClickEvent);
			}
		},

		/**
		 * Click event handler. Triggers the content loading process.
		 *
		 * @param evt
		 * @private
		 */
		_handleClickEvent: function(evt){
			var ahl = this,
				opts = this.getOptions();

			// IE8 compatibility fix
			if(evt.preventDefault){
				evt.preventDefault();
			}
			else {
				evt.returnValue = false;
			}

			this.loadAjaxContent(
				opts,
				// Will be called if the content loading was successful
				function(responseText, xhr){
					ahl._handleContentLoadSuccess.call(ahl, responseText, xhr)
				}
			);
		},

		/**
		 * Handler that is provided as callback if content loading was successful.
		 *
		 * @param responseHTML
		 * @param xhr
		 * @private
		 */
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

		/**
		 * Utility function to create an XHR
		 *
		 * @returns {*}
		 * @private
		 */
		_createXHR: function(){
			var xhr;
			if (window.ActiveXObject){ // IF IE
				try
				{
					xhr = new ActiveXObject("Microsoft.XMLHTTP");
				}
				catch(e)
				{
					xhr = null;
				}
			}
			else{ // Other browsers
				xhr = new XMLHttpRequest();
			}

			return xhr;
		},

		/**
		 * Extractor function that peals out the required content out of the loaded content.
		 *
		 * @param responseHTML
		 * @returns {Element}
		 * @private
		 */
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

		/**
		 * Return saved group state. Group is defined by name.
		 *
		 * @param groupName
		 * @returns {*}
		 * @private
		 */
		_getGroupState: function(groupName){
			if(!this._groupStates[groupName]){
				this._groupStates[groupName] = {
					requestCount: 0
				};
			}
			return this._groupStates[groupName];
		},

		/**
		 * Set group state by groupName
		 *
		 * @param groupName
		 * @param state
		 * @private
		 */
		_setGroupState: function(groupName, state){
			this._groupStates[groupName] = mergeObjects(this._getGroupState(), state)
		},

		/**
		 * Return ajax source from which the content will be loaded.
		 *
		 * @returns {string}
		 */
		getAjaxSource: function(){
			return this.getOption('ajaxSource') || this.el.getAttribute('href');
		},

		/**
		 * Returns action how the loaded content will be used.
		 * Returns append or replace.
		 *
		 * @param preventEvaluation
		 * @returns {*}
		 */
		getActionType: function(preventEvaluation){
			return this.getOption('actionType', preventEvaluation);
		},

		/**
		 * Returns the CSS selector to extract the desired content out of the loaded html
		 *
		 * @param preventEvaluation
		 * @returns {*}
		 */
		getSourceSelector: function(preventEvaluation){
			return this.getOption('sourceSelector', preventEvaluation);
		},

		/**
		 * Returns the CSS selector from which the inner content will be either replaced by the source content or to
		 * which the source content will be appended.
		 *
		 * @param preventEvaluation
		 * @returns {*}
		 */
		getTargetSelector: function(preventEvaluation){
			return this.getOption('targetSelector', preventEvaluation);
		},

		/**
		 * Returns the defined HTTP method that is used to load the ajax content.
		 *
		 * @param preventEvaluation
		 * @returns {*}
		 */
		getHttpMethod: function(preventEvaluation){
			return this.getOption('httpMethod', preventEvaluation);
		},

		/**
		 * Returns the defined HTTP params that are send in the http request
		 *
		 * @param preventEvaluation
		 * @returns {*}
		 */
		getHttpParams: function(preventEvaluation){
			return this.getOption('httpParams', preventEvaluation);
		},

		/**
		 * Returns the loader setting, that defines if a loader CSS class should be added while loading the content.
		 *
		 * @param preventEvaluation
		 * @returns {*}
		 */
		doShowLoader: function(preventEvaluation){
			return this.getOption('showLoader', preventEvaluation);
		},

		/**
		 * Returns the class that will be added to the element, defined by the loaderTargetSelector option, while
		 * loading, if the showLoader option is true.
		 *
		 * @param preventEvaluation
		 * @returns {*}
		 */
		getLoaderClass: function(preventEvaluation){
			return this.getOption('loaderClass', preventEvaluation);
		},

		/**
		 * Returns the value of the targetSelector option. This defines where the loaded and extracted content should
		 * either replace the old content or be appended to it.
		 *
		 * @param preventEvaluation
		 * @returns {*}
		 */
		getLoaderTargetSelector: function(preventEvaluation){
			return this.getOption('loaderTargetSelector', preventEvaluation);
		},

		/**
		 * Returns the element(s) to which the loaded content will be applied.
		 *
		 * @returns {NodeList}
		 */
		getTargetElements: function(){
			var targetSelector = this.getTargetSelector();
			return document.querySelectorAll(targetSelector);
		},

		/**
		 * Returns the request URL value that will be used to load the content.
		 *
		 * @returns {*|string}
		 */
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
		 * Returns the loading group name if defined. The group name is used to synchronize the loading state between
		 * multiple links and ajax-html-loader instances.
		 *
		 * @param preventEvaluation
		 * @returns {*|boolean}
		 */
		getGroupName: function(preventEvaluation){
			return this.getOption('group', preventEvaluation) || false;
		},

		/**
		 * Copies the opts object and evaluates the functions that are given as opts.
		 *
		 * @returns {{}|*}
		 */
		getOptions: function(){
			return mergeObjects(this.opts);
		},

		/**
		 * Returns an option defined by the optionName
		 *
		 * @param optionName
		 * @param preventEvaluation
		 * @returns {*}
		 */
		getOption: function(optionName, preventEvaluation){
			var rawOption = this.opts[optionName];

			if(preventEvaluation || typeof rawOption !== 'function') return rawOption;
			return rawOption.call(this);
		},

		/**
		 * Update the options.
		 * @param opts
		 */
		setOptions: function(opts){
			//Call mergeObjects to create a flat copy of the opts object
			this.opts = mergeObjects(this.opts, opts);
		},

		/**
		 * Function that loads ajax content asynchronously.
		 *
		 * @param opts
		 * @param onSuccess
		 * @param onError
		 */
		loadAjaxContent: function(opts, onSuccess, onError){
			var ahl = this,
				xhr = this._createXHR(),
				httpMethod = this.getHttpMethod(),
				httpParams = this.getHttpParams(),
				requestURL = this.getRequestUrl(),
				loaderClass          = this.getLoaderClass(),
				loaderTargetSelector = this.getLoaderTargetSelector(),
				loaderTarget = document.querySelector(loaderTargetSelector),
				currentRequestCount = this._requestCount = this._requestCount + 1,
				groupName = this.getGroupName(),
				currentRequestCount;

			//Get group state if group name is defined.
			if(groupName){
				// Get group state
				var groupSate = this._getGroupState(groupName);

				// Increment the request count that is used to identify the current request.
				currentRequestCount = groupSate.requestCount + 1;

				// Abort a current request before starting a new one.
				if(groupSate.currentRequest) groupSate.currentRequest.abort();

				// Set group state
				this._setGroupState(groupName, {
					requestCount: currentRequestCount,
					currentRequest: xhr
				});
			}

			// Set loader class if showLoader option is true.
			if(this.doShowLoader()){
				//Add class if it is not already set.
				if(!hasClass(loaderTarget, loaderClass)){
					if(loaderTarget.className.length){
						loaderTarget.className += ' '
					}
					loaderTarget.className += loaderClass;
				}
			}

			// Handle request state changes and especially it the response is loaded.
			xhr.onreadystatechange = function(){
				if(xhr.readyState == 4){

					if(groupName && currentRequestCount){
						if(ahl._getGroupState(groupName).requestCount != currentRequestCount) return;
					}

					if(xhr.status == 200){
						if(typeof onSuccess === 'function') onSuccess.call(ahl, xhr.responseText, xhr);
					} else {
						if(typeof onError === 'function') onError.call(ahl, xhr.responseText, xhr);
					}

					if(hasClass(loaderTarget, loaderClass)){
						var matchingRegEx = new RegExp("\ ?" + loaderClass),
							matchingString = loaderTarget.className.match(matchingRegEx);

						loaderTarget.className = loaderTarget.className.replace(matchingString, "");
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

		/**
		 * Function to append content to the inner content of the target container.
		 *
		 * @param contentToAppend
		 */
		appendContent: function(contentToAppend){
			var targetSelector = this.getTargetSelector(),
				targetContainer = document.querySelector(targetSelector);

			if(contentToAppend){
				while (contentToAppend.firstChild) {
					targetContainer.appendChild(contentToAppend.firstChild);
				}
			}
		},

		/**
		 * Function to replace the inner content of
		 *
		 * @param replacementContent
		 */
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