import * as THREE from 'three'
import * as dat from 'lil-gui'
import {FontLoader} from "three/examples/jsm/loaders/FontLoader.js"
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry.js"

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'


import initVertex from "../shaders/initVertex.glsl"
import initFragment from "../shaders/initFragment.glsl"
import updateVertex from "../shaders/updateVertex.glsl"
import updateFragment from "../shaders/updateFragment.glsl"
import renderVertex from "../shaders/renderVertex.glsl"
import renderFragment from "../shaders/renderFragment.glsl"


import { noiseTex3D } from './fbmNoise.js'


const gui = new dat.GUI()

let effectComposer;
let renderercp,orthoCameracp;

let initScene,updateScene,renderScene;
let initMesh,updateMesh,renderMesh;
let initRenderTarget, updateRenderTargetA,updateRenderTargetB;
let currentUpdateRenderTarget,nextUpdateRenderTarget;


let initScene2,updateScene2;
let initMesh2,updateMesh2,renderMesh2;
let initRenderTarget2, updateRenderTargetA2,updateRenderTargetB2;
let currentUpdateRenderTarget2,nextUpdateRenderTarget2;

// Scene
initScene = new THREE.Scene();
updateScene = new THREE.Scene();
renderScene = new THREE.Scene();

initScene2 = new THREE.Scene();
updateScene2 = new THREE.Scene();


// Particle Parameters
const particleParameters = {
  size: 150, // Total particles: 500 x 500 = 250,000,
  size2:200,
  pointSize:4
};



//Texture Loader
const textureLoader=new THREE.TextureLoader();
const particleTexture=await textureLoader.loadAsync("./assets/muzzle_01.png")

const matCapTexture=textureLoader.load("./assets/matcap4.png");





//Font loader
let textGeometry;
const textMaterial=new THREE.MeshMatcapMaterial({matcap:matCapTexture});
textMaterial.wireframe=false;//reduce curvesegments and beve segments until it looks good in wireframe mode to increase performance
let text;
const fontLoader=new FontLoader();
//this function dont return font instead you have to apply callback func
let fontParameters={
    font:undefined,
    size:0.11,
    depth:0.02,
    curveSegments:11,
    bevelEnabled:true,
    bevelThickness:0.005,
    bevelSize:0.001,
    bevelSegments:10,
  

   };
fontLoader.load("./assets/Goldman_Regular.json",(font)=>{
    fontParameters.font=font;
    console.log(font)
   textGeometry=new TextGeometry("EMRE PROJECT",fontParameters);
    //centering the tex EASY WAY 
   textGeometry.center();

   text=new THREE.Mesh(textGeometry,textMaterial);

   renderScene.add(text);
})



//Render Targets
 initRenderTarget = new THREE.WebGLRenderTarget(
                    particleParameters.size,
                    particleParameters.size,
                    {
                        count: 3,
            type: THREE.FloatType,
            format: THREE.RGBAFormat,
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            depthBuffer: false,
            stencilBuffer: false

                    }
                );

 updateRenderTargetA = new THREE.WebGLRenderTarget(
                    particleParameters.size,
                    particleParameters.size,
                    {
                        count: 2,
            type: THREE.FloatType,
            format: THREE.RGBAFormat,
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            depthBuffer: false,
            stencilBuffer: false

                    }
                );

 updateRenderTargetB = new THREE.WebGLRenderTarget(
                    particleParameters.size,
                    particleParameters.size,
                    {
                        count: 2,
            type: THREE.FloatType,
            format: THREE.RGBAFormat,
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            depthBuffer: false,
            stencilBuffer: false

                    }
                );

                initRenderTarget2 = new THREE.WebGLRenderTarget(
                    particleParameters.size,
                    particleParameters.size,
                    {
                        count: 3,
            type: THREE.FloatType,
            format: THREE.RGBAFormat,
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            depthBuffer: false,
            stencilBuffer: false

                    }
                );

 updateRenderTargetA2 = new THREE.WebGLRenderTarget(
                    particleParameters.size,
                    particleParameters.size,
                    {
                        count: 2,
            type: THREE.FloatType,
            format: THREE.RGBAFormat,
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            depthBuffer: false,
            stencilBuffer: false

                    }
                );

 updateRenderTargetB2 = new THREE.WebGLRenderTarget(
                    particleParameters.size,
                    particleParameters.size,
                    {
                        count: 2,
            type: THREE.FloatType,
            format: THREE.RGBAFormat,
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            depthBuffer: false,
            stencilBuffer: false

                    }
                );



// Geometry
const geometry = new THREE.PlaneGeometry(2,2)

//Init Mesh
const initMaterial = new THREE.RawShaderMaterial({
    vertexShader: initVertex,
    fragmentShader: initFragment,
    side: THREE.DoubleSide,
    glslVersion:THREE.GLSL3,
    uniforms:{

     uMaxRadius:{value:1.20},
     uMinRadius:{value:1.07},
     uStartingRadian:{value:0},
     uMaxStartSpeed:{value:0.028},
     uMinStartSpeed:{value:0.008},
     uMaxHeight:{value:0.1},
     uMaxDepth:{value:0.1},
     uHorizontalParticleRatio:{value:0},

    }
})

const initMaterial2 =new THREE.RawShaderMaterial({
    vertexShader: initVertex,
    fragmentShader: initFragment,
    side: THREE.DoubleSide,
    glslVersion:THREE.GLSL3,
    uniforms:{

     uMaxRadius:{value:1.53},
     uMinRadius:{value:1.07},
     uStartingRadian:{value:0},
     uMaxStartSpeed:{value:0.028},
     uMinStartSpeed:{value:0.003},
     uMaxHeight:{value:0.1},
     uMaxDepth:{value:0.5},
     uHorizontalParticleRatio:{value:1},

    }
})



initMesh = new THREE.Mesh(geometry, initMaterial)
initScene.add(initMesh);


initMesh2 = new THREE.Mesh(geometry, initMaterial2)
initScene2.add(initMesh2);

//Update Mesh
const updateMaterial = new THREE.RawShaderMaterial({
    vertexShader: updateVertex,
    fragmentShader: updateFragment,
    side: THREE.DoubleSide,
    glslVersion:THREE.GLSL3,
    uniforms:{
 
        positionTexture:{value: null},
        velocityTexture:{value: null},
        isHorizontalParticle:{value: null},
        noise3D:{value: noiseTex3D},
        uFlowFieldSize:{value: 100},
        uFlowFieldMaxForce:{value: 0},

    }
})


const updateMaterial2 = new THREE.RawShaderMaterial({
    vertexShader: updateVertex,
    fragmentShader: updateFragment,
    side: THREE.DoubleSide,
    glslVersion:THREE.GLSL3,
    uniforms:{
 
        positionTexture:{value: null},
        velocityTexture:{value: null},
        isHorizontalParticle:{value: null},
        noise3D:{value: noiseTex3D},
        uFlowFieldSize:{value: 100},
        uFlowFieldMaxForce:{value: 0},

    }
})

updateMesh = new THREE.Mesh(geometry,updateMaterial);
updateScene.add(updateMesh);

updateMesh2 = new THREE.Mesh(geometry,updateMaterial2);
updateScene2.add(updateMesh2);



//Render Mesh
const renderMaterial=new THREE.RawShaderMaterial({
    vertexShader: renderVertex,
    fragmentShader: renderFragment,
    side: THREE.DoubleSide,
    glslVersion:THREE.GLSL3,
    transparent:true,
    depthWrite:false,
    blending:THREE.AdditiveBlending,
    uniforms:{
 
        positionTexture:{value: null},
        uParticleTexture:{value: particleTexture},
        pointSize:{value:particleParameters.pointSize},
         uTime:{value:0},
       

    }
})

const renderMaterial2=new THREE.RawShaderMaterial({
    vertexShader: renderVertex,
    fragmentShader: renderFragment,
    side: THREE.DoubleSide,
    glslVersion:THREE.GLSL3,
    transparent:true,
    depthWrite:false,
    blending:THREE.AdditiveBlending,
    uniforms:{
 
        positionTexture:{value: null},
        uParticleTexture:{value: particleTexture},
        pointSize:{value:2},
        uTime:{value:0},
       

    }
})
renderMesh=new THREE.Points(new THREE.PlaneGeometry(2,2,particleParameters.size,particleParameters.size),renderMaterial)

renderMesh2=new THREE.Points(new THREE.PlaneGeometry(2,2,particleParameters.size2,particleParameters.size2),renderMaterial2)

renderScene.add(renderMesh);
renderScene.add(renderMesh2);


//gui
/*
 uMaxRadius:{value:1.20},
     uMinRadius:{value:1.15},
     uStartingRadian:{value:0},
     uMaxStartSpeed:{value:0.02},
     uMinStartSpeed:{value:0.002},
     uMaxHeight:{value:0.1},
     uMaxDepth:{value:0.5},
*/
function InitAgain(){
    InitRender(renderercp,orthoCameracp);
}
gui.add(renderMaterial.uniforms.pointSize,"value").min(1).max(5).step(0.01).name("Point Size V")
gui.add(initMaterial.uniforms.uMinRadius,"value").min(0).max(2).step(0.01).onFinishChange(InitAgain).name("Min Radius V");
gui.add(initMaterial.uniforms.uMaxRadius,"value").min(0).max(2).step(0.01).onFinishChange(InitAgain).name("Max Radius V");
gui.add(initMaterial.uniforms.uMinStartSpeed,"value").min(0.001).max(0.01).step(0.001).onFinishChange(InitAgain).name("Min Speed V");
gui.add(initMaterial.uniforms.uMaxStartSpeed,"value").min(0.01).max(0.08).step(0.001).onFinishChange(InitAgain).name("Max Speed V");
gui.add(initMaterial.uniforms.uMaxDepth,"value").min(0.01).max(0.8).step(0.01).onFinishChange(InitAgain).name("Max Depth V");


gui.add(renderMaterial2.uniforms.pointSize,"value").min(1).max(5).step(0.01).name("Point Size H")
gui.add(initMaterial2.uniforms.uMinRadius,"value").min(0).max(2).step(0.01).onFinishChange(InitAgain).name("Min Radius H");
gui.add(initMaterial2.uniforms.uMaxRadius,"value").min(0).max(2).step(0.01).onFinishChange(InitAgain).name("Max Radius H");
gui.add(initMaterial2.uniforms.uMinStartSpeed,"value").min(0.001).max(0.01).step(0.001).onFinishChange(InitAgain).name("Min Speed H");
gui.add(initMaterial2.uniforms.uMaxStartSpeed,"value").min(0.01).max(0.08).step(0.001).onFinishChange(InitAgain).name("Max Speed H");
gui.add(initMaterial2.uniforms.uMaxHeight,"value").min(0.01).max(0.8).step(0.01).onFinishChange(InitAgain).name("Max Height H");

//EXPORT FUNCTIONS
function SetEffectComposer(renderer,perspectiveCamera){

const renderTarget=new THREE.WebGLRenderTarget(500,600, //random values we change at setsize method
{
    samples:renderer.getPixelRatio() === 1 ? 2 : 0 //antialias, every increase decrease performance,just try to find smallest value that is perfect
}
)

effectComposer=new EffectComposer(renderer,renderTarget);
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
effectComposer.setSize(window.innerWidth,window.innerHeight)


const renderPass=new RenderPass(renderScene,perspectiveCamera);
effectComposer.addPass(renderPass);

const unrealBloomPass=new UnrealBloomPass();
unrealBloomPass.strength=1.2;
unrealBloomPass.radius=1;
unrealBloomPass.threshold=0.4;
effectComposer.addPass(unrealBloomPass);

window.addEventListener("resize",()=>{
 effectComposer.setSize(window.innerWidth,window.innerHeight);
    effectComposer.setPixelRatio(Math.min(2,window.devicePixelRatio));

})

}




function InitRender(renderer, orthoCamera){

    renderercp=renderer;
    orthoCameracp=orthoCamera

    renderer.setRenderTarget(initRenderTarget)
    renderer.render(initScene,orthoCamera);

    currentUpdateRenderTarget=initRenderTarget;
    nextUpdateRenderTarget=updateRenderTargetA;
    renderer.setRenderTarget(nextUpdateRenderTarget);
    updateMaterial.uniforms.positionTexture.value=currentUpdateRenderTarget.textures[0]
    updateMaterial.uniforms.velocityTexture.value=currentUpdateRenderTarget.textures[1]
    updateMaterial.uniforms.isHorizontalParticle.value=currentUpdateRenderTarget.textures[2]
    renderer.render(updateScene,orthoCamera);

    renderer.setRenderTarget(null);

    
    currentUpdateRenderTarget=nextUpdateRenderTarget;
    nextUpdateRenderTarget=updateRenderTargetB;


     renderer.setRenderTarget(initRenderTarget2)
    renderer.render(initScene2,orthoCamera);

    currentUpdateRenderTarget2=initRenderTarget2;
    nextUpdateRenderTarget2=updateRenderTargetA2;
    renderer.setRenderTarget(nextUpdateRenderTarget2);
    updateMaterial2.uniforms.positionTexture.value=currentUpdateRenderTarget2.textures[0]
    updateMaterial2.uniforms.velocityTexture.value=currentUpdateRenderTarget2.textures[1]
    updateMaterial2.uniforms.isHorizontalParticle.value=currentUpdateRenderTarget2.textures[2]
    renderer.render(updateScene2,orthoCamera);

    renderer.setRenderTarget(null);

    
    currentUpdateRenderTarget2=nextUpdateRenderTarget2;
    nextUpdateRenderTarget2=updateRenderTargetB2;

}


function UpdateRender(renderer, orthoCamera){

    renderer.setRenderTarget(nextUpdateRenderTarget);

    updateMaterial.uniforms.positionTexture.value=currentUpdateRenderTarget.textures[0]
    updateMaterial.uniforms.velocityTexture.value=currentUpdateRenderTarget.textures[1]
     updateMaterial.uniforms.isHorizontalParticle.value=initRenderTarget.textures[2]
    renderer.render(updateScene,orthoCamera);

    renderer.setRenderTarget(null);

    [currentUpdateRenderTarget,nextUpdateRenderTarget]=[nextUpdateRenderTarget,currentUpdateRenderTarget]



     renderer.setRenderTarget(nextUpdateRenderTarget2);

    updateMaterial2.uniforms.positionTexture.value=currentUpdateRenderTarget2.textures[0]
    updateMaterial2.uniforms.velocityTexture.value=currentUpdateRenderTarget2.textures[1]
     updateMaterial2.uniforms.isHorizontalParticle.value=initRenderTarget2.textures[2]
    renderer.render(updateScene2,orthoCamera);

    renderer.setRenderTarget(null);

    [currentUpdateRenderTarget2,nextUpdateRenderTarget2]=[nextUpdateRenderTarget2,currentUpdateRenderTarget2]

}

const clock = new THREE.Clock()
function FinalRender(renderer,perspectiveCamera){


     const elapsedTime = clock.getElapsedTime()

    renderMaterial.uniforms.positionTexture.value=currentUpdateRenderTarget.textures[0]

    renderMaterial2.uniforms.positionTexture.value=currentUpdateRenderTarget2.textures[0]

     renderMaterial.uniforms.uTime.value=elapsedTime

    renderMaterial2.uniforms.uTime.value=elapsedTime

    effectComposer.render()

}

export {
    gui,
    SetEffectComposer,
    InitRender,
    UpdateRender,
    FinalRender

}