var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

//ctx.fillStyle = "#FF0000";
ctx.fillStyle = "rgb(256,00,00)";
ctx.fillRect(20, 40, 50, 50);

ctx.arc(240, 160, 20, 0, Math.PI * 2, false);
ctx.fillStyle = "green";
ctx.fill();

ctx.rect(160, 10, 100, 40);
ctx.strokeStyle = "rgba(0,0,255,0.5)";
ctx.stroke();