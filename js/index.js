(function(undefined) {

	"use strict";

	var $ = require("jquery"),
		THREE = require("./three.min.js"),
		Physijs = require("./physi.js"),
		ball = require("./ball.js");

	Physijs.scripts.worker = './js/physi_worker.js';
    Physijs.scripts.ammo = './js/ammo.js';

	THREE.OrbitControls = require("./OrbitControls.js");

	var renderer, scene, camera, controls, cue, balls = [];

	var size = 256,
		distance = size * 2 / Math.sqrt(2),
		initY = 2000;

	var init = function() {
		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(renderer.domElement);
		scene = new Physijs.Scene;
		camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000000);
		camera.position.set(0, -5000, 1500);
		camera.lookAt(new THREE.Vector3(0, -2500, size / 2));

		bindEvent();
		addLight();
		addTable();
		addBalls();
		addCue();
		controls = new THREE.OrbitControls(camera, document, cue, balls[15]);
		controls.target = new THREE.Vector3(0, -2500, 128);
		render();
		var axisHelper = new THREE.AxisHelper(10000);
		scene.add(axisHelper);
	}

	var addCue = function() {
		cue = new THREE.Object3D();
		var textureTop = new THREE.TextureLoader().load( "./assets/top.jpg" );
		textureTop.wrapS = THREE.RepeatWrapping;
		textureTop.wrapT = THREE.RepeatWrapping;
		textureTop.needsUpdate = true;
		var textureBottom = new THREE.TextureLoader().load( "./assets/bottom.jpg" );
		textureBottom.wrapS = THREE.RepeatWrapping;
		textureBottom.wrapT = THREE.RepeatWrapping;
		textureBottom.needsUpdate = true;
		var textureIron = new THREE.TextureLoader().load("./assets/iron.jpg");
		textureIron.wrapS = THREE.RepeatWrapping;
		textureIron.wrapT = THREE.RepeatWrapping;
		textureIron.needsUpdate = true;
		var textureIron = new THREE.TextureLoader().load("./assets/iron.jpg");
		textureIron.wrapS = THREE.RepeatWrapping;
		textureIron.wrapT = THREE.RepeatWrapping;
		textureIron.needsUpdate = true;
		var textureHeader = new THREE.TextureLoader().load("./assets/header.jpg");
		textureHeader.wrapS = THREE.RepeatWrapping;
		textureHeader.wrapT = THREE.RepeatWrapping;
		textureHeader.needsUpdate = true;
		var topGeometry = new THREE.CylinderGeometry(115, 100, 1000, 50);
		topGeometry.rotateX(-Math.PI / 2);
		var bottomGeometry = new THREE.CylinderGeometry(100, 35, 2000, 100);
		bottomGeometry.rotateX(-Math.PI / 2);
		var ironGeometry = new THREE.CylinderGeometry(35, 30, 150, 20);
		ironGeometry.rotateX(-Math.PI / 2);
		var headerGeometry = new THREE.CylinderGeometry(30, 28, 50, 10);
		headerGeometry.rotateX(-Math.PI / 2);
		var top = new Physijs.CylinderMesh(topGeometry, new THREE.MeshPhongMaterial({map: textureTop}));
		var bottom = new Physijs.CylinderMesh(bottomGeometry, new THREE.MeshPhongMaterial({map: textureBottom}));
		var iron = new Physijs.CylinderMesh(ironGeometry, new THREE.MeshPhongMaterial({map: textureIron}));
		var header = new Physijs.CylinderMesh(headerGeometry, new THREE.MeshPhongMaterial({map: textureHeader}));
		top.position.set(0, 0, -2670);
		bottom.position.set(0, 0, -1170);
		iron.position.set(0, 0, -100);
		header.position.set(0, 0, 0);
		cue.add(top);
		cue.add(bottom);
		cue.add(header);
		cue.add(iron);
		scene.add(cue);
		window.Cue = cue;
		window.THREE = THREE;
	}

	var addBalls = function() {
		var reorder = [1, 11, 10, 6, 8, 5, 13, 9, 4, 15, 2, 12, 7, 14, 3];
		for (var i = 0; i < 15; ++i) {
			var stripped = reorder[i] > 8 ? true : false;
			balls[i] = ball.draw({number: reorder[i], size: size, stripped: stripped});
			var position = getInitPosition(i + 1);
			balls[i].position.set(position.x, position.y, size / 2);
			scene.add(balls[i]);
		}
		//白球
		balls[15] = ball.draw({number: ' ', size: size, stripped: false});
		balls[15].position.set(0, -2500, size / 2);
		scene.add(balls[15]);
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
		var geometry = new THREE.PlaneGeometry(4000, 8000, 32),
			material = new THREE.MeshLambertMaterial({color: '#FFFFFF', map: texture}),
			plane = new Physijs.PlaneMesh(geometry, material);
		plane.position.set(0, 0, 0);
		scene.add(plane);
		//6条桌边
		var side = [];
		side[0] = new THREE.Object3D();
		var textureWood = new THREE.TextureLoader().load("./assets/wood.jpg");
		textureWood.wrapS = THREE.RepeatWrapping;
		textureWood.WrapT = THREE.RepeatWrapping;
		textureWood.needsUpdate = true;
		var	wood = new Physijs.BoxMesh(new THREE.BoxGeometry(500, 3500, 300), new THREE.MeshLambertMaterial({map: textureWood}));
		var protection = new Physijs.BoxMesh(new THREE.BoxGeometry(50, 3500, 300), material);
		protection.position.set(270, 0, 0);
		side[0].add(wood);
		side[0].add(protection);
		for (var i = 1; i < 6; ++i) {
			side[i] = side[0].clone();
		}
		side[0].position.set(-2250, 2000, 150);
		side[1].position.set(-2250, -2000, 150);
		side[2].rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI);
		side[3].rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI);
		side[2].position.set(2250, 2000, 150);
		side[3].position.set(2250, -2000, 150);
		side[4].rotateOnAxis(new THREE.Vector3(0, 0, 1), -Math.PI / 2);
		side[5].rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI / 2);
		side[4].position.set(0, 4100, 150);
		side[5].position.set(0, -4100, 150);
		for (var i = 0; i < 6; ++i) {
			scene.add(side[i]);
		}

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