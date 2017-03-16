var ExtUserModel = {
    classMethods: {
        associate: function () {},
        randomSalt: function () {
            var MD5 = require("crypto-js/md5");
            return MD5(Math.random().toString()).toString();
        },
        calculatePassword: function (plainPassword, salt) {
            var SHA1 = require("crypto-js/sha1");
            return salt + ':' + SHA1(salt + SHA1(plainPassword)).toString();
        }
    },
    instanceMethods: {
        encryptPassword: function (plainPassword, salt) {
            var SHA1 = require("crypto-js/sha1");
            return SHA1(salt + SHA1(plainPassword)).toString();
        },
        checkPassword: function (plainPassword) {
            if (typeof this.usr_passwd != 'string') {
                return false;
            }
            var tmp = this.usr_passwd.split(':');
            if (tmp.length != 2) {
                return false;
            }
            var salt = tmp[0],
                encryptedPassword = tmp[1];
            return (this.encryptPassword(plainPassword, salt) === encryptedPassword);
        }
    }
};

module.exports = ExtUserModel;