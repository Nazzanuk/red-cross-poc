app.service('Form', ($state, $stateParams, $timeout, $http) => {

    var formData = {}, $canvas;

    var genPdf = () => {
        if ($canvas) saveImg($canvas);
        window.open(genPdfUrl(), "PDF");
    };

    var genPdfUrl = () => '/print/?formData=' + JSON.stringify(formData);

    var saveImg = ($canvas) => {
        var img = $canvas[0].toDataURL("image/png");

        return $http.post('/image', {file: img, code:formData.signatureCode}).then((data) => {
            console.log(data);
        });
    };

    var updateParams = () => {
        $state.transitionTo('form', {formData: JSON.stringify(formData)}, {notify: false, reload: false});
    };

    var events = () => {
        $('body').on('change', '[screen="form"] input', updateParams);
    };

    var getImg = () => decodeURIComponent(formData.signature);

    var loadFormData = () => {
        formData = $stateParams.formData ? JSON.parse($stateParams.formData) : formData;

    }

    var init = () => {
        events();
        loadFormData();
        //if (formData.signature) formData.signature = decodeURIComponent(formData.signature);
        console.log('initial formData:', formData);
    };

    init();

    return {
        loadFormData,
        getFormData: () => formData,
        updateParams,
        setCanvas: canvas => $canvas = canvas,
        getImg,
        genPdf,
        genPdfUrl
    };
});

