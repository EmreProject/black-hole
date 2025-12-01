 in vec3 position;
			in vec2 uv;

      out vec2 vUv;
      out vec3 vPosition;

      	uniform mat4 modelMatrix;
      	uniform mat4 viewMatrix;
			uniform mat4 projectionMatrix;

    
  void main() {
    gl_Position =  projectionMatrix *viewMatrix* modelMatrix * vec4(position, 1.0);
  
    vUv=uv;
    vPosition=position;
  }