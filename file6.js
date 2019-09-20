function draw(x, y, length, crude) {
    var ctx = document.getElementById('canvas').getContext('2d');

    var ellipse_x_y_ratio = 4 / 9;

    var ellipse_y = crude / 2 - 1;
    var ellipse_x = ellipse_y * ellipse_x_y_ratio;

    var linearGradient = ctx.createLinearGradient(x + length / 2, y, x + length / 2, y + crude);
    linearGradient.addColorStop(0, 'rgb(50,65,106)');
    linearGradient.addColorStop(0.5, 'white');
    linearGradient.addColorStop(1, 'rgb(50,65,106)');

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

draw(100, 100, 300, 10);