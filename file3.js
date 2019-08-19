
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var raf;
var running = false;

function BaseImage () {

    var that = this;
    // 图形的矩形坐标系的位置
    this.rectangleX = 200;
    this.rectangleY = 100;
    // 图形的矩形的宽和高
    this.rectangleW = 75;
    this.rectangleH = 95;
    this.vx = 5;
    this.vy = 1;
    this.strokeStyle = 'rgba(0, 0, 0, 1)';
    this.fillStyle = 'rgba(255, 0, 0, 0.9)';

    this.isMouseDown = false;
    this.isMouseUp = false;
    this.isRotating = false;
    this.isSelected = false;

    // 在矩形坐标系中画图
    this.drawRect = function(fillStyle=this.fillStyle, strokeStyle=this.strokeStyle) {
        ctx.save();
        ctx.translate(this.rectangleX, this.rectangleY);
        ctx.fillStyle = fillStyle;
        ctx.strokeStyle = strokeStyle;
        ctx.beginPath();
        ctx.rect(0, 0, this.rectangleW, this.rectangleH);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    };

    this.drawButton = function() {
        var radius = 10;
        ctx.save();
        ctx.translate(this.rectangleX + this.rectangleW / 2, this.rectangleY + this.rectangleH + 2 * radius);

        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI, true);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(0, 0, radius / 2, 0, 2 * Math.PI, true);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(0, -radius);
        ctx.lineTo(0, -2 * radius);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    };

    this.isInImage = function (x, y) {
        var mmm = ctx.isPointInPath(x, y);
        return mmm;
    };

    this.isInButton = function (x, y) {
        return ctx.isPointInPath(x, y);
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

function rotationVector(x, y, angle) {
    return new Point(x * Math.cos(angle) - y * Math.sin(angle), x * Math.sin(angle) + y * Math.cos(angle));
}

function rotateImage(image, angle) {
    var center = new Point(image.rectangleW / 2, image.rectangleH / 2);
    var newCenter = rotationVector(center.getX(), center.getY(), angle);
    var shiftV = new Point(center.getX() - newCenter.getX(), center.getY() - newCenter.getY());
    ctx.save();
    ctx.translate(image.rectangleX + shiftV.getX(), image.rectangleY + shiftV.getY());
    ctx.rotate(angle);
    image.drawImage();
    image.drawButton();
    ctx.restore();
}

function clear(transparency = 1) {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, ' + transparency + ')';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.restore();
}

function draw() {
    clear();
    var image = new BaseImage();
    image.drawRect();
    image.x += image.vx;
    image.y += image.vy;

    if (image.y + image.vy > canvas.height || image.y + image.vy < 0) {
        image.vy = -image.vy;
    }
    if (image.x + image.vx > canvas.width || image.x + image.vx < 0) {
        image.vx = -image.vx;
    }

    raf = window.requestAnimationFrame(draw);
}

function main() {
    var image = new BaseImage();

    canvas.addEventListener('click',function(e){
        if (image.isInImage(e.offsetX, e.offsetY) && !image.isSelected) {
            image.isSelected = true;
            clear();
            ctx.save();
            image.drawRect('rgba(255, 0, 0, 0.9)');
            image.drawButton();
            ctx.restore();

        } else if (image.isInImage(e.offsetX, e.offsetY) && image.isSelected) {
            image.isSelected = false;
            clear();
            ctx.save();
            image.drawRect();
            ctx.restore();
        }
    });

    // canvas.addEventListener('mousedown', function(e){
    //     image.isMouseUp = false;
    //     image.isMouseDown = true;
    //     if (image.isInButton(e.offsetX, e.offsetY)) {
    //         image.isRotating = true;
    //         clear(0.3);
    //     }
    // });
    //
    // canvas.addEventListener('mouseup', function(e){
    //     image.isMouseDown = false;
    //     image.isMouseUp = true;
    //     if (image.isRotating) {
    //         image.isRotating = false;
    //         clear();
    //         image.drawRect();
    //         image.drawButton();
    //     }
    // });
    //
    // canvas.addEventListener('mousemove', function(e){
    //     if (image.isMouseDown && image.isRotating) {
    //         ctx.save();
    //         clear();
    //         rotateImage(image, Math.atan2(e.offsetY, e.offsetX));
    //         ctx.restore();
    //     }
    // });
    //
    // canvas.addEventListener('mouseout', function(e){
    //     image.isMouseDown = false;
    //     image.isMouseUp = false;
    //     image.isSelected = false;
    // });
    ctx.save();
    image.drawRect();
    ctx.restore();
}

main();