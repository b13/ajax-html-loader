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
		if(element){
			return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
		}
		return false;
	}

	/**
	 * Constructor expects at least a DOM element and additionally some opts
	 * @param el
	 * @param opts
	 * @constructor
	 */
	var AjaxHTMLLoader = function(el, opts){
		this._initialize(el, opts);
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
			group                : 'data-algroup',
			initLoading          : 'data-alinitloading'
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
			group                : '',

			// Defines if loading should be started automatically after initialization.
			initLoading          : false
		},

		/**
		 * Private prototype attribute, to manage group states.
		 */
		_groupStates: {},

		/**
		 * Counter of initialized anonymous groups
		 */
		_anonymousGroupCount: 0,

		/**
		 * Initialize function that is called by the "constructor"
		 * @param el
		 * @param opts
		 * @private
		 */
		_initialize: function(el, opts){
			this.el = el;
			this.opts = mergeObjects(this.defaultOpts, this._getOptionsFromAttributes(), this._getFormBasedOptions(), opts);

			this._beforeLoadingHandlers = [];
			this._onLoadingHandlers = [];
			this._onLoadingSuccessHandlers = [];
			this._onLoadingErrorhandlers = [];

			//Register before loading handlers
			if(this.opts.beforeLoading){
				if(typeof this.opts.beforeLoading === 'function'){
					this.registerBeforeLoading(this.opts.beforeLoading);
				} else if(this.opts.beforeLoading instanceof Array) {
					for(var i in this.opts.beforeLoading){
						if(typeof this.opts.beforeLoading[i] === 'function'){
							this.registerBeforeLoading(this.opts.beforeLoading[i]);
						}
					}
				}
			}

			//Register on loading handlers
			if(this.opts.onLoading){
				if(typeof this.opts.onLoading === 'function'){
					this.registerOnLoading(this.opts.onLoading);
				} else if(this.opts.onLoading instanceof Array) {
					for(var i in this.opts.onLoading){
						if(typeof this.opts.onLoading[i] === 'function'){
							this.registerOnLoading(this.opts.onLoading[i]);
						}
					}
				}
			}

			//Register on loading success handlers
			if(this.opts.onLoadingSuccess){
				if(typeof this.opts.onLoadingSuccess === 'function'){
					this.registerOnLoadingSuccess(this.opts.onLoadingSuccess);
				} else if(this.opts.onLoadingSuccess instanceof Array) {
					for(var i in this.opts.onLoadingSuccess){
						if(typeof this.opts.onLoadingSuccess[i] === 'function'){
							this.registerOnLoadingSuccess(this.opts.onLoadingSuccess[i]);
						}
					}
				}
			}

			//Register on loading error handlers
			if(this.opts.onLoadingError){
				if(typeof this.opts.onLoadingError === 'function'){
					this.registerOnLoadingError(this.opts.onLoadingError);
				} else if(this.opts.onLoadingError instanceof Array) {
					for(var i in this.opts.onLoadingError){
						if(typeof this.opts.onLoadingError[i] === 'function'){
							this.registerOnLoadingError(this.opts.onLoadingError[i]);
						}
					}
				}
			}

			this._bindEvents();

			if(this.doLoadInitially()) this.triggerContentLoading();
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
			// IE8 compatibility fix
			if(evt.preventDefault){
				evt.preventDefault();
			}
			else {
				evt.returnValue = false;
			}

			this.triggerContentLoading();
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
			var dummyEl = document.createElement( 'div'),
				sourceSelector = this.getSourceSelector();

			dummyEl.innerHTML = responseHTML;

			return dummyEl.querySelector(sourceSelector);
		},

		/**
		 * Extracts options from the form element if defined.
		 *
		 * @returns {{}}
		 * @private
		 */
		_getFormBasedOptions: function(){
			var formBasedOptions = {},
				clickableType = this.el.getAttribute('type');

			if(clickableType && clickableType === 'submit'){
				var formEl = this.getParentForm();

				if(formEl){
					var action = formEl.getAttribute('action'),
						method = formEl.getAttribute('method');

					if(action) formBasedOptions.ajaxSource = action;
					if(method) formBasedOptions.httpMethod = method.toUpperCase();
				}
			}

			return formBasedOptions;
		},

		/**
		 * Extracts options from the html attributes based on the attributeOptionsMapping definition above.
		 *
		 * @returns {{}}
		 * @private
		 */
		_getOptionsFromAttributes: function(){
			var attributeOpts = {};

			for(var attrOpt in this.attributeOptionsMapping){
				var attributeName = this.attributeOptionsMapping[attrOpt],
					optVal        = this.el.getAttribute(attributeName);

				if(optVal === 'true')  optVal = true;
				if(optVal === 'false') optVal = false;

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
			var clickableType = this.el.getAttribute('type'),
				formAction;

			if(clickableType && clickableType === 'submit'){
				var formEl = this.getParentForm();
				if(formEl) formAction = formEl.getAttribute('action');
			}

			return this.getOption('ajaxSource') || this.el.getAttribute('href') || formAction;
		},

		/**
		 * Returns action how the loaded content will be used.
		 * Returns append or replace.
		 *
		 * @returns {*}
		 */
		getActionType: function(){
			return this.getOption('actionType');
		},

		/**
		 * Returns the CSS selector to extract the desired content out of the loaded html
		 *
		 * @returns {*}
		 */
		getSourceSelector: function(){
			return this.getOption('sourceSelector');
		},

		/**
		 * Returns the CSS selector from which the inner content will be either replaced by the source content or to
		 * which the source content will be appended.
		 *
		 * @returns {*}
		 */
		getTargetSelector: function(){
			return this.getOption('targetSelector');
		},

		/**
		 * Returns the defined HTTP method that is used to load the ajax content.
		 *
		 * @returns {*}
		 */
		getHttpMethod: function(){
			var clickableType = this.el.getAttribute('type'),
				formMethod;

			if(clickableType && clickableType === 'submit') {
				var formEl = this.getParentForm();
				if(formEl) formMethod = formEl.getAttribute('method');
				if(formMethod) formMethod = formMethod.toUpperCase();
			}

			return this.getOption('httpMethod') || formMethod;
		},

		/**
		 * Returns the defined HTTP params that are send in the http request
		 *
		 * @returns {*}
		 */
		getHttpParams: function(){
			var clickableType = this.el.getAttribute('type'),
				httpParams = this.getOption('httpParams');
			if(clickableType && clickableType === 'submit'){
				var formEl = this.getParentForm(),
					formParams = "";

				if(formEl){
					var formValues = this.getFormValues(formEl);
					for(var key in formValues){
						formParams += "&" + key + "=" + formValues[key]
					}
				}
				if(!httpParams.length){
					formParams = formParams.substring(1);
				}
				httpParams += formParams;
			}
			return httpParams;
		},

		/**
		 * Returns the loader setting, that defines if a loader CSS class should be added while loading the content.
		 *
		 * @returns {*}
		 */
		doShowLoader: function(){
			return this.getOption('showLoader');
		},

		/**
		 * Returns the class that will be added to the element, defined by the loaderTargetSelector option, while
		 * loading, if the showLoader option is true.
		 *
		 * @returns {*}
		 */
		getLoaderClass: function(){
			return this.getOption('loaderClass');
		},

		/**
		 * Returns the value of the targetSelector option. This defines where the loaded and extracted content should
		 * either replace the old content or be appended to it.
		 *
		 * @returns {*}
		 */
		getLoaderTargetSelector: function(){
			return this.getOption('loaderTargetSelector');
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
		 * @returns {*|boolean}
		 */
		getGroupName: function(){
			var groupName = this.getOption('group') || this._privateGroup;

			if(!groupName){
				this._anonymousGroupCount++;
				groupName = "__al-group-" + this._anonymousGroupCount + "__";
				this._privateGroup = groupName;
			}
			return  groupName;
		},

		/**
		 * Returns a validator function that is called before the content loading ist initialized.
		 *
		 * @returns {function}
		 */
		getValidator: function(){
			return this.getOption('validator', true);
		},

		/**
		 * Searches in all parent elements of the clickable element for a form element and returns it, if found.
		 *
		 * @returns {undefined}
		 */
		getParentForm: function() {
			var resultParent = undefined,
				currentIterationElement = this.el;

			while(!resultParent && currentIterationElement.parentElement){
				if(currentIterationElement.parentElement.tagName == 'FORM'){
					resultParent = currentIterationElement.parentElement;
				}
				else {
					currentIterationElement = currentIterationElement.parentElement
				}
			}

			return resultParent;
		},

		doLoadInitially: function(){
			return this.getOption('initLoading');
		},

		getFormValues: function(formEl){
			var formValues = false;

			if(formEl){
				formValues = {};

				for(var i = 0; i < formEl.elements.length; i++){

					var inputElement = formEl.elements[i],
						inputElementName = inputElement.tagName,
						inputType = inputElement.getAttribute('type'),
						key = inputElement.getAttribute('name');

					if(inputElementName == 'INPUT' || inputElementName == 'TEXTAREA'){
						if(((inputType != "radio" && inputType != "checkbox") || inputElement.checked) && inputElement.value){
							formValues[key] = encodeURIComponent(inputElement.value);
						}
					}
					else if (inputElementName == 'SELECT'){
						if(inputElement.selectedIndex >= 0){
							var selectedOption = inputElement.options[inputElement.selectedIndex];
							formValues[key] = encodeURIComponent(selectedOption.value || selectedOption.text);
						}
					}
				}
			}

			//Add value of the clicked submit button
			if(this.el.getAttribute('type') == 'submit'){
				var submitKey   = this.el.getAttribute('name'),
					submitValue = this.el.value;

				if(typeof submitValue !== 'undefined' && submitValue !== null){
					formValues[submitKey] = submitValue;
				}
			}

			return formValues
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
		 * Triggeres content loading.
		 */
		triggerContentLoading: function(){
			var ahl = this,
				opts = this.getOptions();

			this.loadAjaxContent(
				opts,
				// Will be called if the content loading was successful
				function(responseText, xhr){
					ahl._handleContentLoadSuccess.call(ahl, responseText, xhr)
				}
			);
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
				currentRequestCount,
				validator = this.getValidator();

			// Check if validator is set and resolve it.
			if(typeof validator === 'function' && !validator()){
				return;
			}

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

			// Call before loading handlers
			for(var i in ahl._beforeLoadingHandlers){
				if(typeof ahl._beforeLoadingHandlers[i] === 'function') {
					ahl._beforeLoadingHandlers[i].call(ahl, ahl);
				}
			}

			// Set loader class if showLoader option is true.
			if(this.doShowLoader()){
				//Add class if it is not already set.
				if(loaderTarget && !hasClass(loaderTarget, loaderClass)){
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
						// Call on loading success handlers
						for(var i in ahl._onLoadingSuccessHandlers){
							if(typeof ahl._onLoadingSuccessHandlers[i] === 'function') {
								ahl._onLoadingSuccessHandlers[i].call(ahl, xhr.responseText, xhr, ahl);
							}
						}
					} else {
						if(typeof onError === 'function') onError.call(ahl, xhr.responseText, xhr);
						// Call on loading error handlers
						for(var i in ahl._onLoadingErrorhandlers){
							if(typeof ahl._onLoadingErrorhandlers[i] === 'function') {
								ahl._onLoadingErrorhandlers[i].call(ahl, xhr.responseText, xhr, ahl);
							}
						}
					}

					// Call on loading handlers
					for(var i in ahl._onLoadingHandlers){
						if(typeof ahl._onLoadingHandlers[i] === 'function') {
							ahl._onLoadingHandlers[i].call(ahl, xhr.responseText, xhr, ahl);
						}
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

			if(contentToAppend && targetContainer){
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
		},

		/**
		 * Register before loading handler.
		 *
		 * @param beforeLoadingHandler
		 * @returns {*}
		 */
		registerBeforeLoading: function(beforeLoadingHandler){
			if(typeof beforeLoadingHandler === 'function'){
				this._beforeLoadingHandlers.push(beforeLoadingHandler);
				return beforeLoadingHandler;
			}
		},

		/**
		 * Unregister before loading handler.
		 *
		 * @param beforeLoadingHandler
		 * @returns {*}
		 */
		unregisterBeforeLoading: function(beforeLoadingHandler){
			var arrayIndex = this._beforeLoadingHandlers.indexOf(beforeLoadingHandler);
			if(arrayIndex >= 0) {
				this._beforeLoadingHandlers.splice(arrayIndex, 1);
				return beforeLoadingHandler;
			}
		},

		/**
		 * Register on loading handler.
		 *
		 * @param onLoadingHandler
		 * @returns {*}
		 */
		registerOnLoading: function(onLoadingHandler){
			if(typeof onLoadingHandler === 'function') {
				this._onLoadingHandlers.push(onLoadingHandler);
				return onLoadingHandler;
			}
		},

		/**
		 * Unregister on loading handler.
		 *
		 * @param onLoadingHandler
		 * @returns {*}
		 */
		unRegisterOnLoading: function(onLoadingHandler){
			var arrayIndex = this._onLoadingHandlers.indexOf(onLoadingHandler);
			if(arrayIndex >= 0) {
				this._onLoadingHandlers.splice(arrayIndex, 1);
				return onLoadingHandler;
			}
		},

		/**
		 * Register on loading success handler.
		 *
		 * @param onLoadingSuccessHandler
		 * @returns {*}
		 */
		registerOnLoadingSuccess: function(onLoadingSuccessHandler){
			if(typeof onLoadingSuccessHandler === 'function') {
				this._onLoadingSuccessHandlers.push(onLoadingSuccessHandler);
				return onLoadingSuccessHandler;
			}
		},

		/**
		 * Unregister on loading success handler.
		 *
		 * @param onLoadingSuccessHandler
		 * @returns {*}
		 */
		unRegisterOnLoadingSuccess: function(onLoadingSuccessHandler){
			var arrayIndex = this._onLoadingSuccessHandlers.indexOf(onLoadingSuccessHandler);
			if(arrayIndex >= 0) {
				this._onLoadingSuccessHandlers.splice(arrayIndex, 1);
				return onLoadingSuccessHandler;
			}
		},

		/**
		 * Register on loading error handler.
		 *
		 * @param onLoadingErrorHandler
		 * @returns {*}
		 */
		registerOnLoadingError: function(onLoadingErrorHandler){
			if(typeof onLoadingErrorHandler === 'function') {
				this._onLoadingErrorhandlers.push(onLoadingErrorHandler);
				return onLoadingErrorHandler;
			}
		},

		/**
		 * Unregister on loading error handler.
		 *
		 * @param onLoadingErrorHandler
		 * @returns {*}
		 */
		unRegisterOnLoadingError: function(onLoadingErrorHandler){
			var arrayIndex = this._onLoadingErrorhandlers.indexOf(onLoadingErrorHandler);
			if(arrayIndex >= 0) {
				this._onLoadingErrorhandlers.splice(arrayIndex, 1);
				return onLoadingErrorHandler;
			}
		}

	};

	return AjaxHTMLLoader;

});
