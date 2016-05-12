app.component('scanItem', {
    templateUrl: 'scan.html',
    controllerAs: 'scan',
    bindings: {
        img: '@',
        heading: '@'
    },
    controller: function ($element, $timeout, $scope) {

        var image = "", status = "empty", formData;

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

        var genFormData = () => {
            formData = {
                "firstName": _.sample(['Alex', 'Braidy', 'Kasey', 'Robin', 'Merle', 'Charley', 'Raine', 'Cary', 'Billy']),
                "lastName": _.sample(['Sinders', 'Varas', 'Isidoro', 'Smith', 'Connelly', 'Martins', 'Stuart', 'Jackson', 'Nelson', 'Osman', 'Mendez', 'Beckham', 'Morris', 'Ianson', 'Fishman', `Stoddard`, 'Cokes', 'Jolie', 'Smith']),
                "gender": _.sample(['M', 'F']),
                "age": _.random(18, 55),
                "nationality": _.sample(['British', 'French', 'American', 'Spanish', 'Mexican', 'German', 'Irish', 'Scottish', 'Portuguese']),
                "date": moment().format("DD MMM YYYY"),
                "time": moment().format("YYYYMMDD-HH:mm"),
                "collectionDate": moment().add(_.random(0, 50), ' days').format("DD MMM YYYY")
            };

            formData.email = formData.firstName.toLowerCase() + "." + formData.lastName.toLowerCase() + "@" + _.sample(['gmail', 'hotmail', 'yahoo', 'me']) + _.sample(['.com', '.net', '.co.uk', '.org']);
        };

        var getFormData = () => {
            return JSON.stringify(formData);
        };

        var init = () => {
            genFormData();
            events();
        };

        init();

        _.extend(this, {
            getFormData,
            getImage: () => image,
            isStatus: (string) => status == string
        });
    }
});



