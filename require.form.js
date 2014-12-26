/**
 * 2014 - requireForm 
 * @author Alison Monteiro https://github.com/alisonmonteiro 
**/

;(function() {
	'use strict';

	function log(myLog)
	{		
		if (window.console && console.log)
			console.log('[formRequire] ' + myLog);
	}

	function checkLenghtOfForm(object)
	{
		if(object.length > 1 )
			log('Select only one element.'); return;
	}

	function replaceAll(myString, serach, replace)
	{
	 	for(var c = myString.indexOf(serach); - 1 < c;) myString = myString.replace(serach, replace), c = myString.indexOf(serach);
	 		return myString;
	}

	function isValidEmail(mail)
	{
	 	var b = !1;
	 	if('undefined' != typeof mail && (mail = mail.match(/(\w+)@(.+)\.(\w+)$/), null != mail && (2 == mail[3].length || 3 == mail[3].length)))
	 		b = !0;

	 	return b;
	}

	function getLabelByInputId(e)
	{
		var lb = document.getElementsByTagName('label');
		for (var i = 0; i < lb.length; i++)
			if (lb[i].htmlFor == e)
				return lb[i];
	}

	/**
	 * @param options => Object
	 * 			messageBox => Id of the div error box.
	 * 			after => function for the callback
	 * 			messageError => your message error. Default: 'Preencha todos os campos.'.
	 * 			typeAlertError => Type of alert error. 'alert' or 'messageBox'. Default: 'messageBox'
	 */
	$.fn.formRequire = function( options )
	{
		if('undefined' == typeof options){
			var	options = {};			
		}

		var object = { selector: this.selector, context: this.context };

		if ( $(object.selector).is('form')){			

			var theForm = object.selector;

			
			checkLenghtOfForm($(theForm));

			$(theForm).submit(function(e){				

				var elements = 'input, select ,textarea',
					element,
					required,
					elementValue,
					send = true;

				$.each($(elements, theForm), function(){

					element = $(this);
					required = element.attr('data-required');
					elementValue = element.val();

					elementValue = replaceAll(elementValue, ' ', '');					

					if (required === 'true') {
						if (elementValue == ''){
							$(element).addClass('fr fr-error');
							$(getLabelByInputId(element.attr('name'))).addClass('fr fr-error');
							send = false;
						}else{
							if (element.attr('type') == 'email') {

								if (!isValidEmail(elementValue)) {
									$(element).addClass('fr fr-error');
									$(getLabelByInputId(element.attr('name'))).addClass('fr fr-error');
									send = false;
								} else {
									$(element).removeClass('fr fr-error');
									$(getLabelByInputId(element.attr('name'))).removeClass('fr fr-error');
								}

							} else if (element.attr('type') == 'radio' || element.attr('type') == 'checkbox') {

								if(!$('[name="'+ element.attr('name') +'"]').is(':checked')){
									$(element).addClass('fr fr-error');
									$(getLabelByInputId(element.attr('name'))).addClass('fr fr-error');
									send = false;
								}else{
									$(element).removeClass('fr fr-error');
									$(getLabelByInputId(element.attr('name'))).removeClass('fr fr-error');	
								}
							
							} else {

								$(element).removeClass('fr fr-error');
								$(getLabelByInputId(element.attr('name'))).removeClass('fr fr-error');
							}
						}
					}

				});

				if (send) {
					if('undefined' != typeof options.after ){
						return options.after(theForm);
					}else{
						return true;
					}
				}else{					


					if('undefined' == typeof options.messageError || options.messageError == '' || null == options.messageError){
						options.messageError = 'Preencha todos os campos';
					}

					if(options.typeAlertError  == 'messageBox' || 'undefined' == typeof options.typeAlertError || options.typeAlertError == '' || null == options.typeAlertError){

						var	messageBox;
						if('undefined' != typeof options.messageBox){					

							if( $(theForm).parent().find(options.messageBox).length == 1 ){
								$(messageBox).slideUp('fast');
								messageBox = options.messageBox;
							}else{
								log('The messageBox isn\'t in group with the form.');
								if( $(theForm).parent().find('#fr-message-area').length == 0 ){
									messageBox = $('<div id=\'fr-message-area\' class=\'fr fr-message-area\' style=\'display: none;\'></div>');
									$(theForm).before(messageBox);
								}
								messageBox = '#fr-message-area';
							}

						}else{
							if( $(theForm).parent().find('#fr-message-area').length == 0 ){
								messageBox = $('<div id=\'fr-message-area\' class=\'fr fr-message-area\' style=\'display: none;\'></div>');
								$(theForm).before(messageBox);
							}
							messageBox = '#fr-message-area';
						}

						
						$(messageBox).html(options.messageError);
						$(messageBox).slideDown('fast');
						setTimeout(function(){
							$(messageBox).slideUp('fast');
						},3500);

					}else{
						alert(options.messageError);
					}					

				}
				return false;
			});

		}else{
			log('The selected element isn\'t a form.');
			return;
		}
	}

})($);
