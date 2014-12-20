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
	 * 			messageArea => Id of the div error box.
	 * 			callback => function for the callback
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

				var	messageArea;
				if('undefined' != options.messageArea){					

					if( $(theForm).parent().find(options.messageArea).length == 1 ){
						$(messageArea).slideUp('fast');
						messageArea = options.messageArea;
					}else{
						log('The messageArea isn\'t in group with the form.');
						if( $(theForm).parent().find('#fr-message-area').length == 0 ){
							messageArea = $('<div id=\'fr-message-area\' class=\'fr fr-message-area\' style=\'display: none;\'></div>');
							$(theForm).before(messageArea);
						}
						messageArea = '#fr-message-area';
					}

				}else{
					if( $(theForm).parent().find('#fr-message-area').length == 0 ){
						messageArea = $('<div id=\'fr-message-area\' class=\'fr fr-message-area\' style=\'display: none;\'></div>');
						$(theForm).before(messageArea);
					}
					messageArea = '#fr-message-area';
				}

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
					if('undefined' != options.callback ){
						return options.callback(theForm);
					}else{
						return true;
					}
				}else{

					$(messageArea).html('Preencha todos os campos');
					$(messageArea).slideDown('fast');
					setTimeout(function(){
						$(messageArea).slideUp('fast');
					},3500);

				}
				return false;
			});

		}else{
			log('The selected element isn\'t a form.');
			return;
		}
	}

})($);