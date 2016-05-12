app.service('Alert', () => {
    var visible = false, content = "";

    var show = (text) => {
        visible = true;
        content = text;
    };

    var init = () => {};

    init();

    return {
        isVisible: () => visible,
        hide: () => visible = false,
        show,
        getContent: () => content
    }
});

