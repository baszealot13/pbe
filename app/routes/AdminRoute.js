var AdminRoute = {
    setup: function (provider) {
        provider.when('/Administrator', {
            templateUrl: 'partials/back/main.html',
            controller: 'AdminController'
        });
        provider.when('/Administrator/UserSetup', {
            templateUrl: 'partials/back/main.html',
            controller: 'AdminController'
        });
        provider.when('/Administrator/UserSetup', {
            templateUrl: 'partials/back/main.html',
            controller: 'AdminController'
        });
        provider.when('/Administrator/UserSetup/User', {
            templateUrl: 'partials/back/userSetup.html',
            controller: 'UserSetupController'
        });
        provider.when('/Administrator/StudentRegistration', {
            templateUrl: 'partials/back/studentRegis.html',
            controller: 'StudentRegisController'
        });
        provider.when('/Administrator/LessonSetup', {
            templateUrl: 'partials/back/main.html',
            controller: 'AdminController'
        });
        provider.when('/Administrator/LessonSetup/LessonGroup', {
            templateUrl: 'partials/back/lessonGroupSetup.html',
            controller: 'LessonGroupSetupController'
        });
        provider.when('/Administrator/LessonSetup/Lesson', {
            templateUrl: 'partials/back/lessonSetup.html',
            controller: 'LessonSetupController'
        });
        provider.when('/Administrator/UserSetup/Authorization', {
            templateUrl: 'partials/back/main.html',
            controller: 'AdminController'
        });
        provider.otherwise({
            redirectTo: '/Administrator'
        });
    }
};