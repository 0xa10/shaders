// Author: Pini Grigio
// Title: Recreation (eggalone.com)

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float egg(float radius, float a, float b, vec2 location) {
    float smoothing = 0.001;
    // Eggify
    location.y *= sqrt((1.0 - a) - b*(location.x));
    return smoothstep(
            radius + smoothing, 
            radius, 
            distance(location, vec2(0.0))
        );
}

float yolk(float size, vec2 location) {
    float smoothing = 0.001;
    return smoothstep(
            size + smoothing,
            size, 
            distance(location, vec2(0.0))
        );
}

mat2 rotate(float angle){
    return mat2(
                cos(angle), -sin(angle),
                sin(angle),  cos(angle)
            );
}

void main() {
    // Normalize coordinates
    vec2 st = gl_FragCoord.xy / u_resolution.xy;

    // Center 
    st -= 0.5;
    
    // Fix aspect ratio
    if (u_resolution.y > u_resolution.x) {
        st.y *= u_resolution.y/u_resolution.x;
    } else {
        st.x *= u_resolution.x/u_resolution.y;
    }
    
    // Constants
    float margin = 0.03;
    float rotation = mod(u_time/2.0, 180.0);
    
    float egg_radius = 0.5;
    float egg_width = -1.172;
    float off_center = 2.188;
    
    float yolk_radius = (
                            egg_radius/3.0) * 
                            (1.0 + sin(u_time) 
                             / 100.0
                        );
    vec2 yolk_center_offset = vec2(
                                    (egg_radius / off_center) - 0.340,
                                    0.0
                                  );
    vec2 yolk_independant_offset = vec2(-0.01,0.005) * rotate(rotation); // Yolk counter-rotation
    
    // Draw the egg
    vec3 egg_white = mix(
                            vec3(0.0),
                            vec3(1.0),
                            egg(
                                    egg_radius * (0.99 + sin(u_time)/50.0) - margin,
                                    egg_width * (0.9 + sin(u_time)/5.0),
                                    off_center * (0.9 + sin(u_time)/5.0), 
                                    st*rotate(rotation)
                                )
                        );
    
    // Invert yolk color to later AND it with the egg white
    vec3 yolk_yellow = 1.0 - mix(
                            vec3(0.0),
                            1.0 - vec3(1.990,1.838,0.030),
                            yolk(
                                    yolk_radius,
                                    (st+yolk_independant_offset) * rotate(rotation) + 
                                    yolk_center_offset
                                )
                        );
    
    gl_FragColor = vec4(egg_white * yolk_yellow, 1.0);
}
