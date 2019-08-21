
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var raf;
var running = false;

function BaseImage () {

    var that = this;
    // 图形的矩形坐标系的位置
    this.rectX = 200;
    this.rectY = 100;
    // 图形的矩形的宽和高
    this.rectW = 75;
    this.rectH = 95;

    // 图形的矩形坐标系的移位向量
    this.shiftV = new Point(0, 0);
    // 图形的矩形坐标系的旋转角度
    this.rectTheta = 0;

    var radius = 10;

    this.vx = 5;
    this.vy = 1;
    var strokeStyle = 'rgba(0, 0, 0, 1)';
    var fillStyle = 'rgba(255, 0, 0, 0.9)';

    this.isButtonDown = false;
    this.isButtonUp = false;
    this.isRotating = false;
    this.isSelected = false;

    // 在矩形坐标系中画图
    this.drawRect = function() {
        ctx.save();
        ctx.translate(this.rectX + this.shiftV.getX(), this.rectY + this.shiftV.getY());
        ctx.rotate(this.rectTheta);
        ctx.fillStyle = fillStyle;
        ctx.strokeStyle = strokeStyle;

        ctx.beginPath();
        ctx.rect(0, 0, this.rectW, this.rectH);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        ctx.restore();
    };

    this.drawButton = function() {

        ctx.save();
        ctx.translate(this.rectX + this.shiftV.getX(), this.rectY + this.shiftV.getY());
        ctx.rotate(this.rectTheta);

        ctx.beginPath();
        ctx.arc(this.rectW / 2, this.rectH + 2 * radius, radius, 0, 2 * Math.PI, true);

        ctx.moveTo(this.rectW / 2, this.rectH + 2 * radius);
        ctx.arc(this.rectW / 2, this.rectH + 2 * radius, radius / 2, 0, 2 * Math.PI, true);

        ctx.moveTo(this.rectW / 2, this.rectH + radius);
        ctx.lineTo(this.rectW / 2, this.rectH);
        ctx.stroke();
        ctx.closePath();

        ctx.restore();
    };

    this.isInImage = function (x, y) {
        var p = pointRelativeImage(x, y, this);
        x = p.getX();
        y = p.getY();
        return x >= 0 && x <= this.rectW && y >= 0 && y <= this.rectH;
    };

    this.isInButton = function (x, y) {
        var p = pointRelativeImage(x, y, this);
        x = p.getX();
        y = p.getY();
        return radius - Math.sqrt(
            Math.pow(x - (this.rectW / 2), 2)
            + Math.pow(y - (this.rectH + 2 * radius), 2)) >= 0;
    }
}

function Point(x, y) {
    var p_x = x;
    var p_y = y;
    this.getX = function () {
        return p_x;
    };
    this.getY = function () {
        return p_y;
    };
    this.setX = function (x) {
        p_x = x;
    };
    this.setY = function (y) {
        p_y = y;
    }
}

function rotateVector(x, y, angle) {
    return new Point(x * Math.cos(angle) - y * Math.sin(angle), x * Math.sin(angle) + y * Math.cos(angle));
}

function rotateImage(image, offset_x, offset_y) {
    var center = new Point(-image.rectW / 2, -image.rectH / 2);
    image.rectTheta = Math.atan2(offset_y - (image.rectY + image.rectH / 2), offset_x - (image.rectX + image.rectW / 2)) - Math.PI / 2;
    var newCenter = rotateVector(center.getX(), center.getY(), image.rectTheta);
    image.shiftV.setX(newCenter.getX() - center.getX());
    image.shiftV.setY(newCenter.getY() - center.getY());

    image.drawRect();
    image.drawButton();
}

function pointRelativeImage(x, y, image) {
    x = x - (image.rectX + image.shiftV.getX());
    y = y - (image.rectY + image.shiftV.getY());
    return rotateVector(x, y, -image.rectTheta);
}

function clear(transparency = 1) {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, ' + transparency + ')';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.restore();
}

// function draw() {
//     clear();
//     var image = new BaseImage();
//     image.drawRect();
//     image.x += image.vx;
//     image.y += image.vy;
//
//     if (image.y + image.vy > canvas.height || image.y + image.vy < 0) {
//         image.vy = -image.vy;
//     }
//     if (image.x + image.vx > canvas.width || image.x + image.vx < 0) {
//         image.vx = -image.vx;
//     }
//
//     raf = window.requestAnimationFrame(draw);
// }

var image = new BaseImage();

canvas.addEventListener('click',function(e){
    if (image.isInImage(e.offsetX, e.offsetY) && !image.isSelected) {
        image.isSelected = true;
        clear();
        ctx.save();
        image.drawButton();
        image.drawRect();
        ctx.restore();

    } else if (image.isInImage(e.offsetX, e.offsetY) && image.isSelected) {
        image.isSelected = false;
        clear();
        ctx.save();
        image.drawRect();
        ctx.restore();
    }

});
canvas.addEventListener('mousedown', function(e){
    image.isButtonUp = false;
    image.isButtonDown = true;
    if (image.isInButton(e.offsetX, e.offsetY)) {
        image.isRotating = true;
    }
});
canvas.addEventListener('mousemove', function(e){
    if (image.isButtonDown && image.isRotating) {
        clear();
        rotateImage(image, e.offsetX, e.offsetY);
    }
});
canvas.addEventListener('mouseup', function(e){
    image.isButtonDown = false;
    image.isButtonUp = true;
    if (image.isRotating) {
        image.isRotating = false;
    }
});
// function main() {

//
//     canvas.addEventListener('mouseup', function(e){
//         image.isMouseDown = false;
//         image.isMouseUp = true;
//         if (image.isRotating) {
//             image.isRotating = false;
//             clear();
//             image.drawRect();
//             image.drawButton();
//         }
//     });
//
//     canvas.addEventListener('mousemove', function(e){
//         if (image.isMouseDown && image.isRotating) {
//             ctx.save();
//             clear();
//             rotateImage(image, Math.atan2(e.offsetY, e.offsetX));
//             ctx.restore();
//         }
//     });
//
//     canvas.addEventListener('mouseout', function(e){
//         image.isMouseDown = false;
//         image.isMouseUp = false;
//         image.isSelected = false;
//     });
//
// }
image.drawRect();
