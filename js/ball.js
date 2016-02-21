module.exports = (function() {


	var THREE = require("./three.min.js"),
		ball = {};

	ball.getTexture = function(number, stripped, size) {
		var canvas = document.createElement('canvas'),
			ctx = canvas.getContext('2d'),
			color;
		canvas.width = canvas.height = size;
		//在canvas上画出台球的texture
		ctx.fillStyle = '#FFFFFF';
		ctx.fillRect(0, 0, size, size);
		switch(number) {
			case 1:
				color = '#D5A000';
				break;
			case 2:
				color = '#0B3E6C';
				break;
			case 3:
				color = '#CA000E';
				break;
			case 4:
				color = '#150E51';
				break;
			case 5:
				color = '#E96200';
				break;
			case 6:
				color = '#0A6029';
				break;
			case 7:
				color = '5F0A12';
				break;
			case 8:
				color = '#1E301E';
				break;
			case 9:
				color = '#EDBE00';
				break;
			case 10:
				color = '#122F8C';
				break;
			case 11:
				color = '#DE001C';
				break;
			case 12:
				color = '#211C53';
				break;
			case 13:
				color = '#E22B15';
				break;
			case 14:
				color = '#074420';
				break;
			case 15:
				color = '#950B1B';
				break;
			default:
				color = '#FFFFFF';
		}
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
			material = new THREE.MeshPhongMaterial({map: texture});
		texture.needsUpdate	= true;
		var sphere = new THREE.Mesh(geometry, material);
		return sphere;
	}

	return ball;

}())