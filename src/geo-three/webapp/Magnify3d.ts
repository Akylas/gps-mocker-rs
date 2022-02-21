import {Color, OrthographicCamera, Texture, Mesh, Scene, ShaderMaterial, PlaneBufferGeometry, Vector2, WebGLRenderTarget} from 'three';
// import FXAAShaderFrag from './shaders/FXAAShaderFrag.glsl';
// import FXAAShaderVert from './shaders/FXAAShaderVert.glsl';

export default class Magnify3d 
{
	public zoomTarget;

	public magnifyMaterial: ShaderMaterial;

	public magnifyScene;

	public camera;

	public outlineColor;

	public size = new Vector2();

	public constructor() 
	{
		this.magnifyMaterial = new ShaderMaterial({
			vertexShader: `
			void main() {
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
			`,
			fragmentShader: `
			#define AA_RANGE 2.0
			precision mediump float;

			uniform sampler2D zoomedTexture;
			uniform sampler2D originalTexture;
			uniform vec2 pos;
			uniform vec2 resolution;
			uniform vec2 mag_resolution;
			uniform float zoom;
			uniform float exp;
			uniform float radius;
			uniform float outlineThickness;
			uniform vec3 outlineColor;

			void main() {
				vec2 uv = gl_FragCoord.xy / mag_resolution.xy;
				vec2 pos_uv = pos.xy / mag_resolution.xy;
				
				float dist = distance(gl_FragCoord.xy, pos.xy);

				float z;
				vec2 p;

				if (dist < radius) {
					// https://www.wolframalpha.com/input/?i=plot+1.0+-+(pow(x+%2F+r,+e)+*+(1.0+-+(1.0+%2F+(z))))
					z = 1.0 - (pow(dist / radius, exp) * (1.0 - (1.0 / (zoom))));
					p = ((uv - pos_uv) / z) + pos_uv;
					gl_FragColor = vec4(vec3(texture2D(zoomedTexture, p)), 1.0);
				} else if (dist <= radius + outlineThickness) {
					float w = outlineThickness / 2.0;
					float alpha = smoothstep(0.0, AA_RANGE, dist - radius) - smoothstep(outlineThickness - AA_RANGE, outlineThickness, dist - radius);
					
					if (dist <= radius + outlineThickness / 2.0) {
						// Inside outline.
						gl_FragColor = mix(texture2D(zoomedTexture, uv), vec4(outlineColor, 1.0), alpha);
					} else {
						// Outside outline.
						gl_FragColor = mix(texture2D(originalTexture, gl_FragCoord.xy / resolution.xy), vec4(outlineColor, 1.0), alpha);
					}
				} else {
					gl_FragColor = texture2D(originalTexture, gl_FragCoord.xy / resolution.xy);
				}
			}    
`,
			uniforms: {
				zoomedTexture: {value: new Texture()},
				originalTexture: {value: new Texture()},
				pos: {value: new Vector2()},
				outlineColor: {value: null},
				'mag_resolution': {value: null},
				resolution: {value: null},
				zoom: {value: null},
				radius: {value: null},
				outlineThickness: {value: null},
				exp: {value: null}
			}
		});

		this.magnifyMaterial.transparent = true; // Needed if inputBuffer is undefined.

		this.magnifyScene = this.createScene(this.magnifyMaterial);

		this.camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

		// Size is not really matter here. It gets updated inside `render`.
		this.zoomTarget = new WebGLRenderTarget(0, 0);
		
		// Antialiasing shader
		// this.fxaaMaterial = new THREE.ShaderMaterial({
		// 	vertexShader: FXAAShaderVert,
		// 	fragmentShader: FXAAShaderFrag,
		// 	uniforms: {
		// 		'tDiffuse': {type: 't'},
		// 		'resolution': {type: 'v2'}
		// 	}
		// });

		// this.fxaaMaterial.transparent = true; // Needed if inputBuffer is undefined.
		// this.fxaaScene = this.createScene(this.fxaaMaterial);

		// this.fxaaTarget = new THREE.WebGLRenderTarget(0, 0);

		this.outlineColor = new Color();
	}

	public createScene(material): Scene
	{
		const quad = new Mesh( new PlaneBufferGeometry( 2, 2 ), material );

		const scene = new Scene();
		scene.add(quad);

		return scene;
	}

	public render({    
		renderer,
		rendererOut,
		renderSceneCB,
		pos = null,
		zoom = 3.0,
		exp = 35.0,
		radius = 100.0,
		outlineColor = 0xCCCCCC,
		outlineThickness = 4.0,
		antialias = true,
		inputBuffer = undefined,
		outputBuffer = null
	}): void
	{

		if (!renderer) 
		{
			console.warn('Magnify-3d: No renderer attached!');
			return;
		}
		
		if (!pos) 
		{
			// No pos - Just render original scene.
			renderSceneCB(outputBuffer);
			return;
		}

		const pixelRatio = renderer.getPixelRatio();
		pos = {x: pos.x * pixelRatio, y: pos.y * pixelRatio};

		
		let {width, height} = renderer.getSize(this.size);

		width *= pixelRatio;
		height *= pixelRatio;

		const maxViewportWidth = renderer.getContext().getParameter(renderer.getContext().MAX_VIEWPORT_DIMS)[0];
		const maxViewportHeight = renderer.getContext().getParameter(renderer.getContext().MAX_VIEWPORT_DIMS)[1];

		let resWidth = width;
		let resHeight = height;
		if (width * zoom > maxViewportWidth) 
		{
			resWidth = width * (width * zoom / maxViewportWidth);
			resHeight = height * (width * zoom / maxViewportWidth);
		}

		// Set shader uniforms.
		this.magnifyMaterial.uniforms['zoomedTexture'].value = this.zoomTarget.texture;
		this.magnifyMaterial.uniforms['originalTexture'].value = inputBuffer && inputBuffer.texture || inputBuffer;
		this.magnifyMaterial.uniforms['pos'].value = pos;
		this.magnifyMaterial.uniforms['outlineColor'].value = this.outlineColor.set(outlineColor);
		this.magnifyMaterial.uniforms['mag_resolution'].value = {x: resWidth, y: resHeight};
		this.magnifyMaterial.uniforms['resolution'].value = {x: width, y: height};
		this.magnifyMaterial.uniforms['zoom'].value = zoom;
		this.magnifyMaterial.uniforms['radius'].value = radius * pixelRatio;
		this.magnifyMaterial.uniforms['outlineThickness'].value = outlineThickness * pixelRatio;
		this.magnifyMaterial.uniforms['exp'].value = exp;

		// Make viewport centered according to pos.
		const zoomedViewport = [
			-pos.x * (zoom - 1) * width / resWidth,
			-pos.y * (zoom - 1) * height / resHeight,
			width * width / resWidth * zoom,
			height * height / resHeight * zoom
		];
		this.zoomTarget.width = width;
		this.zoomTarget.height = height;
		this.zoomTarget.viewport.set(...zoomedViewport);
		
		const autoClearBackup = renderer.autoClear;
		renderer.autoClear = true; // Make sure autoClear is set.

		renderSceneCB(this.zoomTarget);

		// if (antialias) 
		// {
		// 	this.fxaaMaterial.uniforms['tDiffuse'].value = this.fxaaTarget.texture;
		// 	this.fxaaMaterial.uniforms['resolution'].value = {x: 1 / width, y: 1 / height};

		// 	this.fxaaTarget.setSize(width, height);

		// 	renderer.setRenderTarget(this.fxaaTarget);
		// 	renderer.render(this.magnifyScene, this.camera); // Render magnify pass to fxaaTarget.
		// 	renderer.setRenderTarget(null);
		// 	renderer.render(this.fxaaScene, this.camera); // Render final pass to output buffer.
		// }
		// else 
		// {
		renderer.setRenderTarget(null);
		(rendererOut || renderer).render(this.magnifyScene, this.camera); // Render magnify pass to outputBuffer.
		// }

		renderer.autoClear = autoClearBackup;
	}
}
