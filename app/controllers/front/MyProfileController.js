"use strict";

controllers.controller('MyProfileController', ['$rootScope', '$scope', '$timeout', 'User', 'LocalDBService', 'ValidateService', 'NotyHelper', function ($rootScope, $scope, $timeout, User, LocalDB, Validate, NotyHelper) {
    // $scope.title = 'Your title controller';

    $rootScope.requireUI = true;

    $scope.changePasswdFrom = false;
    $scope.rowData = {};
    $scope.rules = {
        requires: [{ id: 'curPassword', text: 'Current Password' },
            { id: 'newPassword', text: 'New Password' },
            { id: 'confPassword', text: 'Confirm New Password' }]
    };


    $scope.changePassword = function () {
        $scope.changePasswdFrom = true;
    };

    $scope.saveChangePasswd = function (data) {
        if (Validate.check(data, $scope.rules) === true) {
            User.changePassword(data, function () {
                noty({ theme: 'relax', type: 'success', text: 'Save successed.', timeout: 3000 });
                $scope.changePasswdFrom = false;
                $scope.rowData = {
                        curPassword: null,
                        newPassword: null,
                        confPassword: null
                    };
            }, function (err) {
                NotyHelper.displayError(err);
                $scope.$emit('endLoading');
            });
        }
    };


    LocalDB.getBearerToken(function (rs) {
        $scope.$emit('beginLoading', true);
        if (rs.result === true) {
            User.getMyProfile(function (profile) {
                $scope.title = profile.usr_title;

                $scope.$emit('endLoading');
            });
        }
    });

}]);