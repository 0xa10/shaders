fdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;


float circle(float size, vec2 location) {
    float smoothing = 0.001;
    return smoothstep(size+smoothing, size, distance(location, vec2(0.0)));
}

float vertical(float size, vec2 location) {
    float smoothing = 0.001;
    float half_size = size / 2.0;
    return smoothstep(location.x, location.x + smoothing, half_size) * smoothstep(-half_size, -half_size + smoothing, location.x);
}

float horizontal(float size, vec2 location) {
    float smoothing = 0.001;
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
   
   	st -= vec2(0.5, 0.5);
    // float left = step(0.1,st.x); 
   // st *= 9.464;
    //st = fract(st);
	
	vec3 pct =  vec3(circle(0.120, st-vec2(0.010,0.040)));
    //pct = vec3(vertical(0.196, st - vec2(-0.020,0.500)));
    //pct += rectangle(vec2(0.240,0.190), st-vec2(-0.340,-0.040));
    pct += frame(vec2(0.2, 0.2), 0.042, st - vec2(-0.270,0.180));
	//pct += vec3(horizontal(0.108, st-vec2(0.240,-0.010)));
    vec3 color = vec3(pct);
    gl_FragColor = vec4(color,1.0);
}
