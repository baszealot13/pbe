"use strict";

controllers.controller('StudentRegisController', 
    ['$rootScope', '$routeParams', '$location', '$scope', '$q', '$timeout', 'RoleRouteMap', 'Student', 'LocalDBService', 'NotyHelper', 'ValidateService', 'SweetAlert', 
    function ($rootScope, $routeParams, $location, $scope, $q, $timeout, RoleRouteMap, Student, LocalDB, NotyHelper, Validate, SweetAlert) {

    $rootScope.requireUI = true;

    $scope.Breadcrumb = [];

    var currentPath = $location.path(),
        locationPath = '';
    
    for (var path in currentPath.split('/')) {
        var pathVal = currentPath.split('/')[path];
        locationPath += pathVal + '/';

        if (pathVal) {
            $scope.Breadcrumb.push({ title: pathVal, locationPath: locationPath.substr(0, locationPath.length-1) });
        }
    }

    $scope.student = [];
    $scope.studentData = {};

    $scope.modalTitle = '';
    $scope.isNew = false;

    $scope.rules = {
        requires: [
            { id: 'std_firstname', text: 'Firstname' },
            { id: 'std_lastname', text: 'Lastname' },
            { id: 'std_username', text: 'std_username' },
            { id: 'std_birthday', text: 'Birthday' },
            { id: 'std_phonenumber1', text: 'Phonenumber' }]
    };

    $scope.openForm = function (stdId) {
        if (typeof stdId !== 'undefined' && stdId !== null) {
            Student.get({ std_id: stdId}, function (student) {
                $scope.studentData = student;
                $scope.modalTitle = '#' + student.std_title;
                $scope.isNew = false;
            });
        } else {
            $scope.studentData = new Student();
            $scope.modalTitle = 'NEW STUDENT';
            $scope.isNew = true;
        }

        console.log('$scope.studentData: ', $scope.studentData);
        $('#studentModal').modal('show');
    };

    $scope.create = function (studentData) {
        $scope.$emit('beginLoading', true);
        if (Validate.check(studentData, $scope.rules) === true) {
            studentData.$create().then(function (rs) {
                if (rs) {
                    SweetAlert.swal({ 
                        title: 'Successed', 
                        text: '<h3 class="text-info"><small class="text-mute">Username:</small> ' + rs.userTitle + '</h3><h3 class="text-warning"><small class="text-mute">Password:</small> ' + rs.userPasswd + '</h3>', 
                        type: 'success',
                        html: true
                    }, function(){ 
                        _getStudent();
                    });
                    // noty({ theme: 'relax', type: 'success', text: 'Save successed.', timeout: 3000 });
                }
                $('#studentModal').modal('hide');
                $scope.$emit('endLoading');
            }, function (err) {
                console.log(err);
                NotyHelper.displayError(err);
                $scope.$emit('endLoading');
            });
        } else {
            $scope.$emit('endLoading');
        }
    };

    $scope.update = function (studentData) {
        $scope.$emit('beginLoading', true);
        if (Validate.check(studentData, $scope.rules) === true) {
            studentData.$update().then(function (rs) {
                if (rs.result === true) {
                    noty({ theme: 'relax', type: 'success', text: 'Save successed.', timeout: 3000 });
                    _getStudent();
                }
                $('#studentModal').modal('hide');
                $scope.$emit('endLoading');
            }, function (err) {
                // $('#studentModal').modal('hide');
                NotyHelper.displayError(err);
                $scope.$emit('endLoading');
            });
        } else {
            $scope.$emit('endLoading');
        }
    };

    $scope.delete = function (stdId) {

        noty({
            text: 'Delete this student, Do you want to continue?',
            buttons: [
                { 
                    addClass: 'btn btn-success', 
                    text: 'Ok', 
                    onClick: function($noty) {
                        $scope.$emit('beginLoading', true);

                        Student.get({ std_id: stdId}, function (student) {
                            if (student) {
                                student.$delete().then(function (rs) {
                                    if (rs.result === true) {
                                        noty({ theme: 'relax', type: 'success', text: 'This student was deleted.', timeout: 3000 });
                                        _getStudent();
                                        $scope.$emit('endLoading');
                                    }
                                });
                            } else {
                                 _getStudent();
                                $scope.$emit('endLoading');
                            }

                            $noty.close();
                        });
                    }
                }, {
                    addClass: 'btn btn-danger', 
                    text: 'Cancel', 
                    onClick: function($noty) {
                        $noty.close();
                    }
                }
            ]
        });
    }

    var _getStudent = function () {
        Student.get(function (result) {
            $scope.lessonGroup = result.data;
            $scope.$emit('endLoading');
        });
    };

    $('#StudentModal').on('hide.bs.modal', function (e) {
        $scope.studentData = {};
    });

    LocalDB.getBearerToken(function (rs) {
        $scope.$emit('beginLoading', true);
        if (rs.result === true) {
            RoleRouteMap.getAccessRoute({ route_path: $location.path() }, function (acr) {
                if (acr.data.length > 0) {
                    _getStudent();
                } else {
                    $location.path('/');
                    $scope.$emit('endLoading');
                }
            });
        } else {
            $location.path('/');
            $scope.$emit('endLoading');
        }
    });
}]);