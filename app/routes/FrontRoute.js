var FrontRoute = {
    setup: function (provider) {
        provider.when('/Practices', {
            templateUrl: 'partials/front/lessonGroup.html',
            controller: 'LessonGroupController'
        });
        provider.when('/LessonList', {
            templateUrl: 'partials/front/lessonList.html',
            controller: 'LessonListController'
        });
        provider.when('/LessonList/:ls_lsg_id', {
            templateUrl: 'partials/front/lessonList.html',
            controller: 'LessonListController'
        });
        provider.when('/Lesson/:ls_id', {
            templateUrl: 'partials/front/lesson.html',
            controller: 'LessonController'
        });
        provider.when('/EarTraining/ChordProgressions', {
            templateUrl: 'partials/front/chordProgressions.html',
            controller: 'ChordProgressionsController'
        });
        provider.when('/MyProfile', {
            templateUrl: 'partials/front/myProfile.html',
            controller: 'MyProfileController'
        });
        provider.when('/Login', {
            templateUrl: 'partials/login.html',
            controller: 'LoginController'
        });
        provider.when('/', {
            templateUrl: 'partials/front/dashBoard.html',
            controller: 'DashBoardController'
        });
        provider.otherwise({
            redirectTo: '/'
        });
    }
};