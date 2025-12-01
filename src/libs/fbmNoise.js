import * as THREE from 'three'

async function loadVolumeF32(jsonUrl, binUrl) {
  const [metaResp, binResp] = await Promise.all([fetch(jsonUrl), fetch(binUrl)]);
  const meta = await metaResp.json();
  const bin = await binResp.arrayBuffer();

  // reconstruct Float32Array
  const vol = new Float32Array(bin);
  const { width, height, depth } = meta;

  // build Data3DTexture
  const tex3D = new THREE.Data3DTexture(vol, width, height, depth);
  tex3D.format = THREE.RedFormat;
  tex3D.type = THREE.FloatType;
  tex3D.minFilter = THREE.LinearFilter;
  tex3D.magFilter = THREE.LinearFilter;
  tex3D.wrapS = tex3D.wrapT = tex3D.wrapR = THREE.RepeatWrapping;
  tex3D.needsUpdate = true;

  return { texture: tex3D, meta };
}


const { texture: noiseTex3D, meta } = await loadVolumeF32(
  './assets/noise_235x235x235.json',
  './assets/noise_235x235x235.f32'
);


export {noiseTex3D}