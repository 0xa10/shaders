#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;


float circle(float size, vec2 location) {
    float smoothing = 0.0001;
    return smoothstep(size+smoothing, size, distance(location, vec2(0.0)));
}

float vertical(float size, vec2 location) {
    float smoothing = 0.0001;
    float half_size = size / 2.0;
    return smoothstep(location.x, location.x + smoothing, half_size) * smoothstep(-half_size, -half_size + smoothing, location.x);
}

float horizontal(float size, vec2 location) {
    float smoothing = 0.0001;
    float half_size = size / 2.0;
    return smoothstep(location.y, location.y + smoothing, half_size) * smoothstep(-half_size, -half_size + smoothing, location.y);
}

float rectangle(vec2 dimensions, vec2 location) {
    return vertical(dimensions.x, location) * horizontal(dimensions.y, location);
}

float frame(vec2 dimensions, float border, vec2 location) {
    float outer = rectangle(dimensions, location);
    float inner = rectangle(dimensions - vec2(border), location);
    return outer - inner;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
  
    st -= vec2(-0.330,0.110);
	
    float pct;
    pct += frame(vec2(0.110,1.990), 0.05, st - vec2(0.590,0.340));
    pct += frame(vec2(1.860,0.280), 0.05, st - vec2(0.470,0.690));
    pct += frame(vec2(.860,0.280), 0.05, st - vec2(0.610,0.690));
    pct += frame(vec2(0.310,1.730), 0.05, st - vec2(0.940,0.180));
    pct += frame(vec2(1.680,0.440), 0.05, st - vec2(0.860,-0.180));
    
    vec3 base = vec3(0.955,0.885,0.867);
    float frame = pct;
	vec3 color_box = mix(vec3(0.0), 1.0-vec3(0.895,0.018,0.026), rectangle(vec2(0.180,0.230), st - vec2(0.710,0.690)));
    vec3 color_box2 = mix(vec3(0.0), 1.0-vec3(0.895,0.699,0.110), rectangle(vec2(0.25,0.230), st - vec2(0.680,-0.080)));
    vec3 color_box3 = mix(vec3(0.0), 1.0-vec3(0.161,0.895,0.895), rectangle(vec2(0.180,0.230), st - vec2(0.720,-0.080)));
    vec3 color_box4 = mix(vec3(0.0), 1.0-vec3(0.089,0.089,0.895), rectangle(vec2(0.300,0.230), st - vec2(1.190,0.690)));
    vec3 color_circle = mix(vec3(0.0), 1.0-vec3(0.626,0.895,0.878), circle(0.14, st - vec2(0.840,0.300)));
    vec3 grid = mix(vec3(0.0), 1.0-vec3(0.0), pct);
    vec3 color = 1.0 - vec3((color_box+color_box2+color_box3+color_box4+color_circle+grid));
    base =  mix(vec3(0.0), 1.0-vec3(0.960,0.924,0.659), step(1.0-0.0001, color));
    gl_FragColor = vec4(color-base,1.0);
}
