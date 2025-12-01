 precision highp float;
			precision highp int;



    layout(location = 0) out vec4 initialPosition; // Output for COLOR_ATTACHMENT0
    layout(location = 1) out vec4 initialVelocity; // Output for COLOR_ATTACHMENT1
    layout(location = 2) out vec4 isHorizontalParticle; // Output for COLOR_ATTACHMENT1




     in vec2 vUv;
     in vec3 vPosition;

    //starting position
    uniform float uMaxRadius;
    uniform float uMinRadius;
    uniform float uStartingRadian;

    //properties
    uniform float uMaxStartSpeed;
    uniform float uMinStartSpeed;
    uniform float uMaxHeight;
    uniform float uMaxDepth;
    uniform float uHorizontalParticleRatio; //ratio of particles that form horizontal part of black hole 


     float random (vec2 st) {

    return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*
             43758.5453123);
    }




    void main() {
     
     //horizontal or vertical part of hole
      float random1 = random(vUv);
      float isHorizontal=0.;
      if(random1< uHorizontalParticleRatio){
        isHorizontal=1.;
      }
  
      //height or depth depending on particle type(horizontal or vertical)
      vec3 startPosition;
      float random2 = (random(vUv*13.) - 0.5)*2.;
      random2 = pow(random2,3.);
      float random3= random(vUv*24.);
      float radius=uMinRadius + (uMaxRadius-uMinRadius)*random3;
      //horizontal
      if(isHorizontal > 0.5){
        
        startPosition.x= cos(uStartingRadian) * radius;
        startPosition.y=random2 * (uMaxHeight*0.5);
        startPosition.z =  sin(uStartingRadian) * radius;
    
      }else{  //vertical

       startPosition.x = cos(uStartingRadian) * radius;
       startPosition.y = sin(uStartingRadian) * radius;
       startPosition.z = random2 * (uMaxDepth*0.5);

      }

      //velocity
      vec3 velocity;
      float random4 = random(vUv*44.);
      float speed = uMinStartSpeed + (uMaxStartSpeed-uMinStartSpeed)*random4;

      if(isHorizontal>0.5){
        
        vec3 yAxis=vec3(0.,1.,0.);
        velocity = normalize(cross(vec3(startPosition.x,0.,startPosition.z),yAxis));
        velocity*= -speed;

      }else{
       
        vec3 zAxis=vec3(0.,0.,1.);
        velocity = normalize(cross(vec3(startPosition.x,startPosition.y,0.),zAxis));
        velocity*= -speed;


      }



      initialPosition = vec4(startPosition, 1.0);
      initialVelocity = vec4(velocity,1.);
      isHorizontalParticle = vec4(isHorizontal,0.,0.,1.);

     
    }