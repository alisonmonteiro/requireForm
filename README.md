requireForm é um simples plugin jQuery.

No seu formulário, você define quais campos devem ser orbrigatórios e faz a chamada do plugin.
Veja um exemplo:

$(window).ready(function(){
  var myOptions = {
    messageError: null, // Set your message error. Default: 'Preencha todos os campos.'.
    typeAlertError: null, // alert or messageBox. Default: messageBox
    messageBox: null, // Your '#div-error' Default: A box with a Default message will be created.
    after: myCallbackFunction // Your Callback function. The default parameter is your own form.
  };
  $('#myForm').formRequire( myOptions );
});
