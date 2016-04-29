app.component('scanItem', {
    templateUrl: 'scan.html',
    controllerAs: 'scan',
    bindings: {
        img: '@',
        heading: '@'
    },
    controller: function ($element, $timeout, $scope) {

        var image = "", status = "empty";

        var events = () => {
            $($element).find('#scan-file').change(function () {
                console.log('hello');
                readURL(this);
            });

        };

        var simulate = () => {
            status = "selected";

            $timeout(() => status = "populating", 3000);
            $timeout(() => status = "ready", 6000);

        };

        var readURL = (input) => {
            if (input.files && input.files[0]) {
                console.log('hello1');
                var reader = new FileReader();
                reader.onload = (e) => {
                    console.log('hello2');
                    image = e.target.result;
                    simulate();
                    $scope.$apply();
                };
                reader.readAsDataURL(input.files[0]);
            }
        };

        var init = () => {
            events();
        };

        init();

        _.extend(this, {
            getFormData: () => JSON.stringify({"lastName":"Nelson","collectionDate":"29/04/2016","undefined":"34078934164"}),
            getImage: () => image,
            isStatus: (string) => status == string
        });
    }
});



