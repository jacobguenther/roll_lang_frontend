
varying lowp vec2 vTextureCoord;
varying lowp vec4 vColor;

uniform sampler2D uSampler;
uniform lowp float uMixFactor;

void main() {
	gl_FragColor = mix(texture2D(uSampler, vTextureCoord), vColor, uMixFactor);
}