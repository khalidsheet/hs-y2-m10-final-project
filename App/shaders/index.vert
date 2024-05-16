varying vec2 vUv;
uniform float uTime;

// get userData
uniform vec3 uData;


void main() {
    // add a noise to the position
  vec3 newPosition = position;
  newPosition.y *= 1.0 + sin(uTime) * 0.4;
  newPosition.xz *= -1.0 + cos(uTime) * 0.2 * sin(position.y * 3.14);


    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

    vUv = uv;
}