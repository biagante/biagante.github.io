"use strict";

/**
 * Base
 */
// Canvas
var canvas = document.querySelector('canvas.webgl'); // Scene

var scene = new THREE.Scene();
/**
 * Objects
 */
//Material

var material = new THREE.MeshToonMaterial({
  color: '#ffeded'
}); //Meshes

var mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);
scene.add(mesh1);
var mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);
scene.add(mesh2);
var mesh3 = new THREE.Mesh(new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16), material);
scene.add(mesh3);
var sectionMeshes = [mesh1, mesh2, mesh3]; //Position

var objectsDistance = 4;
mesh1.position.x = 2;
mesh1.position.y = -objectsDistance * 0;
mesh2.position.x = -2;
mesh2.position.y = -objectsDistance * 1;
mesh3.position.x = 2;
mesh3.position.y = -objectsDistance * 2;
/*
* Particles 
*/
//Geometry

var particlesCount = 200;
var positions = new Float32Array(particlesCount * 3);

for (var i = 0; i < particlesCount; i++) {
  positions[i * 3 + 0] = (Math.random() - 0.5) * 10;
  positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
}

var particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)); //Material

var particlesMaterial = new THREE.PointsMaterial({
  size: 0.02,
  sizeAttenuation: true,
  color: '#ffeded'
}); //Points

var particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);
/**
 * Lights
 */

var directionalLight = new THREE.DirectionalLight('#ffffff', 1);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);
/**
 * Sizes
 */

var sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};
window.addEventListener('resize', function () {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight; // Update camera

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix(); // Update renderer

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
/**
 * Camera
 */
//Group

var cameraGroup = new THREE.Group();
scene.add(cameraGroup); // Base camera

var camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 6;
cameraGroup.add(camera);
/**
 * Renderer
 */

var renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
/**
 * Scroll
 */

var scrollY = window.scrollY;
window.addEventListener('scroll', function () {
  scrollY = window.scrollY;
});
/*
* Cursor
*/

var cursor = {};
cursor.x = 0;
cursor.y = 0;
window.addEventListener('mousemove', function (event) {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = event.clientY / sizes.height - 0.5;
});
/**
 * Animate
 */

var clock = new THREE.Clock();
var previousTime = 0;

var animate = function animate() {
  var elapsedTime = clock.getElapsedTime();
  var deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime; //animate meshes 

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = sectionMeshes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var mesh = _step.value;
      mesh.rotation.x = elapsedTime * 0.1;
      mesh.rotation.y = elapsedTime * 0.12;
    } //animate camera

  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  camera.position.y = -scrollY / sizes.height * objectsDistance;
  var parallaxX = cursor.x * 0.5;
  var parallaxY = -cursor.y * 0.5;
  cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime;
  cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime; // Render

  renderer.render(scene, camera); // Call animate again on the next frame

  window.requestAnimationFrame(animate);
};

animate();