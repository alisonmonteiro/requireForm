requireForm é um simples plugin jQuery.

No seu formulário, você define quais campos devem ser orbrigatórios e faz a chamada do plugin.

$(window).ready(function(){
	$('#formulario').formRequire({
	  messageArea: '#box-message-erro',
		callback: funcCallback
	});			
});
