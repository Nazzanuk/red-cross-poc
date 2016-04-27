'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var app = angular.module('app', ['ui.router']);

app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind('keypress', function (event) {
            if (event.which !== 13) return;
            scope.$apply(function () {
                return scope.$eval(attrs.ngEnter, { $event: event });
            });
            event.preventDefault();
        });
    };
});

app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

    //this controls the animations for each transition
    var resolve = {
        timeout: function timeout($timeout) {
            $('[screen]').removeClass('active');
            $timeout(function () {
                return $('[screen]').addClass('active');
            }, 350);
            return $timeout(300);
        }
    };

    // For any unmatched url, redirect to /
    $urlRouterProvider.otherwise("/");

    // Now set up the states
    $stateProvider.state(new Route('home', "/?formData", resolve)).state(new Route('about', "/about", resolve));

    //use real urls instead of hashes
    //$locationProvider.html5Mode(true);
});

var Route = function Route(name, url, resolve, params) {
    _classCallCheck(this, Route);

    _.extend(this, {
        name: name,
        url: url,
        params: params,
        templateUrl: _.kebabCase(name) + '-screen.html',
        controller: _.upperFirst(_.camelCase(name + 'Screen')),
        reloadOnSearch: false,
        resolve: resolve
    });
};

app.service('Canvas', function ($state, $stateParams, $timeout) {

    //var formData = {};
    //
    //var genPdfUrl = () => '/print/?formData=' + JSON.stringify(formData);
    //
    //var updateParams = () => {
    //    $state.transitionTo('home', {formData: JSON.stringify(formData)}, {notify: false, reload: false});
    //};
    //
    //var events = () => {
    //    $('body').on('change', 'input', updateParams);
    //};
    //
    //var init = () => {
    //    events();
    //    formData = $stateParams.formData ? JSON.parse($stateParams.formData) : formData;
    //    console.log('initial formData:', formData);
    //};
    //
    //init();
    //
    //return {
    //    getFormData: () => formData,
    //    updateParams,
    //    genPdfUrl
    //};
});

app.service('Form', function ($state, $stateParams, $timeout) {

    var formData = {};

    var genPdfUrl = function genPdfUrl() {
        return '/print/?formData=' + JSON.stringify(formData);
    };

    var updateParams = function updateParams() {
        $state.transitionTo('home', { formData: JSON.stringify(formData) }, { notify: false, reload: false });
    };

    var events = function events() {
        $('body').on('change', 'input', updateParams);
    };

    var getImg = function getImg() {
        return decodeURIComponent(formData.signature);
    };

    var init = function init() {
        events();
        formData = $stateParams.formData ? JSON.parse($stateParams.formData) : formData;
        //if (formData.signature) formData.signature = decodeURIComponent(formData.signature);
        console.log('initial formData:', formData);
    };

    init();

    return {
        getFormData: function getFormData() {
            return formData;
        },
        updateParams: updateParams,
        getImg: getImg,
        genPdfUrl: genPdfUrl
    };
});

app.service('Menu', function ($state, $stateParams, $timeout) {

    var currentPage,
        pages = [{ name: "Home", slug: "home" }
    //{name: "About", slug: "about"}
    ];

    var setPage = function setPage(slug) {
        currentPage = slug;
        $state.go(slug);
    };

    var isCurrentPage = function isCurrentPage(slug) {
        return slug == (currentPage || $state.current.name);
    };

    var init = function init() {
        console.log($state);
        console.log('$state.get()', $state.get());
    };

    init();

    return {
        getPages: function getPages() {
            return pages;
        },
        setPage: setPage,
        isCurrentPage: isCurrentPage
    };
});

app.component('canvasItem', {
    templateUrl: 'canvas.html',
    controllerAs: 'canvas',
    transclude: {},
    bindings: {},
    controller: function controller($element, $timeout, $scope, Form, $http) {
        var color = '#111',
            thickness = 1;

        var $canvas,
            ctx,
            paint = false,
            lastX = 0,
            lastY = 0;

        var clear = function clear() {
            ctx.clearRect(0, 0, $canvas[0].width, $canvas[0].height);
        };

        var saveImg = function saveImg() {

            var img = $canvas[0].toDataURL("image/png");

            $http.post('/image', { file: img }).then(function (data) {
                console.log(data);
            });
        };

        var setImg = function setImg() {
            var img = $canvas[0].toDataURL("image/png");
            Form.getFormData().signature = encodeURIComponent(img);
            Form.updateParams();
        };

        var events = function events() {
            $canvas.on('mousedown touchstart', function (e) {
                console.log(e.type);
                paint = true;

                ctx.fillStyle = color;
                ctx.lineWidth = thickness;
                lastX = e.pageX - $canvas.offset().left;
                lastY = e.pageY - $canvas.offset().top;
                return false;
            });

            $canvas.on('mouseup mouseleave touchend', function (e) {
                setImg();
                console.log(e.type);
                paint = false;
                $scope.$apply();
            });

            $canvas.on('mousemove touchmove', function (e) {
                //console.log('e', e);
                //console.log('this', this);
                //console.log(e.pageY - $canvas.offset().top);
                //console.log(e.pageY - $canvas.offsetTop);

                if (!paint) return;
                var mouseX = e.pageX - $canvas.offset().left;
                var mouseY = e.pageY - $canvas.offset().top;

                if (e.type == 'touchmove') {
                    mouseX = e.originalEvent.touches[0].clientX - $canvas.offset().left;
                    mouseY = e.originalEvent.touches[0].clientY - $canvas.offset().top;
                }

                // find all points between
                var x1 = mouseX,
                    x2 = lastX,
                    y1 = mouseY,
                    y2 = lastY;

                var steep = Math.abs(y2 - y1) > Math.abs(x2 - x1);
                if (steep) {
                    var _x = x1;
                    x1 = y1;
                    y1 = _x;

                    var _y = y2;
                    y2 = x2;
                    x2 = _y;
                }
                if (x1 > x2) {
                    var _x2 = x1;
                    x1 = x2;
                    x2 = _x2;

                    var _y2 = y1;
                    y1 = y2;
                    y2 = _y2;
                }

                var dx = x2 - x1,
                    dy = Math.abs(y2 - y1),
                    error = 0,
                    de = dy / dx,
                    yStep = -1,
                    y = y1;

                if (y1 < y2) yStep = 1;

                for (var x = x1; x < x2; x++) {
                    ctx.beginPath();

                    if (steep) ctx.arc(y, x, thickness, 0, 2 * Math.PI, false);else ctx.arc(x, y, thickness, 0, 2 * Math.PI, false);

                    ctx.fillStyle = color;
                    ctx.fill();

                    error += de;
                    if (error >= 0.5) {
                        y += yStep;
                        error -= 1.0;
                    }
                }

                lastX = mouseX;
                lastY = mouseY;
                return false;
            });
        };

        var init = function init() {
            $canvas = $element.find('canvas');
            ctx = $canvas[0].getContext("2d");
            $canvas[0].width = 300;
            $canvas[0].height = 300;

            events();
        };

        init();

        _.extend(this, {
            saveImg: saveImg,
            clear: clear
        });
    }
});

app.component('contentItem', {
    templateUrl: 'content.html',
    controllerAs: 'content',
    transclude: {
        content: '?content'
    },
    bindings: {},
    controller: function controller($element, $timeout, $state, $stateParams) {
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

app.component('headerItem', {
    templateUrl: 'header.html',
    controllerAs: 'header',
    bindings: {
        img: '@'
    },
    controller: function controller(Menu) {

        var init = function init() {};

        init();

        _.extend(this, {
            getPages: Menu.getPages,
            setPage: Menu.setPage,
            isCurrentPage: Menu.isCurrentPage
        });
    }
});

app.component('heroItem', {
    templateUrl: 'hero.html',
    controllerAs: 'hero',
    bindings: {
        img: '@',
        heading: '@'
    },
    controller: function controller($element, $timeout) {

        var init = function init() {};

        init();

        _.extend(this, {});
    }
});

app.component('tableItem', { templateUrl: 'table.html' });

app.component('tableRow', { templateUrl: 'table-row.html' });

app.component('tableHeader', {
    templateUrl: 'table-header.html',
    controllerAs: 'header',
    bindings: {
        label: '@'
    }
});

app.component('tableField', {
    templateUrl: 'table-field.html',
    controllerAs: 'field',
    bindings: {
        label: '@',
        id: '@'
    },
    controller: function controller($scope, Form) {
        _.extend($scope, {
            getFormData: Form.getFormData,
            updateParams: Form.updateParams,
            genPdfUrl: Form.genPdfUrl
        });
    }
});

app.component('tableContents', {
    templateUrl: 'table-contents.html',
    controllerAs: 'contents',
    transclude: {},
    bindings: {
        items: '='
    }
});

app.controller('AboutScreen', function ($element, $timeout, $scope) {

    var init = function init() {
        //$timeout(() => $element.find('[screen]').addClass('active'), 50);
    };

    init();

    _.extend($scope, {});
});

app.controller('HomeScreen', function ($element, $timeout, $state, $stateParams, $scope, Form) {

    var init = function init() {};

    init();

    _.extend($scope, {
        getFormData: Form.getFormData,
        updateParams: Form.updateParams,
        getImg: Form.getImg,
        genPdfUrl: Form.genPdfUrl
    });
});