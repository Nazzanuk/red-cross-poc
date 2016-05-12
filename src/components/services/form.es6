app.service('Form', ($state, $stateParams, $timeout, $http, DB) => {

    var formData = {
        "firstName": "",
        "lastName": "",
        "gender": _.sample(['M', 'F']),
        "date": moment().format("DD MMM YYYY")
    }, $canvas, status = 'none', formUrl = "";

    var genPdf = () => {
        if ($canvas) saveImg($canvas);
        $timeout(() => $state.go('confirm'),500);
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

            var clone = _.clone(formData);
            clone.formUrl = formUrl;
            DB.insert('forms', clone);

            var options = {
                body: `A form has been completed by ${formData.firstName} ${formData.lastName}`,
                icon: "http://www.crwflags.com/fotw/images/i/icrc-c.gif"
            };
            var n = new Notification('American Red Cross', options);

            n.onclick = function (event) {
                event.preventDefault(); // prevent the browser from focusing the Notification's tab
                window.open('/#/dashboard', '_blank');
            }
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

