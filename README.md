# Ajax HTML Loader v0.1.3
AMD  module to handle dynamic asynchronous html content loading.

## Introduction

The Ajax HTML Loader is a JS-AMD module that can be used to load html content dynamically and asynchronously in a very
easy manner.
Basically said, you can add js functionality to an anchor or even any other HTML element that will load and replace or
append HTML content anywhere on you web page.

## Documentation

### Install with bower

	bower install ajax-html-loader -S


### Base initialization with js only

	require(['ajax-html-load'], function(AjaxHTMLLoader){

		var ajaxLoaderOptions = { ... },
			anchorElement = document.getElementById('anchorID'),
    		ajaxHTMLLoader = new AjaxHTMLLoader(anchorElement, ajaxLoaderOptions);

    });

### Initialization with options passing by html attributes

#### HTML

	<a id="ajax-anchor-id1" href="/ajax/loading/source.html" data-alaction="replace"  data-alsourceselector="#sourceID" data-altargetselector="#targetID" data-almethod="POST" data-alparams="page=1&foo=bar" data-alloader="true" data-alloaderclass="loading-animation" data-alloadertarget="loader-container">Load Page 1 Content</a>

#### JS Code

	require(['ajax-html-load'], function(AjaxHTMLLoader){

		var anchorElement = document.getElementById('ajax-anchor-id1'),
    		ajaxHTMLLoader = new AjaxHTMLLoader(anchorElement);
    });
    
#### Pagination and Grouping Example
This example may be not a real world example but it illustrates how it is possible to group multiple links together to 
gain a better loading behaviour and user experience.
E.g. if multiple links are used to load from the same source and manipulate the same content, like in this example, it 
is likely that some problematic behaviour can occur.
Imagine an ajax source with some delay and a user that clicks quickly more of these links. In this case the loader would
appear as soon as the user clicks the first link, but it would also disappear after the first source is loaded even if the
other request are not yet finished.
Another problem is that you never know which response comes back firstly. In theory it is possible that the response of
the first request is received after the response of later requests. But in most cases you would like to show the content
of the later request.
Therefore it is possible to group multiple anchors together by adding the group/data-algroup option. All anchros with
the same group name are handeled together.

	<section id="bJS_paginationExampleFrame">
		<h2>Pagination Test</h2>
		<table class="table table-striped">
			<thead>
				<tr><th>First Name</th><th>Last Name</th><th>Email</th></tr>
			</thead>
			<tbody id="bJS_ahl-paginationTest-target">
				<tr><td>Robbie</td><td>Hightower</td><td>r.hightower@gmail.com</td></tr>
				<tr><td>Mickey</td><td>Fischer</td><td>m.fischer@gmail.com</td></tr>
				<tr><td>Beverly</td><td>Chambers</td><td>b.chambers@gmail.com</td></tr>
				<tr><td>Leslie</td><td>Arechavaleta</td><td>l.arechavaleta@gmail.com</td></tr>
				<tr><td>Franny</td><td>Shaw</td><td>f.shaw@gmail.com</td></tr>
			</tbody>
		</table>
		<div class="pull-right pagination">
			<ul class="pagination">
				<li class="page-first">
					<a href="/tabledata/" class="mJS_ajaxLoader" data-almethod="POST" data-alaction="replace" data-alparams="page=1" data-alloader="true" data-alsourceselector="#bJS_ahl-paginationTest-source" data-altargetselector="#bJS_ahl-paginationTest-target" data-alloader="true" data-alloadertarget="#bJS_paginationExampleFrame" data-algroup="b_paginationTable">&lt;&lt;</a>
				</li>
				<li class="page-number">
					<a href="/tabledata/" class="mJS_ajaxLoader" data-almethod="POST" data-alaction="replace" data-alparams="page=1" data-alloader="true" data-alsourceselector="#bJS_ahl-paginationTest-source" data-altargetselector="#bJS_ahl-paginationTest-target" data-alloader="true" data-alloadertarget="#bJS_paginationExampleFrame" data-algroup="b_paginationTable">1</a>
				</li>
				<li class="page-number">
					<a href="/tabledata/" class="mJS_ajaxLoader" data-almethod="POST" data-alaction="replace" data-alparams="page=2" data-alloader="true" data-alsourceselector="#bJS_ahl-paginationTest-source" data-altargetselector="#bJS_ahl-paginationTest-target" data-alloader="true" data-alloadertarget="#bJS_paginationExampleFrame" data-algroup="b_paginationTable">2</a>
				</li>
				<li class="page-number">
					<a href="/tabledata/" class="mJS_ajaxLoader" data-almethod="POST" data-alaction="replace" data-alparams="page=3" data-alloader="true" data-alsourceselector="#bJS_ahl-paginationTest-source" data-altargetselector="#bJS_ahl-paginationTest-target" data-alloader="true" data-alloadertarget="#bJS_paginationExampleFrame" data-algroup="b_paginationTable">3</a>
				</li>
				<li class="page-number">
					<a href="/tabledata/" class="mJS_ajaxLoader" data-almethod="POST" data-alaction="replace" data-alparams="page=4" data-alloader="true" data-alsourceselector="#bJS_ahl-paginationTest-source" data-altargetselector="#bJS_ahl-paginationTest-target" data-alloader="true" data-alloadertarget="#bJS_paginationExampleFrame" data-algroup="b_paginationTable">4</a>
				</li>
				<li class="page-number">
					<a href="/tabledata/" class="mJS_ajaxLoader" data-almethod="POST" data-alaction="replace" data-alparams="page=5" data-alloader="true" data-alsourceselector="#bJS_ahl-paginationTest-source" data-altargetselector="#bJS_ahl-paginationTest-target" data-alloader="true" data-alloadertarget="#bJS_paginationExampleFrame" data-algroup="b_paginationTable">5</a>
				</li>
				<li class="page-last">
					<a href="/tabledata/" class="mJS_ajaxLoader" data-almethod="POST" data-alaction="replace" data-alparams="page=5" data-alloader="true" data-alsourceselector="#bJS_ahl-paginationTest-source" data-altargetselector="#bJS_ahl-paginationTest-target" data-alloader="true" data-alloadertarget="#bJS_paginationExampleFrame" data-algroup="b_paginationTable">&gt;&gt;</a>
				</li>
			</ul>
		</div>
	</section>
    	
#### Form Example
This module can be used to handle ajax requests for an HTML form. The following example illustrates how to achieve this.
    
##### Example HTML
	<section id="bJS_formExample">
		<h2>Form Test</h2>
		<form action="/formdata/" method="post">
			<div class="row">
				<div class="col-xs-6 col-sm-3 form-group">
					<input id="example-form-firstname" type="text" name="firstname">
					<label for="example-form-firstname">First Name</label>
				</div>
				<div class="col-xs-6 col-sm-3 form-group">
					<input id="example-form-lastname" type="text" name="lastname">
					<label for="example-form-lastname">Last Name</label>
				</div>
				<div class="col-xs-6 col-sm-3 form-group">
					<fieldset>
						<input id="example-form-gender-male" type="radio" name="gender" value="male">
						<label for="example-form-gender-male">male</label>
						<input id="example-form-gender-female" type="radio" name="gender" value="female">
						<label for="example-form-gender-female">female</label>
					</fieldset>
				</div>
				<div class="col-xs-6 col-sm-3 form-group">
					<input type="submit" value="Filter" class="mJS_ajaxLoader" data-alaction="replace" data-alinitloading="true" data-alloader="true" data-alloadertarget="#bJS_formExample form" data-alsourceselector="#bJS_formExample-source" data-altargetselector="#bJS_formExample-target">
				</div>
			</div>
		</form>
		<table class="table table-striped">
			<thead>
				<tr>
					<th>First Name</th>
					<th>Last Name</th>
					<th>Gender</th>
				</tr>
			</thead>
			<tbody id="bJS_formExample-target">
			</tbody>
		</table>
	</section>
	
##### Example JS
	require(['ajax-html-load'], function(AjaxHTMLLoader){
		var submitButton = document.querySelecto('.mJS_ajaxLoader'),
			ajaxHTMLLoader = new AjaxHTMLLoader(submitButton);
	});
	
The ajax-html-loader module is able to detect if the HTML element to which it is bound is a submit button of a form or not.
If the clickable HTML element is a submit button the ajax source and the http method are taken from the action and the 
method attribute of the parent form, if available. The action and method can be overridden by either adding the documented
attributes data-alajaxsource and/or data-almethod to the submit button, or by passing the ajaxSource option and/or the
httpMethod method as JSON options.


### Options

Option name | HTML attribute | Type | Default Value | Description
----------- | -------------- | ---- | ------------- | -----------
actionType | data-alaction | String | "append" | Defines if loaded content should replace the target content or should be appended to target content. Valid types are 'append' or 'replace'
ajaxSource | data-alajaxsource or href or action of a parent form | String or Function | "" | URL of the source that will be loaded.
contentType | data-alcontenttype or enctype of a parent form | String | "application/x-www-form-urlencoded" | Content type of the request, corresponds also to the enctype of the form.
sourceSelector | data-alsourceselector | String or Function | "al_source" | Selector of the element that contains the content that will be appended or will replace the target content.
targetSelector | data-altargetselector | String or Function | "al_target" | Selector of the element that contains the content to which the new content will be appended, or the content that will be replaced.
httpMethod | data-almethod or method of a parent form | String or Function | "GET" | HTTP method that will be used in the ajax request. POST is tested. Others are not testet, yet.
httpParams | data-alparams | String or Function | "" | HTTP params that will be either send as GET parameters or in the request body, depending on the httpMethod.
showLoader | data-alloader | Boolean or Function | false | Define if a loader css class should be added while loading.
loaderClass | data-alloaderclass | String or Function | "al_loader" | Class that will be added if showLoader is true.
loaderTargetSelector | data-alloadertarget | String or Function | "body" | Element selector to which the loaderClass will be added if showLoader is true.
group | data-algroup | String or Function | "" | Group can be defined if multiple links should work as if they would have only one loader.
initLoading | data-alinitloading | Boolean | false | // Defines if loading should be started automatically after initialization.
beforeLoading | N.A. | Function / Array[Function] | undefined | One or multiple before loading callbacks.
onLoading | N.A. | Function / Array[Function] | undefined | One or multiple on loading callbacks.
onLoadingSuccess | N.A. | Function / Array[Function] | undefined | One or multiple on loading success callbacks.
onLoadingError | N.A. | Function / Array[Function] | undefined | One or multiple on loading error callbacks.
validator | N.A. | Function | undefined | A validator function that is called before the content loading ist initialized. The loading will be initialized if the return value of the validator resolves to TRUE. 
Many of the options can be passed as functions if they are passed in JS. This won't work for options that are passed as
HTML attribute, because we want to avoid the use of eval.
If an option is passed as JS option and as HTML attribute option, the js option will always override the html attribute
option.


### Constants

Constant Name | Value
AjaxHTMLLoader.CONTENT_TYPE_PLAIN | "text/plain"
AjaxHTMLLoader.CONTENT_TYPE_URL_ENCODED | "application/x-www-form-urlencoded"
AjaxHTMLLoader.CONTENT_TYPE_FORM_DATA | "multipart/form-data"

### Public Functions

Function name | Return value type | Description
------------- | ----------------- | -----------
getAjaxSource() | String | Returns the value of the ajaxSource option or the href attribute.
getActionType() | String | Returns the value of the actionType option.
getContentType() | String | Returns the content type that is used in the request header.
getSourceSelector() | String | Returns the value of the sourceSelector option.
getTargetSelector() | String | Returns the value of the targetSelector option.
getHttpMethod() | String | Returns the value of the httpMethod option.
getHttpParams() | String | Returns the value of the httpParams option.
doShowLoader() | Boolean | Returns the value of the showLoader option.
getLoaderClass() | String | Returns the value of the loaderClass option.
getLoaderTargetSelector() | String | Returns the value of the loaderTargetSelector option.
getTargetElements() | Array[HTMLElement] | Returns an array with HTMLElement-objects that match the targetSelector.
getRequestUrl() | String | Builds and returns the request URL that will be used to load the ajax content. The function respects the defined ajax source as well as the http method and the http params.
getRequestData() | String | Returns the data that will be send as request payload.
getGroupName() | String | Returns the value of the group option.
doLoadInitially() | Boolean | Returns the value of the initLoading option.
getValidator() | Function or undefined | Returns a validator function that is called before the content loading ist initialized.
getOptions() | Object | Returns a copy of the options object. The option provided in this object are not evaluated. That means if options are defined as functions, they will be also represented as functions and not as their evalution values.
getOption(String: optionName, Boolean: preventEvaluation) | String/Boolean/Function | Returns an option defined by its' name. If an option is provided as function, the preventEvaluation parameter determines if the option should be returned as function or if the function should be evaluated.
setOptions(Object: opts) | undefined | Expects an object with option keys and their values. This function will override only the provided options.
getParentForm() | HTMLElement / undefined | Searches in all parent elements of the clickable element for a form element and returns it, if found.
getFormValues(HTMLElement: formEl) | Object | Returns all active values of input fields inside the given form.
loadAjaxContent(Object: opts, Function: onSuccess, Function: onError) | undefined | The loading function that starts the xhr request and handels the response handling.
triggerContentLoading() | undefined | Triggers content loading and handling.
appendContent(HTMLElement: contentToAppend) | undefined | Function that appends provided HTMLElement content to the inner HTML of the target.
replaceContent(HTMLElement: replacementContent) | undefined | Function that replaces the inner HTML of the target with the provided HTMLElement content.
registerBeforeLoading(Function: beforeLoadingHandler) | Function | Registers a callback that will be called before loading. And returns the callback if added.
registerOnLoading(Function: onLoadingHandler) | Function | Registers a callback that will be called after loading. And returns the callback if added.
registerOnLoadingSuccess(Function: onSuccessLoadingHandler) | Function | Registers a callback that will be called after successful loading. And returns the callback if added.
registerOnLoadingError(Function: onErrorLoadingHandler) | Function | Registers a callback that will be called after failed loading. And returns the callback if added.
unRegisterBeforeLoading(Function: beforeLoadingHandler) | Function | Unregisters a callback that was registered to be called before loading. And returns the callback if unregistering was successful.
unRegisterOnLoading(Function: onLoadingHandler) | Function | Unregisters a callback that was registered to be called on loading. And returns the callback if unregistering was successful.
unRegisterOnLoadingSuccess(Function: onSuccessLoadingHandler) | Function | Unregisters a callback that was registered to be called on successful loading. And returns the callback if unregistering was successful.
unRegisterOnLoadingError(Function: onErrorLoadingHandler) | Function | Unregisters a callback that was registered to be called on loading failure. And returns the callback if unregistering was successful.