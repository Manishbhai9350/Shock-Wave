precision highp float; // Use high precision for better image quality

varying vec2 vUv;
uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform vec2 u_center;
uniform float u_time;
uniform vec2 u_mouse_center;
uniform vec2 u_aspect;
uniform float u_maxRadius;
uniform float u_depthMultiplier;
uniform float u_thickNess;

float CircleSDF(vec2 dir,float r){
    float d = length(dir) - r;
    return d;
}

float GetStrength(float t,float r,float Thickn ,vec2 dir){
    float thick = Thickn/2.0;
    float d = CircleSDF(dir,r * t);
    d *= 1.0 - smoothstep(0.0, thick, abs(d)); // Masking
    d *= smoothstep(0.0,.2,t);
    d *= 1.0 - smoothstep(.3,1.0,t);
    return d;
}

void main() {
    // Generate UV coordinates 
    float t = u_time * .07;
    vec2 uv = vUv;
    vec2 pos = uv;
    vec2 center = u_mouse_center;
    float MaxRadius = u_maxRadius;
    float thickn = u_thickNess;
    float anim = t * .4;

    vec2 dir = uv - center;
    float d = GetStrength(anim,MaxRadius,thickn,dir/u_aspect);

    // GetStrength(anim,MaxRadius,thickn,dir/u_aspect)
    float d2 = GetStrength(anim ,MaxRadius,thickn,dir/u_aspect) * .1;
    float d3 = GetStrength(anim /* * 1.1 */,MaxRadius,thickn,dir/u_aspect) * 2.1;
    float d4 = GetStrength(anim /* + tan(anim) * .01 */,MaxRadius,thickn,dir/u_aspect) + 3.2 * d * anim;
    dir = normalize(dir);

    // Sample the texture and set alpha to 1.0 for full opacity
    vec4 color = texture2D(u_texture, pos + dir * d);
    float c1 = texture2D(u_texture,pos + dir * d2).r;
    float c2 = texture2D(u_texture,pos + dir * d3).g;
    float c3 = texture2D(u_texture,pos + dir * d4).b;
    color = vec4(color.rgb + sin(d) * u_depthMultiplier,color.a);
    gl_FragColor = vec4(c1 + sin(d2) * u_depthMultiplier,c2 + sin(d3) * u_depthMultiplier,c3 + sin(d4) * u_depthMultiplier,color.a);
}
