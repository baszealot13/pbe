/**
 *
 * @returns {NotyHelper}
 * @constructor
 * @memberof XeerSoft.app.models
 */
function NotyHelper() {
    var self = this;

    /**
     * @public
     * @static
     * @function displayError
     * @memberof XeerSoft.app.services.NotyHelper
     * @param {object} err from AngularJS $resource
     */
    self.displayError = function (err, $translate) {
        var statusText = 'Unknown error',
            translations = {},
            txtCannotConnect = 'Cannot connect to server. Please check internet connection and try again.';

        if (typeof err.data !== 'undefined' && typeof err.data.error_description === 'string') {
            statusText = err.data.error_description;
        } else if (typeof err.data !== 'undefined' && typeof err.data.statusText !== 'undefined') {
            statusText = err.data.statusText;
        } else if (typeof err.statusText !== 'undefined') {
            statusText = err.statusText;
        } else if (typeof err.message !== 'undefined') {
            statusText = err.message;
        }

        if (typeof $translate !== 'undefined') {
            if (typeof err.data !== 'undefined' && typeof err.data.fields !== 'undefined') {
                for (var i = 0; i < err.data.fields.length; i++) {
                    translations[err.data.fields[i]] = $translate.instant(err.data.fields[i]);
                }
                statusText = $translate.instant(statusText, translations);
            } else {
                statusText = $translate.instant(statusText);
            }
            txtCannotConnect = $translate.instant(txtCannotConnect);
        }

        if (typeof err.status !== 'undefined' && err.status === 200) {
            noty({ type: 'success', text: statusText, timeout: 3000 });
        } else if (typeof err.status !== 'undefined' && err.status === 0) {
            noty({ type: 'error', text: txtCannotConnect, timeout: 3000 });
        } else if (typeof err.status !== 'undefined' && err.status !== -1) {
            noty({ type: 'warning', text: statusText, timeout: 3000 });
        } else {
            noty({ type: 'error', text: statusText, timeout: 3000 });
        }
    };

    return self;
}