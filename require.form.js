'use strict';

var Util = {
    log: function (myLog) {
        if (window.console && console.log)
            console.log('[requireForm] ' + myLog);
    },
    checkLenghtOfForm: function (object) {
        if (object.length > 1)
            this.log('Select only one element.');
        else
            return false;
    },
    replaceAll: function (myString, search, replace) {
        for (var c = myString.indexOf(search); -1 < c;) {
            myString = myString.replace(search, replace)
            c = myString.indexOf(search);
        }

        return myString;
    },
    isValidEmail: function (mail) {
        var b = !1,
            mail = mail.match(/(\w+)@(.+)\.(\w+)$/),
            structure = (null != mail && (2 == mail[3].length || 3 == mail[3].length));

        if ('undefined' != typeof mail && structure)
            b = !0;

        return b;
    },
    getLabelByInputId: function (e) {
        var theLabel = document.getElementsByTagName('label');
        for (var i = 0; i < theLabel.length; i++)
            if (theLabel[i].htmlFor == e)
                return theLabel[i];
    }
};

/**
 * @param options => Object
 *      messageBox => Id of the div error box.
 * 		after => function for the callback
 * 		messageError => your message error. Default: 'Preencha todos os campos.'.
 * 		typeAlertError => Type of alert error. 'alert' or 'messageBox'. Default: 'messageBox'
 */
$.fn.requireForm = function (options) {

    var theForm,
        elements,
        element,
        required,
        pluginData,
        messageBox,
        elementValue,
        send;


    if ('undefined' == typeof options) {
        options = {};
    }

    pluginData = {
        context: this.context,
        selector: this.selector
    };


    if ($(pluginData.selector).is('form')) {

        theForm = pluginData.selector;
        Util.checkLenghtOfForm($(theForm));

        $(theForm).submit(function () {

            elements = 'input ,select, textarea';
            send = true;

            $.each($(elements, theForm), function () {

                element = $(this);
                required = element.attr('data-required');
                elementValue = Util.replaceAll(element.val(), ' ', '');

                if (required === 'true') {

                    if (elementValue == '') {

                        $(Util.getLabelByInputId(element.attr('name')))
                            .addClass('rf rf-error');
                        $(element)
                            .addClass('rf rf-error');

                        send = false;

                    } else {

                        if (element.attr('type') == 'email') {

                            if (!Util.isValidEmail(elementValue)) {

                                $(Util.getLabelByInputId(element.attr('name')))
                                    .addClass('rf rf-error');
                                $(element)
                                    .addClass('rf rf-error');

                                send = false;

                            } else {

                                $(Util.getLabelByInputId(element.attr('name')))
                                    .removeClass('rf rf-error');
                                $(element)
                                    .removeClass('rf rf-error');

                            }

                        } else if (element.attr('type') == 'radio' || element.attr('type') == 'checkbox') {

                            if (!$('[name="' + element.attr('name') + '"]').is(':checked')) {
                                $(Util.getLabelByInputId(element.attr('name')))
                                    .addClass('rf rf-error');
                                $(element)
                                    .addClass('rf rf-error');

                                send = false;

                            } else {

                                $(Util.getLabelByInputId(element.attr('name')))
                                    .removeClass('rf rf-error');
                                $(element)
                                    .removeClass('rf rf-error');

                            }

                        } else {

                            $(Util.getLabelByInputId(element.attr('name')))
                                .removeClass('rf rf-error');
                            $(element)
                                .removeClass('rf rf-error');

                        }
                    }
                }

            }); // End each

            if (send) {

                if ('undefined' != typeof options.after)
                    return options.after(theForm);

                return true;

            } else {

                if ('undefined' == typeof options.messageError || options.messageError == '' ||
                    null == options.messageError) {

                    options.messageError = 'Preencha todos os campos';
                }

                if (options.typeAlertError == 'messageBox' || 'undefined' == typeof options.typeAlertError ||
                    options.typeAlertError == '' || null == options.typeAlertError) {

                    if ('undefined' != typeof options.messageBox) {

                        if ($(theForm).parent().find(options.messageBox).length == 1) {
                            $(messageBox)
                                .slideUp('fast');

                            messageBox = options.messageBox;
                        } else {
                            Util.log('The messageBox isn\'t in group with the form.');

                            if ($(theForm).parent().find('#rf-message-area').length == 0) {
                                messageBox = $('<div id=\'rf-message-area\' class=\'rf rf-message-area\' hidden></div>');
                                $(theForm)
                                    .before(messageBox);
                            }

                            messageBox = '#rf-message-area';
                        }

                    } else {

                        if ($(theForm).parent().find('#rf-message-area').length == 0) {
                            messageBox = $('<div id=\'rf-message-area\' class=\'rf rf-message-area\' hidden></div>');
                            $(theForm)
                                .before(messageBox);
                        }

                        messageBox = '#rf-message-area';
                    }


                    $(messageBox)
                        .html(options.messageError)
                        .slideDown('fast');

                    setTimeout(function () {
                        $(messageBox)
                            .slideUp('fast');
                    }, 3500);

                } else {
                    alert(options.messageError);
                }

            }

            return false;
        });

    } else {
        Util.log('The selected element isn\'t a form.');
        return;
    }
};
