app.service('Form', ($state, $stateParams, $timeout, $http) => {

    var formData = {}, $canvas, status = 'none', formUrl = "";

    var genPdf = () => {
        if ($canvas) saveImg($canvas);
        $timeout(() => $state.go('confirm'),100);
        return genForm();
    };

    var openPdf = () => {
        window.open(genPdfUrl(), "PDF");
    };

    var genPdfUrl = () => '/print/?formData=' + JSON.stringify(formData);

    var genForm = () => {
        status = 'sending';
        return $http.get(`/print/?formData=${JSON.stringify(formData)}`).then((response) => {
            status = 'complete';
            console.log('complete', response.data.formUrl);
            formUrl = response.data.formUrl;
        });
    };

    var saveImg = ($canvas) => {
        var img = $canvas[0].toDataURL("image/png");

        return $http.post('/image', {file: img, code: formData.signatureCode}).then((data) => {
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

    };

    var init = () => {
        events();
        loadFormData();
        //if (formData.signature) formData.signature = decodeURIComponent(formData.signature);
        console.log('initial formData:', formData);
    };

    init();

    return {
        getFormUrl: () => formUrl,
        getStatus: () => status,
        loadFormData,
        genForm,
        openPdf,
        getFormData: () => formData,
        updateParams,
        setCanvas: canvas => $canvas = canvas,
        getImg,
        genPdf,
        genPdfUrl
    };
});

