app.service('DB', ($state, $stateParams, $timeout, $http) => {

    var API = '/db';

    var insert = (collection, data) => {
        return $http.post(`${API}/${collection}`, data).then((response) => {
            console.log('response', response);
            return response.data
        });

    };

    var load = (collection) => {
        console.log('hello!');
        return $http.get(`${API}/${collection}`).then((response) => {
            console.log('load response', response);
            return response.data
        }, console.log);
    };

    var init = () => {

    };

    init();

    return {
        load,
        insert
    };
});

