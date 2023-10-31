var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
// call init() once when the page is loaded
// Initialize circles on load
window.addEventListener('load', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
    animate();
});
// Resize the canvas and keep circles evenly distributed
window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});
//getting position of the cursor on the canvas
var mouse = {
    x: 0,
    y: 0,
    maxRadius: 40
};
window.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
    // console.log(mouse);
});
//functionality for mobile devices
window.addEventListener('touchstart', function (event) {
    event.preventDefault(); // Prevent the default touch event behavior
    var touch = event.touches[0]; // Get the first touch point
    mouse.x = touch.clientX;
    mouse.y = touch.clientY;
});
window.addEventListener("touchend", function () {
    // Clear the canvas when touch ends
    console.log("Touch End Event Detected");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Redraw all circles in their current state
    circles.forEach(function (circle) {
        circle.draw(ctx);
        circle.update(canvas);
    });
});
//randomised 5 colors for the circles stored in an array
var colorsArray = [
    '#2185C5',
    '#7ECEFD',
    '#FFF6E5',
    '#FF7F66',
    '#FFC0CB'
];
//class for creating circles
var Circle = /** @class */ (function () {
    function Circle(x, y, radius, dx, dy, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.dx = dx;
        this.dy = dy;
        this.color = color;
        this.originalRadius = radius;
    }
    Circle.prototype.draw = function (ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.max(this.radius, 0), 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    };
    Circle.prototype.update = function (canvas) {
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }
        this.x += this.dx;
        this.y += this.dy;
        //if statement for cursor interactivity
        if (mouse.x - this.x < 50 && mouse.x - this.x > -50 && mouse.y - this.y < 50 && mouse.y - this.y > -50) {
            if (this.radius < mouse.maxRadius) {
                this.radius += 2;
            }
            this.draw(ctx);
        }
        else {
            if (this.radius > this.originalRadius) {
                this.radius -= 2;
            }
        }
        //if statement for mobile interactivity
        var touch = { x: mouse.x, y: mouse.y };
        if (Math.abs(touch.x - this.x) < 50 && Math.abs(touch.y - this.y) < 50) {
            if (this.radius < mouse.maxRadius) {
                this.radius += 2;
            }
        }
        else {
            if (this.radius > this.originalRadius) {
                this.radius -= 2;
            }
        }
        this.draw(ctx);
    };
    return Circle;
}());
//class ends here.
//creating circles from this class using a for loop
var circles = [];
//function for checking if the device is mobile or not
function isMobile() {
    return window.innerWidth < 800;
}
function init() {
    //clearing the circles array before each resize
    circles.length = 0;
    var numCircles = isMobile() ? 500 : 800;
    for (var i = 0; i < numCircles; i++) {
        var radius = Math.random() * 10;
        var x = Math.random() * (canvas.width - radius * 2) + radius;
        var y = Math.random() * (canvas.height - radius * 2) + radius;
        var dx = (Math.random() - 0.5) * 2;
        var dy = (Math.random() - 0.5) * 2;
        //if you want randomised colors from the rgb spectrum
        // const color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
        // if you want randomised colors from the colorsArray ✔
        var color = colorsArray[Math.floor(Math.random() * colorsArray.length)];
        circles.push(new Circle(x, y, radius, dx, dy, color));
    }
}
//animating the created circles
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    circles.forEach(function (circle) {
        circle.draw(ctx);
        circle.update(canvas);
    });
}
// animate();
// console.log(circles);
//function  for grabbing the current cursor location on the canvas
