app.controller('DocumentsScreen', ($scope, $stateParams, State) => {

    var init = () => {};

    init();

    _.extend($scope, {

        isRecruiter: State.isRecruiter
    });
});