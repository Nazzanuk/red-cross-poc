app.component('alertItem', {
    templateUrl: 'alert.html',
    controllerAs: 'alert',
    bindings: {},
    controller: function (Alert) {

        var init = () => {};

        init();

        _.extend(this, {
            isVisible: Alert.isVisible,
            hide: Alert.hide,
            getContent: Alert.getContent
        });
    }
});
