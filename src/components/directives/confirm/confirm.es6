app.component('confirmItem', {
    templateUrl: 'confirm.html',
    controllerAs: 'confirm',
    bindings: {},
    controller: function ($element, $timeout, $scope, Form) {

        var init = () => {
        };

        init();

        _.extend(this, {
            isStatus: (string) => string == Form.getStatus(),
            getFormUrl: Form.getFormUrl
        });
    }
});



