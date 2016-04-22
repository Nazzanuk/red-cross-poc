app.controller('HomeScreen', ($element, $timeout, $state, $stateParams, $scope) => {

    var formData = {};

    var genPdfUrl = () => '/print/?formData=' + JSON.stringify(formData);

    var updateParams = () => {
        $state.transitionTo('home', {formData: JSON.stringify(formData)}, {notify: false, reload: false});
    };

    var events = () => {
        $element.on('change', 'input', updateParams);
    };

    var init = () => {
        events();
        formData = $stateParams.formData ? JSON.parse($stateParams.formData) : formData;
        console.log('initial formData:', formData);
    };

    init();

    _.extend($scope, {
        getFormData: () => formData,
        updateParams,
        genPdfUrl
    });
});



