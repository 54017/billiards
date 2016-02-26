(function(undefined) {

	"use strict";

	var $ = require("jquery"),
		THREE = require("./three.min.js"),
		Physijs = require("./physi.js"),
		ball = require("./ball.js");

	Physijs.scripts.worker = './js/physijs_worker.js';
    Physijs.scripts.ammo = './ammo.js';

	THREE.OrbitControls = require("./OrbitControls.js");

	var renderer, scene, camera, controls, cue, plane,
		offset = new THREE.Vector3(), selection = null, balls = [],
		raycaster = new THREE.Raycaster(),
		mouse = new THREE.Vector2();

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
		addHelperPlane();
		window.plan = plane;
		window.THREE = THREE;
		window.balls = balls;
		window.cue = cue;
		controls = new THREE.OrbitControls(camera, document, cue, balls[15]);
		controls.target = new THREE.Vector3(0, -2500, 128);
		render();
		scene.setGravity(new THREE.Vector3(0, 0, -10000));
	}

	var addHelperPlane = function() {
		plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(5000, 5000, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffffff, visible: false }));
		scene.add(plane);
	}

	var addCue = function() {
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
		var bottomGeometry = new THREE.CylinderGeometry(100, 35, 2000, 100);
		var ironGeometry = new THREE.CylinderGeometry(35, 30, 150, 20);
		var headerGeometry = new THREE.CylinderGeometry(30, 28, 50, 10);
		var top = new Physijs.CylinderMesh(topGeometry, Physijs.createMaterial(new THREE.MeshPhongMaterial({map: textureTop}), 0.8, 1), 0);
		var bottom = new Physijs.CylinderMesh(bottomGeometry, Physijs.createMaterial(new THREE.MeshPhongMaterial({map: textureBottom}), 0.8, 1), 0);
		var iron = new Physijs.CylinderMesh(ironGeometry, Physijs.createMaterial(new THREE.MeshPhongMaterial({map: textureIron}), 0.8, 0.5), 0);
		var header = new Physijs.CylinderMesh(headerGeometry, Physijs.createMaterial(new THREE.MeshPhongMaterial({map: textureHeader}), 0.8, 0.7), 0);
		cue = header;
		var _vector = new THREE.Vector3();
		_vector.set( 0, 0, 0 );
		top.position.set(0, 0, -2670);
		top.__dirtyPosition = true;
		top.rotation.x = Math.PI / 2;
		top.__dirtyRotation = true;
		bottom.position.set(0, 0, -1170);
		bottom.rotation.x = -Math.PI / 2;
		bottom.__dirtyRotation = true;
		bottom.__dirtyPosition = true;
		iron.position.set(0, 0, -100);
		iron.__dirtyPosition = true;
		iron.rotation.x = Math.PI / 2;
		iron.__dirtyRotation = true;
		cue.add(top);
		cue.add(bottom);
		cue.add(iron);
		scene.add(cue);
		cue.position.set(0, 2500, 5000);
		cue.__dirtyPosition = true;
		top.name = bottom.name = iron.name = cue.name = "cue";
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
		var geometry = new THREE.BoxGeometry(4000, 8000, 1),
			material = Physijs.createMaterial(new THREE.MeshLambertMaterial({map: texture}), 0.2, 0.8),
			plane = new Physijs.BoxMesh(geometry, material, 0);
		plane.position.set(0, 0, 0);
		scene.add(plane);
		//6条桌边
		var side = [];
		var textureWood = new THREE.TextureLoader().load("./assets/wood.jpg");
		textureWood.wrapS = THREE.RepeatWrapping;
		textureWood.WrapT = THREE.RepeatWrapping;
		textureWood.needsUpdate = true;
		var	wood = new Physijs.BoxMesh(new THREE.BoxGeometry(500, 3500, 300), Physijs.createMaterial(new THREE.MeshLambertMaterial({map: textureWood}), 0.8, 0), 0);
		var protection = new Physijs.BoxMesh(new THREE.BoxGeometry(50, 3500, 300), material, 0);
		protection.position.set(270, 0, 0);
		wood.add(protection);
		side[0] = wood;
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
			plane.add(side[i]);
		}
		scene.add(plane);

	}


	function onMouseMove(event) {	
		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
		raycaster.setFromCamera(mouse, camera);
		if (selection !== null) {
			var intersects = raycaster.intersectObject(plane);
    		selection.object.parent.position.copy(intersects[0].point.sub(offset));
    		selection.object.parent.__dirtyPosition = true;
    		selection.object.parent.__dirtyRotation = true;
		}
	}

	function onMouseDown(event) {
		raycaster.setFromCamera(mouse, camera);
		var intersects = raycaster.intersectObjects(scene.children, true);
		if (intersects.length > 0 && intersects[0].object.name === 'cue') {
			selection = intersects[0];
			controls.enabled = false;
			plane.position.copy(cue.position);
			var direction = new THREE.Vector3();
			direction.copy(cue.position);
			direction.sub(balls[15].position);
			direction.cross(new THREE.Vector3(0, 0, 1)).add(cue.position);
			plane.lookAt(direction);
			offset.copy(intersects[0].point).sub(plane.position);
		}
	}

	function onMouseUp(event) {
		controls.enabled = true;
		selection = null;
	}



	var render = function() {
		renderer.render(scene, camera);
		requestAnimationFrame(render);
		controls.update();
		camera.lookAt(balls[15].position);
		scene.simulate();
	}

	var bindEvent = function() {
		//window resize
		window.addEventListener('resize', function(e) {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		});
		document.addEventListener('mousemove', onMouseMove, false);
		document.addEventListener('mousedown', onMouseDown, false);
		document.addEventListener('mouseup', onMouseUp, false);
	}


	window.onload = init;

}())