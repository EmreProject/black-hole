    precision highp float;
		precision highp int;
    precision mediump sampler3D;  


    layout(location = 0) out vec4 updatedPosition; // Output for COLOR_ATTACHMENT0
    layout(location = 1) out vec4 updatedVelocity; // Output for COLOR_ATTACHMENT1

    uniform sampler2D positionTexture;
    uniform sampler2D velocityTexture; //no update
    uniform sampler2D isHorizontalParticle; //no update

    uniform sampler3D noise3D;
    uniform float uFlowFieldSize;
    uniform float uFlowFieldMaxForce;



    in vec2 vUv;

  

    void main() {
     
      vec3 position = texture(positionTexture, vUv).xyz;
      vec3 velocity = texture(velocityTexture, vUv).xyz;
      float isHorizontal=texture(isHorizontalParticle,vUv).x;

      //noise force
      vec3 noiseForce;
      float halfFlowField= uFlowFieldSize*0.5;
      vec3 leftBottomFlowField= vec3(-halfFlowField,-halfFlowField,-halfFlowField);
      vec3 posToUv = (position-leftBottomFlowField)/uFlowFieldSize;

      noiseForce.x = (texture(noise3D,posToUv).x-0.5)*2.;
      noiseForce.y = (texture(noise3D,posToUv).y-0.5)*2.;
      noiseForce.z = (texture(noise3D,posToUv).z-0.5)*2.;
      noiseForce = normalize(noiseForce) * uFlowFieldMaxForce;
    

    float eps = 0.001;

      //centripedal force
      vec3 centripedalForce;
      if(isHorizontal>0.5){
      vec3 radial = vec3(position.x, 0.0, position.z);
      float radius = length(radial);
    if (radius > eps) {
    vec3 vPlane = vec3(velocity.x, 0.0, velocity.z);  // <- only XZ speed
    float vPlaneLen = length(vPlane);
    float centripedalForceMagnitude = (vPlaneLen * vPlaneLen) / radius;

    centripedalForce = normalize(-radial) * centripedalForceMagnitude;
}
     

      }else{
         vec3 radial = vec3(position.x, position.y, 0.0);
float radius = length(radial);

       if (radius > eps) {
    vec3 vPlane = vec3(velocity.x, velocity.y, 0.0);  // <- only XY speed
    float vPlaneLen = length(vPlane);
    float centripedalForceMagnitude = (vPlaneLen * vPlaneLen) / radius;

    centripedalForce = normalize(-radial) * centripedalForceMagnitude;
}

      }

      //velocity update
      velocity+=centripedalForce;
      velocity+=noiseForce;

      //position update
      position+=velocity;

      updatedPosition = vec4(position, 1.0); // Write position to first output
      updatedVelocity = vec4(velocity,  1.0); // Write velocity to second output
    }