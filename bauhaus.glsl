#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

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

vec3 colorize(vec3 color, float item) {
  // Inverted colors
  return mix(vec3(0.0), 1.0 - color, item);
}

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;

  // Center and scale
  st -= 0.580;
  st /= 1.600;

  // Fix aspect ratio
  if (u_resolution.y > u_resolution.x) {
    st.y *= u_resolution.y / u_resolution.x;
  } else {
    st.x *= u_resolution.x / u_resolution.y;
  }

  // Lines
  float top_line = horizontal(0.004, (st * rotate2d(-1.016) - vec2(-0.390, 0.130)));
  float bottom_line = horizontal(0.004, (st * rotate2d(-1.016) - vec2(0.210, 0.090)));
  float corner_fold = horizontal(0.076, (st * rotate2d(-1.016) - vec2(-0.450, 0.410)));
  float vertical_line = vertical(0.042, st - vec2(0.150, 0.090));
  float horizontal_line = horizontal(0.042, st - vec2(0.260, -0.300));

  vec3 lines;
  lines += colorize(vec3(0.660, 0.626, 0.579), top_line);
  lines += colorize(vec3(00.660, 0.626, 0.579), bottom_line);
  lines += colorize(vec3(0.970, 0.948, 0.776), corner_fold);
  lines += colorize(vec3(0.980, 0.902, 0.803), vertical_line);
  lines += colorize(vec3(0.970, 0.922, 0.922), horizontal_line);

  // Rectangle
  float right_rectangle = rectangle(vec2(0.060, 0.270), st - vec2(-0.140, -0.210));
  float center_rectangle = rectangle(vec2(0.060, 0.270), st - vec2(-0.220, -0.150));;
  float left_rectangle = rectangle(vec2(0.060, 0.270), st - vec2(-0.300, -0.090));;

  vec3 rectangles;
  rectangles += colorize(vec3(0.335, 0.374, 0.830), right_rectangle);
  rectangles += colorize(vec3(0.335, 0.374, 0.830), center_rectangle);
  rectangles += colorize(vec3(0.335, 0.374, 0.830), left_rectangle);

  // Circles
  float left_circle = circle(0.14, st - vec2(-0.120, 0.140));
  float right_circle = circle(0.15, st - vec2(0.040, 0.010));

  vec3 circles;
  circles += colorize(vec3(0.985, 0.724, 0.771), left_circle);
  circles += colorize(vec3(0.925, 0.536, 0.562), right_circle);
  // Triangle
  vec3 the_triangle = colorize(vec3(0.203, 0.585, 0.130),
    triangle(0.140, st - vec2(0.040, -0.260)));
  //drawing += a_line;
  //drawing += a_second_line;
  //drawing += rectangles;
  float color;

  vec3 base = vec3(0.797, 0.800, 0.635); // Base color
  vec3 drawing = base;
  drawing -= circles;
  drawing -= the_triangle;
  drawing -= rectangles;
  drawing -= lines;
  gl_FragColor = vec4(drawing, 1.0);
}

