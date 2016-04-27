app.service('Form', ($state, $stateParams, $timeout) => {

    var formData = {};

    var genPdfUrl = () => '/print/?formData=' + JSON.stringify(formData);

    var updateParams = () => {
        $state.transitionTo('home', {formData: JSON.stringify(formData)}, {notify: false, reload: false});
    };

    var events = () => {
        $('body').on('change', 'input', updateParams);
    };

    var getImg = () => decodeURIComponent(formData.signature);

    var init = () => {
        events();
        formData = $stateParams.formData ? JSON.parse($stateParams.formData) : formData;
        //if (formData.signature) formData.signature = decodeURIComponent(formData.signature);
        console.log('initial formData:', formData);
    };

    init();

    return {
        getFormData: () => formData,
        updateParams,
        getImg,
        genPdfUrl
    };
});

