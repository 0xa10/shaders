#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;


#define PI 3.1415

float circle(float size, vec2 location) {
  float smoothing = 0.0001;
  return smoothstep(size + smoothing, size, distance(location, vec2(0.0)));
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

mat2 rotate2d(float _angle) {
  return mat2(cos(_angle), -sin(_angle),
    sin(_angle), cos(_angle));
}

float triangle(float size, vec2 location) {
  float smoothing = 0.0001;

  // Distance field
  float a = PI + atan(location.x, location.y);
  float r = 2. * PI / float(3); // Triangle
  float distance_field = cos(floor(0.500 + a / r) * r - a) * length(location);
  return 1.0 - smoothstep(size, size + smoothing, distance_field);
}

vec2 perspectify(vec2 st, vec2 perspective) {
  return vec2(st.x / (perspective.x * st.x + perspective.y * st.y + 1.0), st.y / (perspective.x * st.x + perspective.y * st.y + 1.0));
}

vec3 tesselated_triangles(vec2 st, vec2 perspective) {
  st = perspectify(st, perspective);
  st *= 20.0;
  st = fract(st);

  // Center and scale
  st -= 0.500;

  vec3 drawing = vec3(1.0);
  drawing -= vec3(triangle(0.268, st - vec2(0.120, -0.110)));
  return drawing;
}

vec3 tesselated_squares(vec2 st, vec2 perspective) {
  st = perspectify(st, perspective);
  st *= 20.0;
  st = fract(st);

  // Center and scale
  st -= 0.500;

  vec3 drawing = vec3(1.0);
  drawing -= vec3(rectangle(vec2(0.990, 0.510), st - vec2(0.310, 0.040)));
  return drawing;
}

vec3 tesselated_circles(vec2 st, vec2 perspective) {
  st = perspectify(st, perspective);
  st *= 20.0;
  st = fract(st);

  // Center and scale
  st -= 0.500;

  vec3 drawing = vec3(1.0);
  drawing -= vec3(circle(0.276, st - vec2(0.190, -0.100)));
  return drawing;
}

vec3 tesselated_lines(vec2 st, vec2 perspective) {
  st = perspectify(st, perspective);
  st *= 20.0;
  st = fract(st);

  // Center and scale
  st -= 0.140;

  vec3 drawing = vec3(1.0);
  drawing -= vec3(horizontal(0.140, st - vec2(0.390, 0.260)));
  drawing -= vec3(horizontal(0.124, st - vec2(0.560, 0.650)));
  drawing -= vec3(horizontal(0.05, st - vec2(0.560, 0.470)));
  return drawing;
}

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  // Fix aspect ratio
  if (u_resolution.y > u_resolution.x) {
    st.y *= u_resolution.y / u_resolution.x;
  } else {
    st.x *= u_resolution.x / u_resolution.y;
  }

  float left_mask = step(st.x, (1.0 + sin(0.5 - u_time * 3.0)) / 1.);
  float right_mask = 1.0 - left_mask;

  float bottom_mask = step(st.y, sin(u_time) * 5.);
  float top_mask = 1.0 - bottom_mask;

  float top_left = top_mask * left_mask;
  float top_right = top_mask * right_mask;
  float bottom_left = bottom_mask * left_mask;
  float bottom_right = bottom_mask * right_mask;

  vec3 squares = tesselated_squares(st, vec2(0.600, -0.440)) * bottom_right;
  vec3 triangles = tesselated_triangles(st, vec2(0.600, -0.440)) * top_right;
  vec3 circles = tesselated_circles(st, vec2(0.600, -0.440)) * top_left;
  vec3 lines = tesselated_lines(st, vec2(0.600, -0.440)) * bottom_left;

  gl_FragColor = vec4(vec3(squares + triangles + circles + lines), 1.0);
}

