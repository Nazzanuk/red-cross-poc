app.component('contentItem', {
    templateUrl: 'content.html',
    controllerAs: 'content',
    transclude: {
        content: '?content'
    },
    bindings: {},
    controller: function ($element, $timeout, $state, $stateParams) {
        //var formData = {
        //
        //};
        //
        //var updateParams = (field, data) => {
        //    console.log('updateParams', field, data)
        //    formData[field] = data;
        //    $state.go('home', {formData: JSON.stringify(formData)});
        //
        //};
        //
        //
        //var init = () => {
        //    if ($stateParams.formData) formData = JSON.parse($stateParams.formData);
        //    console.log('initial formData:', formData);
        //    //$state.transitionTo('home', {q: 'updated search term'});
        //
        //};

        //init();

        _.extend(this, {
            //genPdfUrl
            //getFormData: () => formData,
            //updateParams
        });
    }
});
