app.service('DB', ($state, $stateParams, $timeout, $http) => {

    var API = '/db';

    var insert = (collection, data) => {
        return $http.post(`${API}/${collection}`, data).then((response) => {
            console.log('response', response);
            return response.data
        });

    };

    var load = (collection) => {
        return $http.get(`${API}/${collection}`).then((response) => {
            console.log('response', response);
            return response.data

        });
    };

    var init = () => {

    };

    init();

    return {
        load,
        insert
    };
});

