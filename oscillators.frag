// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define PI 3.14159


struct oscillator {
    float amplitude;
    float frequency;
    float patch;
};

float square(oscillator o) {
    return clamp(o.amplitude, 0., 1.) *
        sign(sin(o.patch * o.frequency * PI));
}

float sine(oscillator o) {
    return clamp(o.amplitude, 0., 1.) *
        (sin((o.patch + o.frequency * PI)) + 1.) / 2.;
}

float triangle(oscillator o) {
    return clamp(o.amplitude, 0., 1.) *
        abs(mod((o.patch + o.frequency * PI), 2.) - 1.);
}

float saw(oscillator o) {
    return clamp(o.amplitude, 0., 1.) *
        mod((o.patch * o.frequency * PI), 1.);
}
mat2 rotate2d(float _angle) {
  return mat2(cos(_angle), -sin(_angle),
    sin(_angle), cos(_angle));
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;

    vec3 color = vec3(0.);
    oscillator o1;
    o1.patch = st.x + u_time;
    o1.amplitude = 1.016;
    o1.frequency = 1.;
    
    oscillator lfo;
    lfo.patch = u_time;
    lfo.amplitude = 180.;
    lfo.frequency = 1.;
    oscillator o2;
    o2.patch = (st*rotate2d(0.59600)).x + u_time;
    o2.amplitude = 1.016;
    o2.frequency = .968;
    color.r = mix(0., 1., sine(o1));
	color.g = mix(0., 1., sine(lfo));
    color.b = mix(0., 1., saw(o2));
    gl_FragColor = vec4(color,1.0);
}
