

attribute vec4 aVertexPosition;
// attribute vec4 aVertexNormal;
attribute vec2 aTextureCoord;
attribute vec4 aVertexColor;

uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uModelMatrix;

// varying lowp vec4 vNormal;
// varying lowp vec4 vUV;
varying lowp vec2 vTextureCoord;
varying lowp vec4 vColor;

void main() {
	gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * aVertexPosition;

	vTextureCoord = aTextureCoord;
	vColor = aVertexColor;
}