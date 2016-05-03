app.component('canvasItem', {
    templateUrl: 'canvas.html',
    controllerAs: 'canvas',
    transclude: {},
    bindings: {
        id:'@'
    },
    controller: function ($element, $timeout, $scope, Form, $http) {
        var color = '#111', thickness = 1, code = _.random(0,100000);

        var $canvas, ctx, paint = false, lastX = 0, lastY = 0;

        var clear = () => {
            ctx.clearRect(0, 0, $canvas[0].width, $canvas[0].height);
        };

        var genPdf = () => {
        };

        var setImg = () => {
            Form.setCanvas($canvas);
            Form.getFormData().signatureCode = code;
            Form.updateParams();
        };

        var events = () => {
            $canvas.on('mousedown touchstart', function (e) {
                console.log(e.type);
                paint = true;

                ctx.fillStyle = color;
                ctx.lineWidth = thickness;
                lastX = e.pageX - $canvas.offset().left;
                lastY = e.pageY - $canvas.offset().top;
                return false;
            });

            $canvas.on('mouseup mouseleave touchend', (e) => {
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

                var steep = (Math.abs(y2 - y1) > Math.abs(x2 - x1));
                if (steep) {
                    let x = x1;
                    x1 = y1;
                    y1 = x;

                    let y = y2;
                    y2 = x2;
                    x2 = y;
                }
                if (x1 > x2) {
                    let x = x1;
                    x1 = x2;
                    x2 = x;

                    let y = y1;
                    y1 = y2;
                    y2 = y;
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

                    if (steep) ctx.arc(y, x, thickness, 0, 2 * Math.PI, false);
                    else ctx.arc(x, y, thickness, 0, 2 * Math.PI, false);

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


        var init = () => {
            $canvas = $element.find('canvas');
            ctx = $canvas[0].getContext("2d");
            console.log($canvas.closest('.flex-content').width())
            $canvas[0].width = $canvas.closest('.flex-content').width();
            $canvas[0].height = 300;

            events();
        };

        init();

        _.extend(this, {
            genPdf,
            clear
        });
    }
});
