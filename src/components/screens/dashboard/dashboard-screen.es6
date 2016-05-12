app.controller('DashboardScreen', ($element, $timeout, $state, $stateParams, $scope, Form) => {

    var init = () => {

        Notification.requestPermission().then(function(result) {
            console.log('Notification', result);
        });
    };

    init();

    _.extend($scope, {
    });
});



