app.component('tableItem', {templateUrl: 'table.html'});

app.component('tableRow', {templateUrl: 'table-row.html'});

app.component('tableHeader', {
    templateUrl: 'table-header.html',
    controllerAs: 'header',
    bindings: {
        label:'@'
    }
});

app.component('tableField', {
    templateUrl: 'table-field.html',
    controllerAs: 'field',
    bindings: {
        label:'@',
        id:'@'
    },
    controller: function ($scope, Form) {
        _.extend($scope, {
            getFormData: Form.getFormData,
            updateParams: Form.updateParams,
            genPdfUrl:Form.genPdfUrl
        });
    }
});

app.component('tableContents', {
    templateUrl: 'table-contents.html',
    controllerAs: 'contents',
    transclude: {},
    bindings: {
        items:'='
    }
});
