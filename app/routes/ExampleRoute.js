var ExampleRoute = {
    setup: function (provider) {
        provider.when('/Example/ReadPlay', {
            templateUrl: 'partials/examples/readplay.html',
            controller: 'ReadPlayController'
        });
        provider.when('/Example/ReadMidi', {
            templateUrl: 'partials/examples/readmidi.html',
            controller: 'ReadMidiController'
        });
        provider.when('/Example/WebMidi', {
            templateUrl: 'partials/examples/webmidi.html',
            controller: 'WebMidiController'
        });
        provider.when('/Example/', {
            templateUrl: 'partials/examples/component.html',
            controller: 'ComponentController'
        });
        provider.when('/Example/Component', {
            templateUrl: 'partials/examples/component.html',
            controller: 'ComponentController'
        });
        provider.when('/Example/AudioApi', {
            templateUrl: 'partials/examples/audioApi.html',
            controller: 'AudioApiController'
        });
    }
};