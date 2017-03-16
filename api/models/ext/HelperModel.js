var HelperModel = {
    getErrorMessageObject: function (e) {
        var obj = {},
            text = e.message,
            re = /'(\w*?)'/g,
            fields = [],
            match;

        obj.status = (typeof e.status !== 'undefined') ? e.status : 400;
        obj.code = (typeof e.code !== 'undefined') ? e.code : 'ER_XS_UNKNOWN';

        while (match = re.exec(text)) {
            fields.push(match[1]);
            text = text.replace(match[0], '{{' + match[1] + '}}');
        }

        obj.statusText = text;
        obj.fields = fields;

        return obj;
    }
};

module.exports = HelperModel;