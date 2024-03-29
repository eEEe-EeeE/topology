var arrow = function () {
    this.x = 0;
    this.y = 0;
    this.color = "#f90";
    this.rolation = 0;
};

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

arrow.prototype.draw = function (ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rolation);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(0, 15);
    ctx.lineTo(-50, 15);
    ctx.lineTo(-50, -15);
    ctx.lineTo(0, -15);
    ctx.lineTo(0, -35);
    ctx.lineTo(50, 0);
    ctx.lineTo(0, 35);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
};

var Arrow = new arrow();
Arrow.x = canvas.width / 2;
Arrow.y = canvas.height / 2;

var c_x, c_y; //相对于canvas坐标的位置；
var isMouseDown = false;
Arrow.draw(ctx);
canvas.addEventListener('mousedown', function (e) {
    isMouseDown = true;
}, false);
canvas.addEventListener('mousemove', function (e) {
    if (isMouseDown === true) {
        c_x = getPos(e).x - canvas.offsetLeft;
        c_y = getPos(e).y - canvas.offsetTop;
        //setInterval(drawFram,1000/60)
        requestAnimationFrame(drawFram)
    }
}, false);
canvas.addEventListener('mouseup', function (e) {
    isMouseDown = false;
}, false);

function drawFram() {
    var dx = c_x - Arrow.x;
    var dy = c_y - Arrow.y;
    Arrow.rolation = Math.atan2(dy, dx);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    Arrow.draw(ctx)
}

function getPos(elem) {
    var mouse = {x: 0, y: 0};
    var e = elem || event;

    if (e.pageX || e.pageY) {
        mouse.x = e.pageX;
        mouse.y = e.pageY;
    } else {
        mouse.x = e.pageX + document.body.scrollLeft + document.document.documentElement.scrollLeft;
        mouse.y = e.pageY + document.body.scrollTop + document.document.documentElement.scrollTop;
    }
    return mouse;
}