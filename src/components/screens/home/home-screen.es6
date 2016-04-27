app.controller('HomeScreen', ($element, $timeout, $state, $stateParams, $scope, Form) => {

    var init = () => {

    };

    init();

    _.extend($scope, {
        getFormData: Form.getFormData,
        updateParams: Form.updateParams,
        getImg: Form.getImg,
        genPdf:Form.genPdf,
        genPdfUrl:Form.genPdfUrl
    });
});



