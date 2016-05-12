app.service('Socket', (Alert, $rootScope, $state) => {
    var socket;

    var events = () => {
        socket.on('connect', (data) => {
            console.log('connected to server')
        });

        socket.on('testing', (data) => {
            console.log(data);
        });

        socket.on('alert', (data) => {
            console.log(data);
            console.log($state.current.name == 'dashboard');
            if ($state.current.name == 'dashboard') Alert.show(data.content);

            $rootScope.$broadcast('loadForms');
            $rootScope.$apply();

        });
    };

    var init = () => {
        socket = io();

        events();
    };

    init();

    return {}
});

