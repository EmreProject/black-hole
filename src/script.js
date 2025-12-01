import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'



import * as Particles from './libs/particles.js'


let orthoCamera,perspectiveCamera;


//scene
const scene = new THREE.Scene()

// Canvas
const canvas = document.querySelector('canvas.webgl')


//Oamera
orthoCamera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
orthoCamera.position.z=-1;
orthoCamera.lookAt(new THREE.Vector3(0,0,0));

perspectiveCamera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 50 );
perspectiveCamera.position.z = 2;
perspectiveCamera.position.y=0
perspectiveCamera.lookAt(new THREE.Vector3(0,0,0));


window.addEventListener('resize', () =>
{

    // Update camera
    perspectiveCamera.aspect = window.innerWidth/ window.innerHeight
    perspectiveCamera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(window.innerWidth,window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})



// Controls
const controls = new OrbitControls(perspectiveCamera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(window.innerWidth,window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


Particles.SetEffectComposer(renderer,perspectiveCamera)
Particles.InitRender(renderer,orthoCamera)

/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()


    //Particle rendering
    Particles.UpdateRender(renderer,orthoCamera);
    Particles.FinalRender(renderer,perspectiveCamera);


    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()