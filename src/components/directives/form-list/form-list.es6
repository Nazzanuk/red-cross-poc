app.component('formListItem', {
    templateUrl: 'form-list.html',
    controllerAs: 'formList',
    bindings: {},
    controller: function ($element, $timeout, $scope, DB) {

        var forms = [];

        var loadForms = () => {
            return DB.load('forms').then((data) => {
                forms = data;
            });
        };

        var init = () => {
            console.log('form-list init')
            loadForms()
        };

        init();

        _.extend(this, {
            getForms:() => forms
        });
    }
});



