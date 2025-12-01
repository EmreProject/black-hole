	    in vec2 uv;
      in vec3 position;


			uniform mat4 modelMatrix;
      uniform mat4 viewMatrix;
			uniform mat4 projectionMatrix;

      uniform sampler2D positionTexture;
      uniform float pointSize;
      
        void main() {


          vec3 position_ = texture(positionTexture, uv).xyz;
          gl_Position = projectionMatrix *viewMatrix* modelMatrix * vec4(position_, 1.0);
          gl_PointSize = pointSize;

   
        }