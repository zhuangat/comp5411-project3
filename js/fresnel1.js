/**
 * Implement: Zhengyuan Huang Michael <zhuangat@ust.hk>
 * 
 * Refernece: Nvidia Cg tutorial 7 environment mapping 
 * http://developer.download.nvidia.com/CgTutorial/cg_tutorial_chapter07.html
 * 
*/
THREE.FresnelShader = {

	uniforms: {
		// Refractive uniforms
		"mRefractiveRatio": { value: 1.03}, // For diamonds!
		// Set for green -> 2.417*0.995
		// Set for blue -> 2.417*0.99
		// Fresnel Effect uniforms
		"mBias": { value: 0.1 },
		"mScale": { value: 1.0 },
		"mPower": { value: 2.0 },

		//	Texture cube: for env mapping
		"tCube": { value: null }
	},
	// Vertex Shader
	vertexShader: [
		// Uniforms pass to vertex shader ..
		"uniform float mRefractiveRatio;",
		"uniform float mBias;",
		"uniform float mScale;",
		"uniform float mPower;",
		// Varying pass to fragment shader ..
		"varying vec3 R;",
		"varying vec3 T[3];",
		"varying float reflectionCoeff;",
		// Shader function
		"void main(){",
		// Vertex position in world space
		"vec4 wPos = modelMatrix * vec4(position, 1.0);",
		// Vertex position in eye space
		"vec4 ePos = viewMatrix * modelMatrix * vec4(position, 1.0);",
		// Compute vertex normal in world space (exclude homogeneous matrix)
		"vec3 N = normalize (mat3 (modelMatrix) * normal);",
		// Input I from eye
		"vec3 I = wPos.xyz - cameraPosition;",
		// Comvpute reflection as R = I - 2 * dot(N,I) * N
		// For simplicity, we use reflect() in glsl library to simulate reflection.
		"R = normalize(reflect(I,N));",
		// Compute refraction as Snell's law, etha_1 * sin(theta_I) = etha_2 * sin(theta_T)
		// For simplicity, we use refract() in glsl library to simulate refraction only once.
		// Chromatic dispersion for R,G,B channels.
		"T[0] = refract(normalize(I), N, mRefractiveRatio);",
		"T[1] = refract(normalize(I), N, mRefractiveRatio* 0.995);",
		"T[2] = refract(normalize(I), N, mRefractiveRatio* 0.99);",
		// Consider fresnel effect by approximating: reflectionCoeff = max(0,min(1,bias + scale * (1 + dot(I,N))^ power))
		"reflectionCoeff = mBias + mScale * pow((1.0+dot(I,N)),mPower);",

		//set projection position
		"gl_Position = projectionMatrix * ePos;",

		"}"
	].join("\n"),

	fragmentShader: [
		// Fragment Shader

		"uniform samplerCube tCube;",
		"varying vec3 R;",
		"varying vec3 T[3];",
		"varying float reflectionCoeff;",

		"void main(){",

			// Skip for reflectivity since we don't have decal map
			"vec4 reflectedColor = textureCube(tCube, vec3(R.x,R.yz));",
			// Without Chromatic dispersion
			//"vec4 refractedColor = textureCube(tCube, vec3(T.x,T.yz));",
			"vec4 refractedColor = vec4( 1.0 );",
			"refractedColor.r = textureCube(tCube, vec3(T[0].x,T[0].yz)).r;",
			"refractedColor.g = textureCube(tCube, vec3(T[1].x,T[1].yz)).g;",
			"refractedColor.b = textureCube(tCube, vec3(T[2].x,T[2].yz)).b;",
			// F = reflectionCoeff * R + (1 - reflectionCoeff) x T
			"gl_FragColor = mix( refractedColor, reflectedColor, clamp( reflectionCoeff, 0.0, 1.0 ) );",

		"}"


	].join("\n")
}