
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var raf;
var running = false;

function RectImage () {

    var that = this;
    this.x = 200;
    this.y = 100;
    this.width = 75;
    this.height = 95;
    this.vx = 5;
    this.vy = 1;
    this.color = 'red';

    this.centerX = this.x + this.width / 2;
    this.centerY = this.y + this.height + 25;
    this.radius = 10;

    this.isMouseDown = false;
    this.isMouseUp = false;
    this.isRotating = false;
    this.isSelected = false;

    this.drawImage = function() {
        ctx.beginPath();
        // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.rect(that.x, that.y, that.width, that.height);
        ctx.closePath();
        ctx.save();
        ctx.strokeStyle = that.color;
        ctx.stroke();
        ctx.restore();
    };
    this.drawButton = function() {
        ctx.beginPath();
        ctx.arc(that.centerX, that.centerY, that.radius, 0, 2 * Math.PI, true);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(that.centerX, that.centerY, that.radius / 2, 0, 2 * Math.PI, true);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.moveTo(that.x + that.width / 2, that.y + that.height);
        ctx.lineTo(that.centerX,that.centerY - that.radius);
        ctx.stroke();
        ctx.closePath();
    };
    this.inRect = function (offsetX, offsetY) {
        return offsetX >= that.x && offsetX <= that.x + that.width
            && offsetY >= that.y && offsetY <= that.y + that.height;
    };
    this.inCircular = function (offsetX, offsetY) {
        return Math.sqrt(Math.pow(offsetX - that.centerX, 2) + Math.pow(offsetY - that.centerY, 2)) <= that.radius;
    }
}


function clear(transparency = 1) {
    ctx.fillStyle = 'rgba(255, 255, 255, ' + transparency + ')';
    ctx.fillRect(0,0,canvas.width,canvas.height);
}

function draw() {
    clear();
    var image = new RectImage();
    image.drawImage();
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
    var image = new RectImage();

    canvas.addEventListener('click',function(e){
        // if (!running) {
        //     raf = window.requestAnimationFrame(draw);
        //     running = true;
        // }
        if (image.inRect(e.offsetX, e.offsetY) && !image.isSelected) {
            image.isSelected = true;
            clear();
            image.drawImage();
            image.drawButton();
        } else if (image.inRect(e.offsetX, e.offsetY) && image.isSelected) {
            image.isSelected = false;
            clear();
            image.drawImage();
        }
    });

    canvas.addEventListener('mousedown', function(e){
        image.isMouseDown = true;
        if (image.inCircular(e.offsetX, e.offsetY)) {
            image.isRotating = true;
            clear(0.3);
        }
    });

    canvas.addEventListener('mouseup', function(e){
        image.isMouseDown = false;
        if (image.isRotating) {
            image.isRotating = false;
            clear();
            image.drawImage();
            image.drawButton();
        }
    });

    canvas.addEventListener('mousemove', function(e){
        // if (!running) {
        //     clear();
        //     image.x = e.offsetX;
        //     image.y = e.offsetY;
        //     image.draw();
        // }
        if (image.isMouseDown) {

        }
    });

    canvas.addEventListener('mouseout', function(e){
        window.cancelAnimationFrame(raf);
        running = false;
    });

    image.drawImage();
}

main();