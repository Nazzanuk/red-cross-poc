app.config(($stateProvider, $urlRouterProvider, $locationProvider) => {

    //this controls the animations for each transition
    var resolve = {
        timeout: ($timeout) => {
            $('[screen]').removeClass('active');
            $timeout(() => $('[screen]').addClass('active'), 350);
            return $timeout(300);
        }
    };

    // For any unmatched url, redirect to /
    $urlRouterProvider.otherwise("/");

    // Now set up the states
    $stateProvider
        .state(new Route('home', "/", resolve))
        .state(new Route('form', "/form/?formData", resolve))
        .state(new Route('about', "/about", resolve))
        .state(new Route('scan', "/scan", resolve))
        .state(new Route('confirm', "/confirm", resolve));

    //use real urls instead of hashes
    //$locationProvider.html5Mode(true);
});

class Route {
    constructor(name, url, resolve, params) {
        _.extend(this, {
            name,
            url,
            params,
            templateUrl: `${_.kebabCase(name)}-screen.html`,
            controller: _.upperFirst(_.camelCase(`${name}Screen`)),
            reloadOnSearch: false,
            resolve
        });
    }
}