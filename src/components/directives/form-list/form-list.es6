app.component('formListItem', {
    templateUrl: 'form-list.html',
    controllerAs: 'formList',
    bindings: {},
    controller: function ($element, $timeout, $scope, DB) {

        var forms = [];

        var loadForms = () => {
            return DB.load('forms').then((data) => {
                console.log('hello')
                forms = data;
            });
        };

        var events = () => {
            $scope.$on('loadForms', loadForms);
        };

        var init = () => {
            console.log('form-list init');
            loadForms();
            events();
        };

        init();

        _.extend(this, {
            getForms:() => forms
        });
    }
});



