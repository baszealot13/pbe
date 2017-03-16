function LocalDatabase ($http) {
    var self = {
        DB_NAME: 'pbe',
        ADAPTER: '',
        DB_ADAPTERS: {
            LOCALFORAGE: 'LocalForage'
        },
        init: function () {
            if (typeof localforage !== 'undefined') {
                this.ADAPTER = this.DB_ADAPTERS.LOCALFORAGE;
                localforage.config({
                    name: this.DB_NAME
                });
            } else {
                throw new Error('localforage not found!');
            }
        },
        setBearerToken: function (bearerToken, expiresIn, callback) {
            var expiryDate = new Date(),
                expiryTime = (expiresIn * 1000) + expiryDate.getTime();

            localforage.setItem('BT', bearerToken, function (err, value) {
                if (!err) {
                    localforage.setItem('MSET', expiryTime, function (err, value) {
                        if (!err) {
                            if (typeof callback === 'function') {
                                callback(true);
                            }
                        } else {
                            if (typeof callback === 'function') {
                                callback(false);
                            }
                        }
                    });
                } else {
                    if (typeof callback === 'function') {
                        callback(false);
                    }
                }
            });
        },
        getBearerToken: function (callback) {
            var rs = {
                    result: false,
                    bearerToken: '',
                    expiryDate: new Date()
                };
            if (typeof callback === 'function') {
                localforage.getItem('BT', function (err, bt) {
                    if (!err) {
                        rs.bearerToken = bt;
                        localforage.getItem('MSET', function (err, mset) {
                            if (!err) {
                                rs.expiryDate.setTime(mset);
                                if (rs.expiryDate > new Date()) {
                                    if (rs.bearerToken) {
                                        try {
                                            $http.defaults.headers.common.Authorization = 'Bearer ' + rs.bearerToken;
                                            rs.result = true;
                                        } catch (e) {
                                            console.log(e);
                                            rs.result = false;
                                        }
                                    }
                                }

                                callback(rs);
                            } else {
                                callback(rs);
                            }
                        });
                    } else {
                        callback(rs);
                    }
                });
            } else {
                return new Promise(function () {
                    try {
                        localforage.getItem('BT', function (err, bt) {
                            if (!err) {
                                rs.bearerToken = bt;
                                localforage.getItem('MSET', function (err, mset) {
                                    if (!err) {
                                        rs.expiryDate.setTime(mset);
                                        if (rs.expiryDate > new Date()) {
                                            if (rs.bearerToken) {
                                                try {
                                                    $http.defaults.headers.common.Authorization = 'Bearer ' + rs.bearerToken;
                                                    rs.result = true;
                                                } catch (e) {
                                                    console.log(e);
                                                    rs.result = false;
                                                }
                                            }
                                        }
                                        resolve(rs);
                                    } else {
                                        reject(rs);
                                    }
                                });
                            } else {
                                reject(rs);
                            }
                        });
                    } catch (e) {
                        console.log(e);
                        reject(rs);
                    }
                });
            }
        },
        deleteUserData: function (callback) {
            try {
                localforage.removeItem('BT', function (err) {
                    if (!err) {
                        localforage.removeItem('MSET', function (err) {
                            if (!err) {
                                if (typeof callback === 'function') {
                                    callback(true);
                                }
                            } else {
                                console.log(err);
                                if (typeof callback === 'function') {
                                    callback(false);
                                }
                            }
                        });
                    } else {
                        console.log(err);
                        if (typeof callback === 'function') {
                            callback(false);
                        }
                    }
                });
            } catch (e) {
                console.log(e);
                if (typeof callback === 'function') {
                    callback(false);
                }
            }

        }
    };

    self.init();

    return self;
}