
//横向
function draw1(x, y, length, crude, color = 'rgb(50,65,106,1)') {
    var ctx = document.getElementById('canvas').getContext('2d');

    var ellipse_x_y_ratio = 4 / 9;

    var ellipse_y = crude / 2 - 0.5;
    var ellipse_x = ellipse_y * ellipse_x_y_ratio;

    var linearGradient = ctx.createLinearGradient(x + length / 2, y, x + length / 2, y + crude);
    linearGradient.addColorStop(0, color);
    linearGradient.addColorStop(0.5, 'white');
    linearGradient.addColorStop(1, color);

    ctx.save();
    ctx.fillStyle = linearGradient;
    ctx.fillRect(x, y, length, crude);
    ctx.restore();

    ctx.save();
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.ellipse(x + length, y + crude / 2, ellipse_x, ellipse_y, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.fillStyle = 'gray';
    ctx.globalAlpha = 0.1;
    ctx.beginPath();
    ctx.ellipse(x + length, y + crude / 2, ellipse_x, ellipse_y, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.fillStyle = linearGradient;
    ctx.beginPath();
    ctx.ellipse(x, y + crude / 2, ellipse_x, ellipse_y, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

//纵向
function draw2(x, y, length, crude, color = 'rgb(50,65,106,1)') {
    var ctx = document.getElementById('canvas').getContext('2d');

    var ellipse_y_x_ratio = 4 / 9;

    var ellipse_x = crude / 2 - 0.5;
    var ellipse_y = ellipse_x * ellipse_y_x_ratio;

    var linearGradient = ctx.createLinearGradient(x, y + length / 2, x + crude, y + length / 2);
    linearGradient.addColorStop(0, color);
    linearGradient.addColorStop(0.5, 'white');
    linearGradient.addColorStop(1, color);

    ctx.save();
    ctx.fillStyle = linearGradient;
    ctx.fillRect(x, y, crude, length);
    ctx.restore();

    ctx.save();
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.ellipse(x + crude / 2, y, ellipse_x, ellipse_y, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.fillStyle = 'gray';
    ctx.globalAlpha = 0.1;
    ctx.beginPath();
    ctx.ellipse(x + crude / 2, y, ellipse_x, ellipse_y, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.fillStyle = linearGradient;
    ctx.beginPath();
    ctx.ellipse(x + crude / 2, y + length, ellipse_x, ellipse_y, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}
draw2(100, 100, 60, 20);