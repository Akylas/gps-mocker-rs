import {Mesh, PlaneBufferGeometry, ShaderMaterial, Vector2, Vector4} from 'three';

const defaultQuad = new PlaneBufferGeometry(2, 2, 1, 1);

const defaultVertexShader = `
	
uniform vec4 uSize; 		//w h t l 
varying vec2 vUv;
void main(){
	vUv = uv;
	vec2 transformed = position.xy * uSize.xy - vec2(1.,-1.) + vec2( uSize.x ,  -uSize.y ) + vec2( uSize.w , - uSize.z ) * 2.;
	
	gl_Position = vec4( transformed , 1. , 1. );
}
`;


const defaultFragmentShader = `
	
varying vec2 vUv;
uniform sampler2D uTexture;
uniform float cameraNear;
uniform float cameraFar;
#include <packing>
float readDepth(const in vec2 uv) {
	return texture2D(uTexture, uv).r;
}
float getViewZ(const in float depth) {
		return perspectiveDepthToViewZ(depth, cameraNear, cameraFar);
}
float readZDepth(vec2 uv) {
	return viewZToOrthographicDepth( getViewZ(readDepth(uv)), cameraNear, cameraFar );
}
void main(){
	gl_FragColor = vec4(vec3(readZDepth( vUv )), 1.0);
	// gl_FragColor = vec4(vUv.x, vUv.y, 0.0, 1.0);
}	
`;


export default class ScreenQuad extends Mesh
{
	public top: string | number;

	public left: string | number;

	public width: string | number;

	public height: string | number;

	private _pixels: boolean[];

	private _componentSetters: ((v: any)=> void)[];

	private _components: string[];

	public screenSize: any;

	declare public material: THREE.ShaderMaterial;

	public constructor({
	
		width = 1, // 100%
		height = 1,			// 100%
		top = 0,			
		left = 0,
		texture = null,
		fragmentShader = false
	
	}: {width?: string|number, height?: string|number, top?: string|number, left?: string|number, fragmentShader?: string|boolean, texture?: any} = {}) 
	{
	
		super( defaultQuad, new ShaderMaterial({

			uniforms: {
				uTexture: {
					// type:'t',
					value: texture
				},
				cameraNear: {
					// type:'t',
					value: 0
				},
				cameraFar: {value: 0},
				uSize: {
					// type:'v4',
					value: new Vector4(1, 1, 0, 0)
				}
			},

			vertexShader: defaultVertexShader,

			fragmentShader: fragmentShader ? fragmentShader as string : defaultFragmentShader,

			depthWrite: false

		}));

		this.frustumCulled = false;
		this.renderOrder = -1;
		this.top = top;
		this.left = left;
		this.width = width;
		this.height = height;


		// cleanup
		this._pixels = [false, false, false, false]; // w h t l 

		this._componentSetters = [
			this.setWidth,
			this.setHeight,
			this.setTop,
			this.setLeft
		];

		this._components = [
			'width',
			'height',
			'top',
			'left'
		];

		this.screenSize = new Vector2( 1, 1 );
			
		this.setSize( width, height );

		this.setOffset( top, left );

	}

	public setScreenSize( width, height ): void
	{

		// this.material.uniforms.uScreenSize.value.set( width , height , 1 / width , 1 / height );
		this.screenSize.set( width, height );

		this._pixels.forEach( ( p, pi ) => 
		{

			// if a component is set in pixels, update the uniform 
			if ( p ) {this._componentSetters[pi].call(this, this[this._components[pi]] );}  
			
		});

	}

	public setSize( width, height ): void
	{


		this.setWidth( width );
		this.setHeight( height );

	}

	public setWidth( v ): void
	{

		this.width = v;

		if ( isNaN( v ) )
		{

			this.material.uniforms.uSize.value.x = parseInt( v ) / this.screenSize.x;

			this._pixels[0] = true;

		}
		else 
		{

			this.material.uniforms.uSize.value.x = v;

			this._pixels[0] = false;

		}

	}

	public setHeight( v ): void
	{

		this.height = v;

		if ( isNaN( v ) )
		{

			this.material.uniforms.uSize.value.y = parseInt( v ) / this.screenSize.y;

			this._pixels[1] = true;

		}
		else 
		{

			this.material.uniforms.uSize.value.y = v;

			this._pixels[1] = false;

		}

	}

	public setOffset( top, left ): void
	{

		// this.material.uniforms.uSize.value.z = top;

		// this.material.uniforms.uSize.value.w = left;

		this.setLeft( left );
		this.setTop( top );

	}

	public setTop( v ): void
	{


		this.top = v;

		if ( isNaN( v ) )
		{

			this.material.uniforms.uSize.value.z = parseInt( v ) / this.screenSize.y;

			this._pixels[2] = true;

		}
		else 
		{

			this.material.uniforms.uSize.value.z = v;

			this._pixels[2] = false;

		}

	}

	public setLeft( v ): void
	{


		this.left = v;

		if ( isNaN( v ) )
		{

			this.material.uniforms.uSize.value.w = parseInt( v ) / this.screenSize.x;

			this._pixels[3] = true;

		}
		else 
		{

			this.material.uniforms.uSize.value.w = v;

			this._pixels[3] = false;
		}
	}
}
