(function(undefined) {

	"use strict";

	var $ = require("jquery"),
		THREE = require("./three.min.js"),
		ball = require("./ball.js");
	THREE.OrbitControls = require("./OrbitControls.js");

	var renderer, scene, camera, controls;

	var size = 256,
		distance = size * 2 / Math.sqrt(2),
		initY = 2000;

	var init = function() {
		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(renderer.domElement);
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000000);
		camera.position.set(0, -5000, 1000);
		camera.lookAt(new THREE.Vector3(0, 0, 0));

		controls = new THREE.OrbitControls(camera, renderer.domElement);
		controls.target = new THREE.Vector3(0, 0, 0);
		bindEvent();
		addLight();
		addTable();
		addBalls();
		render();
		var axisHelper = new THREE.AxisHelper(10000);
		scene.add( axisHelper );
	}

	var addBalls = function() {
		var reorder = [1, 11, 10, 6, 8, 5, 13, 9, 4, 15, 2, 12, 7, 14, 3];
		for (var i = 0; i < 15; ++i) {
			var stripped = reorder[i] > 8 ? true : false,
				mesh = ball.draw({number: reorder[i], size: size, stripped: stripped});
			var position = getInitPosition(i + 1);
			mesh.position.set(position.x, position.y, size / 2);
			scene.add(mesh);
		}
		//白球
		var mesh = ball.draw({number: '', size: size, stripped: false});
		mesh.position.set(0, 2500, size / 2);
		scene.add(mesh);
	}


	var getInitPosition = function(number) {
		var rowsHead = [1, 2, 4, 7, 11],
			row, sideLength, offset, position = {};
		for (var i = 4; i >= 0; --i) {
			if (number >= rowsHead[i]) {
				row = i;
				break;
			}
		}
		sideLength = row * size;
		position.x = (number - rowsHead[row]) * size - sideLength / 2;
		position.y = Math.sqrt(Math.pow(row * size, 2) - Math.pow(sideLength / 2, 2)) + initY;
		return position;
	}

	var addLight = function() {
		var light = new THREE.AmbientLight('white'); // soft white light
		scene.add(light);
	}

	var addTable = function() {
		//桌面
		var texture = new THREE.TextureLoader().load( "./assets/green.jpg" );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.needsUpdate = true;
		var geometry = new THREE.PlaneGeometry(5000, 8000, 32),
			material = new THREE.MeshLambertMaterial({color: '#FFFFFF', map: texture}),
			plane = new THREE.Mesh(geometry, material);
		plane.position.set(0, 0, 0);
		scene.add(plane);
	}

	var render = function() {
		renderer.render(scene, camera);
		requestAnimationFrame(render);
		controls.update();
	}

	var bindEvent = function() {
		//window resize
		window.addEventListener('resize', function(e) {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		})
	}


	window.onload = init;

}())