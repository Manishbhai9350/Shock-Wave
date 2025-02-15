varying vec2 vUv;

void main() {
    vUv = uv; // Use the correct attribute for texture coordinates
    gl_Position = vec4(position, 1.0);
}