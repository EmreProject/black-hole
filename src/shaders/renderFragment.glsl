        precision highp float;

       
        layout(location = 0) out vec4 color;
        uniform float uTime;
        uniform float uOpacitySpeed;
        uniform sampler2D uParticleTexture;
        
  
        void main() {
              vec2 uv = gl_PointCoord;

              // 90° CW around center
              //uv = vec2(uv.y, 1.0 - uv.x);

              // 90° CCW around center
              uv = vec2(1.0 - uv.y, uv.x);

              vec4 texColor = texture(uParticleTexture, uv);


              color = texColor * vec4(199./255.,74./255.,0.,1.) ;
             
        }