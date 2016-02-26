module.exports = (function() {


	var THREE = require("./three.min.js"),
		ball = {},
		Physijs = require("./physi.js"),
		colors = ['#FFFFFF', '#D5A000', '#0B3E6C', '#CA000E', '#150E51', '#E96200', '#0A6029', '5F0A12', '#1E301E', '#EDBE00', '#122F8C', '#DE001C', '#211C53', '#E22B15', '#074420', '#950B1B'];

	Physijs.scripts.worker = './js/physijs_worker.js';
    Physijs.scripts.ammo = './ammo.js';

	ball.getTexture = function(number, stripped, size) {
		var canvas = document.createElement('canvas'),
			ctx = canvas.getContext('2d'),
			color;
		canvas.width = canvas.height = size;
		//在canvas上画出台球的texture
		ctx.fillStyle = '#FFFFFF';
		ctx.fillRect(0, 0, size, size);
		color = colors[number];
		ctx.fillStyle = color;
		if (stripped) {
			ctx.fillRect(0, size / 4, size, size / 2);
		} else {
			ctx.fillRect(0, 0, size, size);
		}
		//在中间画圆填字
		ctx.fillStyle = '#FFFFFF';
		ctx.scale(0.5, 1);  
		ctx.arc(size / 2, size / 2, size / 4 * 0.9, 0, 2 * Math.PI);
		ctx.fill();
		ctx.fillStyle = '#000000';
		ctx.font = "bolder " + size / 3 + "px Arial";
		var textWidth	= ctx.measureText(number).width;
		ctx.fillText(number, size / 2 - textWidth * 0.5, size / 2 * 1.2);
		return canvas;
	}

	ball.draw = function(prop) {
		prop = typeof prop === 'undefined' ? {} : prop;
		prop.size = typeof prop.size === 'undefined' ? 256 : prop.size;
		prop.number = typeof prop.number === 'undefined' ? 0 : prop.number;
		prop.stripped = typeof prop.stripped === 'undefined' ? true : prop.stripped;
		var texture = new THREE.Texture(this.getTexture(prop.number, prop.stripped, prop.size)),
			geometry = new THREE.SphereGeometry(prop.size / 2, prop.size / 8, prop.size / 8),
			material = Physijs.createMaterial(new THREE.MeshPhongMaterial({map: texture}), 0.7, 0.3);
		texture.needsUpdate	= true;
		var sphere = new Physijs.SphereMesh(geometry, material, 1);
		return sphere;
	}

	return ball;

}())