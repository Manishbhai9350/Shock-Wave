import './style.css'
import * as THREE from 'three';
import Frag from './shaders/frag.glsl';
import Vert from './shaders/vert.glsl';
import {GUI} from 'lil-gui';

const canvas = document.querySelector('#webgl');

const gui = new GUI()

// Create the scene
const scene = new THREE.Scene();

// Set up the orthographic camera
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
camera.position.z = 5;

const MouseCoordinates = new THREE.Vector2(0.5, 0.5);
const Aspect = new THREE.Vector2(1,window.innerWidth / window.innerHeight);

// Create a plane geometry
const geometry = new THREE.PlaneGeometry(2, 2);


const uniforms = {
    u_time: { value: 0 },
    u_texture: { value: null }, // Initialize with null, will be set after loading
    u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }, // Add resolution uniform
    u_center: { value: new THREE.Vector2(0.5, 0.5) }, // Add center uniform
    u_mouse_center: { value: MouseCoordinates }, // Fixed typo from 'valud' to 'value'
    u_aspect: { value: Aspect },
    u_anim:{value:0},
    u_maxRadius:{value:.2},
    u_depthMultiplier:{value:1},
    u_thickNess:{value:0.08},
    loop:{value:true},
    speed:{value:1}
}


// Create the shader material
const material = new THREE.ShaderMaterial({
    vertexShader: Vert,
    fragmentShader: Frag,
    uniforms
});
gui.add(uniforms.u_maxRadius,'value').min(.01).max(.6).step(.01).name('Max Radius')
gui.add(uniforms.u_depthMultiplier,'value').min(.1).max(12).step(.1).name('Depth')
gui.add(uniforms.u_thickNess,'value').min(.02).max(.2).step(.01).name('ThickNess')
// gui.add(uniforms.speed,'value').min(.01).max(3).step(.01).name('Speed')
// gui.add(uniforms.loop,'value').name('AutoMatic').onChange(() => {
//     if (uniforms.loop.value) {
//         MouseCoordinates.set(.5,.5);
//         return 
//     };
// })

let textures = [
    '/bg.jpg',
    'https://t3.ftcdn.net/jpg/00/71/04/06/360_F_71040673_C5jt36N0i0IxEydb18w6f8kQD71kzEJ1.jpg'
    ]

const textureLoader = new THREE.TextureLoader();
const bgTexture = textureLoader.load(textures[1], (texture) => {
    // Ensure the texture is loaded before using it
    material.uniforms.u_texture.value = texture;
    animate();
});

// Create the mesh
const plane = new THREE.Mesh(geometry, material);
scene.add(plane);

// Set up the renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true }); // Enable antialiasing for smoother edges
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Use device pixel ratio for better resolution
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding; // Set output encoding for better color representation
renderer.physicallyCorrectLights = true; // Enable physically correct lighting

// Handle window resize
window.addEventListener('resize', () => {
    const aspect = window.innerWidth / window.innerHeight;
    camera.left = -aspect;
    camera.right = aspect;
    camera.top = 1;
    camera.bottom = -1;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight); // Update resolution on resize
    uniforms.u_aspect.value.set(1,aspect); // Update aspect ratio on resize
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    // if (uniforms.loop.value && uniforms.u_time.value > 50) {
    //     uniforms.u_time.value = 0
    // }
    uniforms.u_time.value += 0.05; // Update the uniform time
    let sin = Math.sin(uniforms.u_time.value) 
    uniforms.u_time.value += Math.abs(sin) * 2;
    uniforms.u_anim.value *= uniforms.speed * .01
    renderer.render(scene, camera)
}

window.addEventListener('click', e => {
    // Calculate UV coordinates based on mouse position
    const mouseX = e.clientX / window.innerWidth; // Correctly maps to [0, 1]
    const mouseY = 1 - e.clientY / window.innerHeight; // Direct mapping to [0, 1]

    MouseCoordinates.set(mouseX, mouseY);
    uniforms.u_mouse_center.value.set(mouseX, mouseY); // Update the uniform
    uniforms.u_time.value = 0
});
