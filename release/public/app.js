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
    $stateProvider.state(new Route('home', "/", resolve)).state(new Route('form', "/form/?formData", resolve)).state(new Route('about', "/about", resolve)).state(new Route('dashboard', "/dashboard", resolve)).state(new Route('scan', "/scan", resolve)).state(new Route('confirm', "/confirm", resolve));

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

app.service('DB', function ($state, $stateParams, $timeout, $http) {

    var API = '/db';

    var insert = function insert(collection, data) {
        return $http.post(API + '/' + collection, data).then(function (response) {
            console.log('response', response);
            return response.data;
        });
    };

    var load = function load(collection) {
        return $http.get(API + '/' + collection).then(function (response) {
            console.log('response', response);
            return response.data;
        });
    };

    var init = function init() {};

    init();

    return {
        load: load,
        insert: insert
    };
});

app.service('Form', function ($state, $stateParams, $timeout, $http, DB) {

    var formData = {
        "firstName": "",
        "lastName": "",
        "gender": _.sample(['M', 'F']),
        "date": moment().format("DD MMM YYYY")
    },
        $canvas,
        status = 'none',
        formUrl = "";

    var genPdf = function genPdf() {
        if ($canvas) saveImg($canvas);
        $timeout(function () {
            return $state.go('confirm');
        }, 500);
        return genForm();
    };

    var openPdf = function openPdf() {
        window.open(genPdfUrl(), "PDF");
    };

    var genPdfUrl = function genPdfUrl() {
        return '/print/?formData=' + JSON.stringify(formData);
    };

    var genForm = function genForm() {
        status = 'sending';
        return $http.get('/print/?formData=' + JSON.stringify(formData)).then(function (response) {
            status = 'complete';
            console.log('complete', response.data.formUrl);
            formUrl = response.data.formUrl;

            var clone = _.clone(formData);
            clone.formUrl = formUrl;
            DB.insert('forms', clone);
        });
    };

    var saveImg = function saveImg($canvas) {
        var img = $canvas[0].toDataURL("image/png");

        return $http.post('/image', { file: img, code: formData.signatureCode }).then(function (data) {
            console.log(data);
        });
    };

    var updateParams = function updateParams() {
        $state.transitionTo('form', { formData: JSON.stringify(formData) }, { notify: false, reload: false });
    };

    var events = function events() {
        $('body').on('change', '[screen="form"] input', updateParams);
    };

    var getImg = function getImg() {
        return decodeURIComponent(formData.signature);
    };

    var loadFormData = function loadFormData() {
        formData = $stateParams.formData ? JSON.parse($stateParams.formData) : formData;
    };

    var init = function init() {
        events();
        loadFormData();
        //if (formData.signature) formData.signature = decodeURIComponent(formData.signature);
        console.log('initial formData:', formData);
    };

    init();

    return {
        getFormUrl: function getFormUrl() {
            return formUrl;
        },
        getStatus: function getStatus() {
            return status;
        },
        loadFormData: loadFormData,
        genForm: genForm,
        openPdf: openPdf,
        getFormData: function getFormData() {
            return formData;
        },
        updateParams: updateParams,
        setCanvas: function setCanvas(canvas) {
            return $canvas = canvas;
        },
        getImg: getImg,
        genPdf: genPdf,
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

app.service('Scan', function ($state, $stateParams, $timeout, $http) {

    var init = function init() {};

    init();

    return {};
});

app.component('canvasItem', {
    templateUrl: 'canvas.html',
    controllerAs: 'canvas',
    transclude: {},
    bindings: {
        id: '@'
    },
    controller: function controller($element, $timeout, $scope, Form, $http) {
        var color = '#111',
            thickness = 1,
            code = _.random(0, 100000);

        var $canvas,
            ctx,
            paint = false,
            lastX = 0,
            lastY = 0;

        var clear = function clear() {
            ctx.clearRect(0, 0, $canvas[0].width, $canvas[0].height);
        };

        var genPdf = function genPdf() {};

        var setImg = function setImg() {
            Form.setCanvas($canvas);
            Form.getFormData().signatureCode = code;
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
            console.log($canvas.closest('.flex-content').width());
            $canvas[0].width = $canvas.closest('.flex-content').width();
            $canvas[0].height = 300;

            events();
        };

        init();

        _.extend(this, {
            genPdf: genPdf,
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

app.component('confirmItem', {
    templateUrl: 'confirm.html',
    controllerAs: 'confirm',
    bindings: {},
    controller: function controller($element, $timeout, $scope, Form) {

        var init = function init() {};

        init();

        _.extend(this, {
            isStatus: function isStatus(string) {
                return string == Form.getStatus();
            },
            getFormUrl: Form.getFormUrl
        });
    }
});

app.component('formListItem', {
    templateUrl: 'form-list.html',
    controllerAs: 'formList',
    bindings: {},
    controller: function controller($element, $timeout, $scope, DB) {

        var forms = [];

        var loadForms = function loadForms() {
            return DB.load('forms').then(function (data) {
                forms = data;
            });
        };

        var init = function init() {
            console.log('form-list init');
            loadForms();
        };

        init();

        _.extend(this, {
            getForms: function getForms() {
                return forms;
            }
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

app.component('scanItem', {
    templateUrl: 'scan.html',
    controllerAs: 'scan',
    bindings: {
        img: '@',
        heading: '@'
    },
    controller: function controller($element, $timeout, $scope) {

        var image = "",
            status = "empty",
            formData;

        var events = function events() {
            $($element).find('#scan-file').change(function () {
                console.log('hello');
                readURL(this);
            });
        };

        var simulate = function simulate() {
            status = "selected";

            $timeout(function () {
                return status = "populating";
            }, 3000);
            $timeout(function () {
                return status = "ready";
            }, 6000);
        };

        var readURL = function readURL(input) {
            if (input.files && input.files[0]) {
                console.log('hello1');
                var reader = new FileReader();
                reader.onload = function (e) {
                    console.log('hello2');
                    image = e.target.result;
                    simulate();
                    $scope.$apply();
                };
                reader.readAsDataURL(input.files[0]);
            }
        };

        var genFormData = function genFormData() {
            formData = {
                "firstName": _.sample(['Alex', 'Braidy', 'Kasey', 'Robin', 'Merle', 'Charley', 'Raine', 'Cary', 'Billy']),
                "lastName": _.sample(['Sinders', 'Jackson', 'Nelson', 'Osman', 'Mendez', 'Beckham', 'Morris', 'Ianson', 'Fishman', 'Stoddard', 'Cokes', 'Jolie', 'Smith']),
                "gender": _.sample(['M', 'F']),
                "date": moment().format("DD MMM YYYY"),
                "collectionDate": moment().add(_.random(0, 50), ' days').format("DD MMM YYYY")
            };
        };

        var getFormData = function getFormData() {
            return JSON.stringify(formData);
        };

        var init = function init() {
            genFormData();
            events();
        };

        init();

        _.extend(this, {
            getFormData: getFormData,
            getImage: function getImage() {
                return image;
            },
            isStatus: function isStatus(string) {
                return status == string;
            }
        });
    }
});

app.component('splashItem', {
    templateUrl: 'splash.html',
    controllerAs: 'splash',
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

app.controller('ConfirmScreen', function ($element, $timeout, $state, $stateParams, $scope, Form) {

    var init = function init() {};

    init();

    _.extend($scope, {});
});

app.controller('DashboardScreen', function ($element, $timeout, $state, $stateParams, $scope, Form) {

    var init = function init() {};

    init();

    _.extend($scope, {});
});

app.controller('FormScreen', function ($element, $timeout, $state, $stateParams, $scope, Form) {

    var init = function init() {
        Form.loadFormData();
    };

    init();

    _.extend($scope, {
        getFormData: Form.getFormData,
        updateParams: Form.updateParams,
        getImg: Form.getImg,
        genPdf: Form.genPdf,
        genPdfUrl: Form.genPdfUrl
    });
});

app.controller('HomeScreen', function ($element, $timeout, $state, $stateParams, $scope, Form) {

    var init = function init() {};

    init();

    _.extend($scope, {});
});

app.controller('ScanScreen', function ($element, $timeout, $state, $stateParams, $scope, Form) {

    var init = function init() {};

    init();

    _.extend($scope, {});
});