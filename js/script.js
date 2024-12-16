//Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// *** Scene, Camera, Renderer
// create a Three.JS scene
const scene = new THREE.Scene();
// create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//Keep track of the mouse position, so we can make the eye move
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

// keep the 3d object on a global variable so we can access it alter
let object;

// OrbitControls allow the camera to move around the scene
let controls;

// set which object to render
let objToRender = 'ball';

// initiate a loader for the .gltf file
const loader = new GLTFLoader();
const loading = document.getElementById("loading");

//load the file
loader.load(
    `models/${objToRender}/test.gltf`,
    function (gltf) {
        // if the file is loaded, add it to the scene
        object = gltf.scene;

        // Center the model geometry
        const box = new THREE.Box3().setFromObject(object); // Calculate bounding box
        const center = box.getCenter(new THREE.Vector3()); // Get center of the bounding box
        object.position.sub(center); // Offset the object to center it

        object.scale.set(4,4,4);
        object.position.set(0,0,0);
        scene.add(object);

        // Set OrbitControls to focus on the ball
        controls.target.copy(center); // Focus camera rotation on the ball's center
        controls.update(); // Apply the target update

        // hide the loading %
        loading.style.display = "none";
    },
    function (xhr) {
        // while it is loading, log the progress
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');

        const percent = Math.round((xhr.loaded / xhr.total) * 100);
        loading.textContent = `${percent}%`;
    },
    function (error) {
        // if there is error log it
        console.error(error);
        loading.textContent = "Failed to load. Please refresh. :("
    }
);

//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); //Alpha: true allows for the transparent background


//Add the renderer to the DOM
document.getElementById("ball3D").appendChild(renderer.domElement);

// Set renderer size to #ball3D dimensions
const ballContainer = document.getElementById("ball3D");
camera.aspect = ballContainer.offsetWidth / ballContainer.offsetHeight;
camera.updateProjectionMatrix();
renderer.setSize(ballContainer.offsetWidth, ballContainer.offsetHeight);

//Add lights to the scene, so we can actually see the 3D model
const topLight = new THREE.DirectionalLight(0xffffff, 2); // Increase intensity to 2
topLight.position.set(0, 20, 20); // Closer to the object
topLight.castShadow = true;
scene.add(topLight);

const frontLight = new THREE.DirectionalLight(0xffffff, 1);
frontLight.position.set(0, 0, 10); // Front light
scene.add(frontLight);

const backLight = new THREE.DirectionalLight(0xffffff, 0.8);
backLight.position.set(0, 0, -10); // Back light
scene.add(backLight);

const sideLight = new THREE.DirectionalLight(0xffffff, 0.5);
sideLight.position.set(10, 0, 0); // Side light
scene.add(sideLight);

// Add spotlight
const spotLight = new THREE.SpotLight(0xffffff, 1.5);
spotLight.position.set(10, 30, 10);
spotLight.angle = Math.PI / 6;
spotLight.penumbra = 0.3;
spotLight.castShadow = true;
scene.add(spotLight);

const ambientLight = new THREE.AmbientLight(0x555555, 1); // Dim uniform lighting
scene.add(ambientLight);

//This adds controls to the camera, so we can rotate / zoom it with the mouse
controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.enablePan = false;
controls.enableDamping = true; // Enable smooth rotation
controls.dampingFactor = 0.1;
controls.rotateSpeed = 1; // Adjust mouse rotation speed

let time = 0;
//Render the scene
function animate() {
    requestAnimationFrame(animate);
    //Here we could add some code to update the scene, adding some automatic movement
    
    if (object) {
        // Floating motion
        object.position.y = Math.sin(time) * 0.05; // Vertical floating
        object.position.x = Math.sin(time * 0.05) * 0.1; // Horizontal floating

        // Rotation
        object.rotation.y += 0.01; // Rotate on Y-axis
        object.rotation.x += 0.005; // Slight rotation on X-axis
    }

    time += 0.02; // Smooth animation increment

    controls.update();
    renderer.render(scene, camera);
}

//Add a listener to the window, so we can resize the window and the camera
// Resize listener
window.addEventListener("resize", function () {
    const ballContainer = document.getElementById("ball3D");
    camera.aspect = ballContainer.offsetWidth / ballContainer.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(ballContainer.offsetWidth, ballContainer.offsetHeight);
});

// Camera position
camera.position.set(0, 0, 1);
  
//add mouse position listener, so we can make the eye move
document.onmousemove = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
}

//Start the 3D rendering
animate();