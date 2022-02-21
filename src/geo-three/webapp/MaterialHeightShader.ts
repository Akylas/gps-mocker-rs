import {pointToTileFraction, tileToBBOX} from '@mapbox/tilebelt';
import {BufferGeometry, ClampToEdgeWrapping, Color, DoubleSide, Float32BufferAttribute, FrontSide, Intersection, LinearFilter, LOD, Matrix3, Mesh, MeshDepthMaterial, MeshPhongMaterial, ObjectSpaceNormalMap, Points, Raycaster, RepeatWrapping, RGBADepthPacking, ShaderChunk, ShaderLib, ShaderMaterial, Texture, TextureLoader, Vector2, Vector3, Vector4} from 'three';

import {MapNodeGeometry} from '../source/geometries/MapNodeGeometry';
import {MapView} from '../source/MapView';
import {MapHeightNode} from '../source/nodes/MapHeightNode';
import {MapPlaneNode} from '../source/nodes/MapPlaneNode';
import {UnitsUtils} from '../source/utils/UnitsUtils';
import {settings, isMobile} from './settings';

export let featuresByColor = {};
export let testColor;
let readPixelCanvas: HTMLCanvasElement;
let normalMapCanvas: HTMLCanvasElement;
export function getImageData( image ): ImageData
{
	if (!readPixelCanvas) 
	{
		readPixelCanvas = document.createElement( 'canvas' );
	}
	readPixelCanvas.width = image.width;
	readPixelCanvas.height = image.height;
	var context = readPixelCanvas.getContext( '2d' );
	context.drawImage( image, 0, 0 );
	return context.getImageData( 0, 0, image.width, image.height );
}

let fractionTile, fractionX, fractionY;
export function getPixel( imageData: ImageData, displacementMapLocation: [number, number, number, number], coords: {lat: number, lon: number}, level ): Uint8ClampedArray
{
	fractionTile = pointToTileFraction(coords.lon, coords.lat, level);
	fractionX = fractionTile[0] - Math.floor(fractionTile[0]);
	fractionY = 1- (fractionTile[1] - Math.floor(fractionTile[1]));
	fractionX = fractionX * displacementMapLocation[2] + displacementMapLocation[0];
	fractionY = fractionY * displacementMapLocation[3] + displacementMapLocation[1];
	const x= Math.round(imageData.width * fractionX);
	const y= Math.round(imageData.height * fractionY);
	const position = ( x + imageData.width * y ) * 4;
	const result = imageData.data.slice(position, position + 4);
	return result;
}
const maxLevelForGemSize = 12;
// const worldScaleRatio = 1;
const worldScaleRatio = 1/100000;

// function generateNormalMap(image, tileX, tileY, level): void
// {
// 	if (!normalMapCanvas) 
// 	{
// 		normalMapCanvas = document.getElementById('canvas3') as HTMLCanvasElement;
// 	}

// 	var width = normalMapCanvas.width = image.width;
// 	var height = normalMapCanvas.height = image.height;
// 	var context = normalMapCanvas.getContext( '2d' );
// 	context.drawImage( image, 0, 0 );


// 	var src = context.getImageData( 0, 0, width, height );

// 	function unpackHeight(index): any
// 	{
// 		const elevationDecoder = settings.elevationDecoder;
// 		let height = src.data[index]/255 * elevationDecoder[0];
// 		height +=src.data[index+1]/255 * elevationDecoder[1];
// 		height += src.data[index+2] /255* elevationDecoder[2];
// 		height += src.data[index+3] /255* elevationDecoder[3];
// 		// console.log('unpackHeight', index, elevationDecoder, [src.data[index], src.data[index+1], src.data[index+2], src.data[index+3]], height);
// 		return height;
// 	}
// 	function getInterpolatedHeight( x, y): any
// 	{
// 		let x0 = x, x1 = x;
// 		let y0 = y, y1 = y;
// 		if (x < 0) 
// 		{
// 			x0 = 0;
// 			x1 = 1;
// 		}
// 		if (x >= width) 
// 		{
// 			x0 = width - 1;
// 			x1 = width - 2;
// 		}
// 		if (y < 0) 
// 		{
// 			y0 = 0;
// 			y1 = 1;
// 		}
// 		if (y >= height) 
// 		{
// 			y0 = height - 1;
// 			y1 = height - 2;
// 		}
// 		// console.log('getInterpolatedHeight', width, height, x, y, x0, y0, x1, y1);

// 		if (x0 === x1 && y0 === y1) 
// 		{
// 			return unpackHeight(y0 * width*4 + x0*4);
// 		}
// 		return 2 * unpackHeight(y0 * width*4 + x0*4) - unpackHeight(y1 * width*4 + x1*4);
// 	}

// 	var dst = context.createImageData( width, height );
// 	if (width >= 2 && height >= 2) 
// 	{
// 		// console.log('generateNormalMap', tileX, tileY, level)
// 		let heights = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
// 		for (let y = 0; y < height; y++) 
// 		{
// 			let y1 = Math.PI * ((tileY + (height - y - 0.5) / height) / (1 << level) - 0.5);
// 			let rz = Math.tanh(y1);
// 			let ss = Math.sqrt(Math.max(0.0, 1.0 - rz * rz));

// 			// [
// 			// 	[0/0,1/0,2/0],
// 			// 	[0/1,1/1,2/1],
// 			// 	[0/2,1/2,2/2]
// 			// ]

// 			for (let dy = 0; dy < 3; dy++) 
// 			{
// 				heights[dy][1] = getInterpolatedHeight(-1, y + dy - 1);
// 				heights[dy][2] = getInterpolatedHeight( 0, y + dy - 1);
// 			}
// 			for (let x = 0; x < width; x++) 
// 			{
// 				for (let dy = 0; dy < 3; dy++) 
// 				{
// 					heights[dy][0] = heights[dy][1];
// 					heights[dy][1] = heights[dy][2];
// 					heights[dy][2] = getInterpolatedHeight(x + 1, y + dy - 1);
// 				}

// 				let dx = heights[0][2] + 2 * heights[1][2] + heights[2][2] - (heights[0][0] + 2 * heights[1][0] + heights[2][0]);
// 				let dy = heights[2][0] + 2 * heights[2][1] + heights[2][2] - (heights[0][0] + 2 * heights[0][1] + heights[0][2]);
// 				let dz = 8.0 * ss;
// 				const length = Math.sqrt(dx*dx + dy*dy + dz*dz);
// 				dst.data[y * width*4 + x*4] = Math.round((dx/length + 1.0 ) * 127.5);
// 				dst.data[y * width*4 + x *4+ 1] = Math.round((dy/length + 1.0 ) * 127.5);
// 				dst.data[y * width*4 + x *4+ 2] = Math.round((dz/length + 1.0 ) * 127.5);
// 				dst.data[y * width*4 + x *4+ 3] = 255;
// 				// console.log(x, y, dst.data[y * width*4 + x*4], dst.data[y * width*4 + x*4 + 1], dst.data[y * width*4 + x*4 + 2]);
// 			}
// 		}
// 	}


// 	context.putImageData( dst, 0, 0 );
// }

function hashString( str, seed = 0 ): number 
{

	let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;

	for ( let i = 0, ch; i < str.length; i ++ ) 
	{

		ch = str.charCodeAt( i );

		h1 = Math.imul( h1 ^ ch, 2654435761 );

		h2 = Math.imul( h2 ^ ch, 1597334677 );

	}

	h1 = Math.imul( h1 ^ h1 >>> 16, 2246822507 ) ^ Math.imul( h2 ^ h2 >>> 13, 3266489909 );

	h2 = Math.imul( h2 ^ h2 >>> 16, 2246822507 ) ^ Math.imul( h1 ^ h1 >>> 13, 3266489909 );

	return 4294967296 * ( 2097151 & h2 ) + ( h1 >>> 0 );

}

class CustomMaterial extends ShaderMaterial 
{
	// public customProgramCacheKey(): string
	// {
	// 	const prototype = this.constructor.prototype;
	// 	if (!prototype.cachedKey) 
	// 	{
	// 		prototype.cachedKey = hashString(super.customProgramCacheKey());
	// 	}
	// 	return prototype.cachedKey;
	// }

	public onBeforeCompile(shader: { uniforms: { [x: string]: any; }; vertexShader: string; fragmentShader: string; }): void
	{
		// Pass uniforms from userData to the
		for (const i in this.userData) 
		{
			shader.uniforms[i] = this.userData[i];
		}
	}

	public onBeforeRender(renderer, scene, camera, geometry, object, group): void 
	{	
		if (MaterialHeightShader.useSharedShader) 
		{
			const parent = object.parent.parent;
			for (const i in parent.userData) 
			{
				this.uniforms[i] = parent.userData[i];
			}
			this.uniformsNeedUpdate = true;
		}
	}
}
class PointMaterial extends ShaderMaterial 
{
	private static cachedKey;

	// public customProgramCacheKey(): string
	// {
	// 	if (!PointMaterial.cachedKey) 
	// 	{
	// 		PointMaterial.cachedKey = hashString(super.customProgramCacheKey());
	// 	}
	// 	return PointMaterial.cachedKey;
	// }

	public onBeforeRender(renderer, scene, camera, geometry, object, group): void 
	{	
		for (const i in object.userData) 
		{
			if (this.uniforms[i]) 
			{
				this.uniforms[i].value = object.userData[i].value;
			}
		}
		this.uniformsNeedUpdate = true;
	}
}

const EMPTY_TEXTURE = new Texture();

export const sharedPointMaterial = new PointMaterial({
	depthWrite: false,
	depthTest: false,
	extensions:{
		derivatives:false
	},
	uniforms: {
		exageration: {value: 1},
		depthTexture: {value: EMPTY_TEXTURE}, 
		cameraNear: {value: 10 * worldScaleRatio},
		cameraFar: {value: 1000000 * worldScaleRatio},
		worldScale: {value: worldScaleRatio}
	},
	vertexShader: `
#include <packing>
attribute vec4 color;

uniform sampler2D depthTexture;
uniform float cameraNear;
uniform float cameraFar;
uniform float exageration;

varying vec2 vUv;
varying float depth;
varying vec4 vColor;

float readDepth(const in vec2 uv) {
return texture2D(depthTexture, uv).r;
}
float getViewZ(const in float depth) {
return perspectiveDepthToViewZ(depth, cameraNear, cameraFar);
}
float readZDepth(vec2 uv) {
return viewZToOrthographicDepth( getViewZ(readDepth(uv)), cameraNear, cameraFar );
}
void main() {
float elevation  = position.y;
vec4 mvPosition = modelViewMatrix * vec4( position.x,  elevation * exageration, position.z, 1.0 );
// mvPosition.z -= pow(getDigit(elevation, 2.0), 2.0) * mvPosition.z / 1000.0;
// mvPosition.z -= (elevation / 1000.0 - floor(elevation / 1000.0)) * mvPosition.z / 1000.0;
gl_Position = projectionMatrix * mvPosition;
gl_PointSize = 6.0;
float depthFromPosition = viewZToOrthographicDepth(mvPosition.z, cameraNear, cameraFar);
vec3 coord = gl_Position.xyz / gl_Position.w;
vUv =(coord.xy + 1.0) * 0.5 ;
// float depthAtPoint = readZDepth(vUv);
float depthAtPoint = (readZDepth(vUv) + readZDepth(vUv + vec2(0,0.001)) + readZDepth(vUv + vec2(0,-0.001)) + readZDepth(vUv + vec2(0.001,0)) + readZDepth(vUv + vec2(-0.001,0))) / 5.0;
if (depthAtPoint > 0.0 && depthFromPosition > depthAtPoint+ cameraFar/1000.0) {
	depth = -1.0;
	vColor = vec4( 0.0, 0.0, 0.0, 0.0);
} else {
	depth = depthAtPoint;
	vColor = color;
}
}
	`,
	fragmentShader: `
#include <packing>
varying vec4 vColor;
varying float depth;

void main() {
	if (depth < 0.0 ) {
		discard;
	}
	gl_FragColor = vColor;
}
	`,
	transparent: false
});
// ShaderChunk['shadowmap_pars_fragment'] = ShaderChunk.shadowmap_pars_fragment.replace( 'return shadow;', 'if (generateColor){return shadow*2.0; } else {return shadow;}' );

function pick<T extends object, U extends keyof T>(object: T, ...props: U[]): Pick<T, U> 
{
	return props.reduce((o, k) => { o[k] = object[k];return o;}, {} as any);
}
function createSharedMaterial(): CustomMaterial 
{
	const phongShader = ShaderLib['phong'];
	const loader =new TextureLoader();
	// const loader =new DDSLoader();
	let textureGrass, textureAltitude, textureRock, textureSnow, textureSand, textureWater;
	try {
		
		// textureGrass = loader.load( 'terrain/savanna_green_d.webp', null, null);
		// textureAltitude = loader.load( 'terrain/mntn_dark_d.webp', null, null);
		// textureRock = loader.load( 'terrain/mntn_white_d.webp', null, null);
		// textureSnow = loader.load( 'terrain/snow1_d.webp', null, null);
		// textureSand = loader.load( 'terrain/island_sand_d.webp', null, null);
		// textureWater = loader.load( 'terrain/water.webp', null, null);
		// textureGrass.wrapS = textureAltitude.wrapS = textureSand.wrapS = textureWater.wrapS = textureRock.wrapS = RepeatWrapping;
		// textureGrass.wrapT = textureAltitude.wrapT = textureSand.wrapT = textureWater.wrapT = textureRock.wrapT = RepeatWrapping;
	} catch (error) {
		
	}

	const sharedMaterial = new CustomMaterial( {
		// shadowSide: FrontSide,
		lights: true,
		wireframe: false,
		// side: DoubleSide,
		extensions:{
			derivatives:true
		},
		defines: {
			TANGENTSPACE_NORMALMAP: '',
			USE_DISPLACEMENTMAP: '',
			USE_NORMALMAP: ''
		},
		uniforms: Object.assign(pick(phongShader.uniforms, 'diffuse', 'spotLights', 'spotLightShadows', 'rectAreaLights', 'ltc_1', 'ltc_2', 'ambientLightColor', 'directionalLightShadows', 'directionalLights', 'directionalShadowMatrix', 'directionalShadowMap', 'lightMap', 'lightMapIntensity', 'lightProbe', 'pointLights', 'pointLightShadows', 'pointShadowMap', 'pointShadowMatrix', 'hemisphereLights', 'spotShadowMap', 'spotShadowMatrix', 'map'
			, 'opacity', 'displacementMap'), {
			textureGrass: {value: textureGrass},
			textureAltitude: {value: textureAltitude},
			textureRock: {value: textureRock},
			textureSnow: {value: textureSnow},
			textureSand: {value: textureSand},
			textureWater: {value: textureWater},
			drawNormals: {value: false},
			computeNormals: {value: false},
			drawShadows: {value: false},
			drawTexture: {value: false},
			elevationDecoder: {value: null},
			generateColor: {value: false},
			drawBlack: {value: 0},
			displacementScale: {value: 1},
			normalLength: {value: 1},
			emissive: {value: new Color(0x000000)},
			specular: {value: new Color(0x333333)},
			shininess: {value: 10},
			displacementBias: {value: 0},
			worldScale: {value: worldScaleRatio}
		}),
		vertexShader: `
#define PHONG
#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <shadowmap_pars_vertex>
uniform bool computeNormals;
uniform bool drawShadows;
uniform float zoomlevel;
uniform float worldScale;
uniform float normalLength;
uniform float zoomFactor;
uniform vec4 elevationDecoder;
uniform vec4 displacementMapLocation;
uniform vec2 displacementRes;
varying vec4 vPosition;
uniform float tileY;
varying vec3 vViewPosition;
varying vec3 vComputedNormal;
varying float trueHeight;
uniform bool generateColor;

float getPixelElevation(vec4 e) {
	// Convert encoded elevation value to meters
	return ((e.r * elevationDecoder.x + e.g * elevationDecoder.y  + e.b * elevationDecoder.z) + elevationDecoder.w);
}
float getElevation(vec2 coord) {
	vec4 e = texture2D(displacementMap, coord * displacementMapLocation.zw + displacementMapLocation.xy);
	return getPixelElevation(e);
}

float getElevationMean(vec2 coord) {
	float x0 = coord.x;
	float x1= coord.x;
	float y0 = coord.y;
	float y1= coord.y;
	if (x0 <= 0.0) {
		x1 = 1.0 * displacementRes.x;
	}
	if (x0 >= 1.0) {
		x1 = 1.0 - 1.0  * displacementRes.x;
	}
	if (y0 <= 0.0) {
		y1 = 1.0 * displacementRes.y;
	}
	if (y0 >= 1.0) {
		y1 = 1.0 - 1.0 * displacementRes.y;
	}
	if (x0 == x1 && y0 == y1) {
		return getElevation(coord);
	} else {
		return 2.0 * getElevation(vec2(x0,y0)) -  getElevation(vec2(x1,y1));
	}
}
void main() {

	vUv = vec2(position.x +  0.5, 0.5 - position.z );

	float e = getElevationMean(vUv);
	vec3 transformedNormal = normalMatrix * vec3(0,1,0);
	vNormal = normalize( transformedNormal );
	vec3 transformed = vec3( position ) + vec3(0,e * displacementScale + displacementBias,0);
	#include <project_vertex>
	vViewPosition = - mvPosition.xyz;

	if (computeNormals) {

		vec3 offset = vec3(displacementRes, 0);
		float b = getElevation(vUv  - offset.zy);
		float d = getElevation(vUv - offset.xz);
		float f = getElevation(vUv + offset.xz);
		float h = getElevation(vUv + offset.zy);
		// float b = getElevationMean(vUv  - offset.zy);
		// float d = getElevationMean(vUv - offset.xz);
		// float f = getElevationMean(vUv + offset.xz);
		// float h = getElevationMean(vUv + offset.zy);
		vComputedNormal = normalize(vec3(mix(d - f , 0.0, zoomFactor), mix(b - h , 0.0, zoomFactor), normalLength));
	}
	#include <worldpos_vertex>
	if (drawShadows) {
		#include <shadowmap_vertex>
	}
	if (generateColor) {
		vPosition = modelMatrix * vec4(transformed, 1.0);
		vPosition.y = e;
	}
}
`,
		fragmentShader: `
#define PHONG
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <lightmap_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in GeometricContext geometry, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometry.normal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in GeometricContext geometry, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong
#define Material_LightProbeLOD( material )	(0)
#include <normalmap_pars_fragment>
#define SNOW_HEIGHT 1300.0
#define BEACH_HEIGHT 10.5
#define GRASS_HEIGHT 2053.5
#define TREE_MIN_HEIGHT 1000.0
#define TREE_MAX_HEIGHT 1800.0
#define HASHSCALE1 .1031

uniform bool drawNormals;
uniform bool computeNormals;
uniform bool generateColor;
uniform bool drawTexture;
uniform bool drawBlack;
uniform vec4 mapMapLocation;
uniform float zoomlevel;
varying vec4 vPosition;
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float worldScale;
uniform float opacity;
uniform sampler2D textureGrass;
uniform sampler2D textureAltitude;
uniform sampler2D textureRock;
uniform sampler2D textureSnow;
uniform sampler2D textureSand;
uniform sampler2D textureWater;
varying vec3 vComputedNormal;

#include <shadowmap_pars_fragment>


vec2 add = vec2(1.0, 0.0);
//  1 out, 2 in...
float Hash12(vec2 p)
{
	vec3 p3  = fract(vec3(p.xyx) * HASHSCALE1);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
}
float Noise( in vec2 x, float factor )
{
    vec2 p = floor(x*factor/worldScale);
    vec2 f = fract(x*factor/worldScale);
    f = f*f*(3.0-2.0*f);
    float res = mix(mix( Hash12(p),          Hash12(p + add.xy),f.x),
                    mix( Hash12(p + add.yx), Hash12(p + add.xx),f.x),f.y);
    return res;
}
vec3 TerrainColour(vec4 matPos, vec3 normal, vec2 lights)
{
	float slope = normal.y;
	vec3 mat;
	// lights.x = .0;
	// lights.y = .1;
	// vec3 dir = normalize(pos-cameraPos);
	
	// float f = clamp(Noise(matPos.xz*.05, 2.0), 0.0,1.0);//*10.8;
	vec3 m = vec3(76.0/255.0, 51.0/255.0, 30.0/255.0);
	// vec3 m = texture2D(textureAltitude, vUv*2.0).rgb;
	mat = m;
	// Should have used smoothstep to add colours, but left it using 'if' for sanity...
	if (slope < .5)
	{
		float c = (.5-slope) * 4.0;
		c = clamp(c*c, 0.1, 1.0);
		mat = mix(mat, vec3(0.4, 0.4, 0.4), c/1.6);
		// mat = mix(mat, texture2D(textureRock, vUv*4.0).rgb, c/1.6);
		// lights.x+=.1;
	}
	// Grass. Use the normal to decide when to plonk grass down...
	if (matPos.y < GRASS_HEIGHT && slope > 0.65)
	{
		// m = texture2D(textureGrass, vUv*4.0).rgb*1.6 * (slope- 0.65);
		m = vec3(0.34902, 0.533333, 0.266667)*1.6 * (slope- 0.65);
		mat = mix(mat, m, clamp((slope-0.65)*1.3 * (GRASS_HEIGHT-matPos.y)*0.003, 0.0, 1.0));
	}

	// if (matPos.y > TREE_MIN_HEIGHT && matPos.y < TREE_MAX_HEIGHT && slope > .22)
	// {
	// 	mat = vec3(.02+Noise(matPos.xz*5.0, 1.0)*.03, .05, .0);
	// 	normal = normalize(normal+vec3(Noise(matPos.xz*33.0, 1.0)*1.0-.5, .0, Noise(matPos.xz*33.0, 1.0)*1.0-.5));
		// lights.x = .0;
	// }
	
	// Snow topped mountains...
	if (matPos.y > SNOW_HEIGHT && slope > .22)
	{
		float snow = clamp(((matPos.y - SNOW_HEIGHT)*(slope-0.22)*3.5) * 0.0015, 0.0, 1.0);
		mat = mix(mat, vec3(0.9,0.9,0.9), snow);
		// mat = mix(mat, texture2D(textureSnow, vUv).rgb, snow);
		// lights.x += snow;
		// ambient+=snow *.3;
	}
	// Beach effect...
	if (matPos.y < BEACH_HEIGHT)
	{
		if (slope > .4)
		{
			float sand = clamp((BEACH_HEIGHT-matPos.y) * 1.34, 0.0, 1.0);
			// float t = (slope-.4);
			// t = (t*t);
			// mat = mix(mat, texture2D(textureSand, vUv).rgb, sand);
			mat = mix(mat, vec3(0.929412, 0.929412, 0.8), sand);
		}
		// Cheap under water darkening...it's wet after all...
		// if (matPos.y <= 0.0)
		// {
		// 	mat *= .2;
		// }
	}
	// Do the water...
	if (matPos.y <= 1.0)
	{
		// mat = mix(mat, texture2D(textureWater, vUv).rgb, 0.8);
		// mat = texture2D(textureWater, vUv).rgb;
		mat = vec3(0.46, 0.812,0.941);
	}
	return mat;
}
void main() {
	

	vec3 normal = normalize( vNormal );
	if (computeNormals) {
		normal = perturbNormal2Arb( - vViewPosition, normal, vComputedNormal, 1.0 );
	}

	if(drawBlack) {
		gl_FragColor = vec4( 0.0,0.0,0.0, 1.0 );
		return;
	} else if(drawNormals) {
		gl_FragColor = vec4(packNormalToRGB(normal), opacity);
		return;
	} else if (!drawTexture) {
		gl_FragColor = vec4( 0.0,0.0,0.0, 0.0);
		return;
	}
	float specularStrength = 1.0;

	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	if (generateColor) {
		vec2 lights = vec2(0,0);
		diffuseColor *= mapTexelToLinear(vec4(TerrainColour(vPosition, vComputedNormal.rbg, lights), 1.0));
		// specularStrength = lights.x;
	} else {
		vec4 texelColor = texture2D(map, vUv * mapMapLocation.zw + mapMapLocation.xy);
		// texelColor = mapTexelToLinear( texelColor );
		diffuseColor *= texelColor;
	}


	specularStrength =1.0;
	// accumulation
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_end>
	
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	gl_FragColor = vec4( outgoingLight, diffuseColor.a );
}
`
	});
	sharedMaterial['map'] = EMPTY_TEXTURE;

	return sharedMaterial;
}

export const customDepthMaterial = new CustomMaterial({
	defines: {USE_DISPLACEMENTMAP: ''},
	// side: DoubleSide,
	name: 'DepthMaterial',
	uniforms: {
		// drawNormals: {value: false},
		// computeNormals: {value: false},
		// drawTexture: {value: false},
		// generateColor: {value: false},
		elevationDecoder: {value: null},
		displacementMapLocation: {value: new Vector4()},
		displacementScale: {value: 1},
		displacementMap: {value: null},
		displacementBias: {value: 0}
	},
	vertexShader: `
#include <displacementmap_pars_vertex>
uniform vec4 elevationDecoder;
uniform vec4 displacementMapLocation;

float getPixelElevation(vec4 e) {
	// Convert encoded elevation value to meters
	return ((e.r * elevationDecoder.x + e.g * elevationDecoder.y  + e.b * elevationDecoder.z) + elevationDecoder.w);
}
float getElevation(vec2 coord) {
	vec4 e = texture2D(displacementMap, coord * displacementMapLocation.zw + displacementMapLocation.xy);
	return getPixelElevation(e);
}
void main() {
	vec2 vUv = vec2(position.x +  0.5, 0.5 - position.z );
    vec3 pos = position + vec3(0,getElevation(vUv) * displacementScale  + displacementBias,0);
    gl_Position = projectionMatrix * viewMatrix *  modelMatrix * vec4(pos, 1.0);
}
`, 
	fragmentShader: `
// #include <common>
#include <packing>
void main() {
	gl_FragColor = packDepthToRGBA( gl_FragCoord.z );
}`
});
export const sharedMaterial = createSharedMaterial();

export let currentColor = 0x000000;
export class MaterialHeightShader extends MapHeightNode 
{

	public static useLOD = true;

	public static useSharedShader = true;

	public fullGeometryLoaded = false;

	public static baseGeometry = MapPlaneNode.geometry;

	public static scaleRatio: number = worldScaleRatio;

	public static baseScale: Vector3 = new Vector3(UnitsUtils.EARTH_PERIMETER*MaterialHeightShader.scaleRatio, Number(MaterialHeightShader.scaleRatio), UnitsUtils.EARTH_PERIMETER*MaterialHeightShader.scaleRatio);

	public static geometries = {};

	public static geometry: BufferGeometry;

	public static getDefaultGeometry(): BufferGeometry 
	{
		if (!MaterialHeightShader.geometry) 
		{
			MaterialHeightShader.geometry = MaterialHeightShader.getSoftGeometry(16, true);
		}
		return MaterialHeightShader.geometry;
	}


	/**
	* Size of the grid of the geometry displayed on the scene for each tile.
	*/
	public static geometrySize = 4;

	declare public frustumCulled: boolean;

	public displacementMapLocation = [0, 0, 1, 1];

	public mapMapLocation = [0, 0, 1, 1];

	public heightOverZoomFactor = 1;

	public overZoomFactor = 1;

	public pointsMesh: Points;

	public static maxZoomForPeaks = 12;

	public static getGeometry(level: number): MapNodeGeometry
	{
		const length = Math.log(1/worldScaleRatio) * Math.LOG10E + 1 | 0 ;
		let size = settings.geometrySize / Math.max(Math.floor(length/2), 1);
		if (level > maxLevelForGemSize) 
		{
			size /= Math.floor(Math.pow(2, level - maxLevelForGemSize));
			size = Math.max(16, size);
		}
		let geo = MaterialHeightShader.geometries[size];
		if (!MaterialHeightShader.geometries[size]) 
		{
			geo = MaterialHeightShader.geometries[size] = new MapNodeGeometry(1, 1, size, size, {skirt: settings.exageration > 0.1, skirtDepth: 50 * settings.exageration * MaterialHeightShader.scaleRatio, uvs: false});
		}
		return geo;
	}

	public static getSoftGeometry(level: number, forceSize?: boolean): MapNodeGeometry
	{
		let size;
		if (forceSize) 
		{
			size = level;
		}
		else 
		{
			const length = Math.log(1/worldScaleRatio) * Math.LOG10E + 1 | 0 ;
			size = settings.geometrySize / Math.max(Math.pow(2, Math.floor(length/2) -1), 1);
			if (level < maxLevelForGemSize) 
			{
				size /= Math.floor(Math.pow(2, Math.floor(maxLevelForGemSize - level)));
				size = Math.max(16, size);
			}
			else if (level > maxLevelForGemSize) 
			{
				size /= Math.floor(Math.pow(2, level - maxLevelForGemSize));
				size = Math.max(16, size);
			}
		}
		let geo = MaterialHeightShader.geometries[size];
		if (!MaterialHeightShader.geometries[size]) 
		{
			geo = MaterialHeightShader.geometries[size] = new MapNodeGeometry(1, 1, size, size, {skirt: settings.exageration > 0.1, skirtDepth: 50 * settings.exageration, uvs: false});
		}
		return geo;
	}


	private getZoomFactor(): number 
	{
		let zoomFactor = 0.0;
		let level = this.level ;
		if (this.displacementMapLocation[2] !==1.0) 
		{
			level -= Math.log(1.0/this.displacementMapLocation[2])/Math.log(2.0);
		}
		if (level < 12.0) 
		{
			zoomFactor = 1.0 - 0.5/(12.0 -level);
		}
		return zoomFactor;
	}

	public constructor(parentNode: MapHeightNode, mapView: MapView, location: number, level: number, x: number, y: number) 
	{
		super(parentNode, mapView, location, level, x, y, MaterialHeightShader.getDefaultGeometry(), MaterialHeightShader.useSharedShader? sharedMaterial : sharedMaterial.clone());
		// this.material['map'] = EMPTY_TEXTURE;
		const userData = {
			displacementMap: {value: null},
			map: {value: this.material['map']},
			zoomlevel: {value: level},
			tileY: {value: y},
			displacementMapLocation: {value: this.displacementMapLocation},
			displacementRes: {value: [0, 0]},
			zoomFactor: {value: this.getZoomFactor()},
			mapMapLocation: {value: this.mapMapLocation}
		};
		if (MaterialHeightShader.useSharedShader) 
		{
			this.userData = userData;
		}
		else 
		{
			this.material.userData = userData;
		}
		// we need to set it again to ensure the shader is compiled correctly
		this.frustumCulled = false;
	}

	declare public material: ShaderMaterial;

	declare public geometry: BufferGeometry;

	public initialize(): Promise<any>
	{
		let maxUpLevel = 2;
		let parent = this.parent as MaterialHeightShader;
		while (maxUpLevel > 0 && (!parent.textureLoaded || !parent.heightLoaded)) 
		{
			parent = parent.parent as MaterialHeightShader;
			maxUpLevel--;
		}
		// if parent exists load texture from parent and show ourself to
		// prevent blick during load
		if (parent && (parent.textureLoaded && parent.heightLoaded)) 
		{
			const tileBox = tileToBBOX([this.x, this.y, this.level]);
			const parentTileBox = tileToBBOX([parent.x, parent.y, parent.level]);
			const width = parentTileBox[2] - parentTileBox[0];
			const height = parentTileBox[3] - parentTileBox[1];
			const deltaLevel = this.level - parent.level;
			const decimalFactor = Math.pow(10, deltaLevel);
			const dx = Math.floor((tileBox[0] - parentTileBox[0]) / width * decimalFactor ) / decimalFactor;
			const dy = Math.floor((tileBox[1] - parentTileBox[1]) / height * decimalFactor ) / decimalFactor;
			if (!this.textureLoaded) 
			{
				const parentOverZoomFactor = 1 / parent.mapMapLocation[2];
				const mapMapLocation = [0, 0, 1, 1];
				mapMapLocation[0] = parent.mapMapLocation[0] + dx / parentOverZoomFactor;
				mapMapLocation[1] = parent.mapMapLocation[1] + dy / parentOverZoomFactor;
				mapMapLocation[2] = mapMapLocation[3] = 1 / Math.pow(2, parentOverZoomFactor * deltaLevel);
				const parentUserData = MaterialHeightShader.useSharedShader ? parent.userData : parent.material.userData;
				this.setMaterialValues({
					map: parentUserData.map.value,
					mapMapLocation: mapMapLocation
				});
				// this.textureLoaded = true;
				// this.isTextureReady = true;
			}

			if (!this.heightLoaded) 
			{
				const parentHeightLocation = parent.displacementMapLocation;
				const parentHeightOverZoomFactor = 1 / parentHeightLocation[2];
				const displacementMapLocation = [0, 0, 1, 1];
				displacementMapLocation[0] = parentHeightLocation[0] + dx / parentHeightOverZoomFactor;
				displacementMapLocation[1] = parentHeightLocation[1] + dy / parentHeightOverZoomFactor;
				displacementMapLocation[2] = displacementMapLocation[3] = 1 / (2* parentHeightOverZoomFactor * deltaLevel);
				const parentUserData = MaterialHeightShader.useSharedShader ? parent.userData : parent.material.userData;
				// const parentUserData = parent.userData;
				this.displacementMapLocation = displacementMapLocation;
				const texture = parentUserData.displacementMap.value;
				this.setMaterialValues({
					displacementMap: texture,
					displacementMapLocation: displacementMapLocation,
					displacementRes: [1/(texture.image.width * displacementMapLocation[2]), 1/(texture.image.height * displacementMapLocation[3])],
					zoomFactor: this.getZoomFactor()
				});
				// this.material['displacementMap'] = texture;
				// this.heightLoaded = true;
				// this.isHeightReady = true;
			}
			this.show();
			
		}
		return super.initialize();
	}

	public dispose(): void 
	{
		// console.log('disposed', this.x, this.y, this.level, this.parentNode.x, this.parentNode.y, this.parentNode.level)
		super.dispose();
		this.pointsMesh = null;
	}

	public setMaterialValues(values): void
	{
		// @ts-ignore
		const userData = MaterialHeightShader.useSharedShader ? this.userData : this.material.userData;
		Object.keys(values).forEach((k) => 
		{
			// eslint-disable-next-line no-prototype-builtins
			if (userData.hasOwnProperty(k)) 
			{
				userData[k].value = values[k];
			}
		});
	}

	protected didSimplify(): void
	{
		if (this.lod) 
		{
			this.children = [this.objectsHolder, this.lod];
		}
		else 
		{
			this.children = [this.objectsHolder];
		}
	}

	public show(): void
	{
		if (!this.fullGeometryLoaded) 
		{
			this.constructLOD();
		}
		if (MaterialHeightShader.useLOD) 
		{
			this.isMesh = false;
			this.lod.visible = true;
		}
		else 
		{
			this.isMesh = true;
		}
	}

	public isVisible(): Boolean
	{
		if (MaterialHeightShader.useLOD) 
		{
			return this.lod && this.lod.visible;
		}
		else 
		{
			return this.isMesh;
		}
	}

	public hide(): void
	{
		this.isMesh = false;
		this.objectsHolder.visible = this.level !== this.mapView.maxZoomForPeaks;
		if (this.lod) 
		{
			this.lod.visible = false;
		}
	}

	private constructLOD(): void
	{
		this.fullGeometryLoaded = true;

		if (MaterialHeightShader.useLOD) 
		{
			const lod = this.lod = new LOD();
			for ( let i = 0; i < 4; i ++ ) 
			{
				let delta = i >= 3 ? i + 1 : i;
				const mesh = new Mesh( MaterialHeightShader.getSoftGeometry(this.level > maxLevelForGemSize ? this.level + delta : maxLevelForGemSize - delta), this.material);
				mesh.frustumCulled = false;
				mesh.castShadow = true;
				mesh.receiveShadow = true;
				mesh.customDepthMaterial = customDepthMaterial;
				mesh.updateMatrix();
				mesh.updateMatrixWorld(true);
				mesh.matrixAutoUpdate = false;
				lod.addLevel( mesh, 700 * Math.pow(i, FORCE_MOBILE || isMobile?5:5));
			}
			lod.updateMatrix();
			lod.updateMatrixWorld(true);
			lod.frustumCulled = false;
			lod.matrixAutoUpdate = false;
			this.add( lod );
			this.isMesh = false;
		}
		else 
		{
			this.geometry = MaterialHeightShader.getGeometry(this.level);
		}
	}

	public lod: LOD;

	/**
	* Load tile texture from the server.
	*
	*/
	public loadTexture(): Promise<any> 
	{
		if (this.isTextureReady) 
		{
			return;
		}
		this.isTextureReady = true;
		return this.mapView.provider.fetchTile(this.level, this.x, this.y).then((image) => {return this.onTextureImage(image);}).finally(() =>
		{
			if (!this.mapView) 
			{
				return;
			}
			this.textureLoaded = true;
			this.nodeReady();
		});
	}

	public onTextureImage(image): void
	{
		if (this.parentNode && image) 
		{
			this.mapMapLocation = [0, 0, 1, 1];
			const texture = new Texture(image as any);
			texture.generateMipmaps = false;
			// texture.format = RGBFormat;
			texture.magFilter = LinearFilter;
			texture.minFilter = LinearFilter;
			texture.needsUpdate = true;

			// @ts-ignore
			this.setMaterialValues({
				map: texture,
				mapMapLocation: this.mapMapLocation
			});

		}
	}

	public async onHeightImage(image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement, resetMapLocation = true): Promise<void>
	{
		if (this.mapView && image) 
		{
			if (resetMapLocation) 
			{
				this.displacementMapLocation = [0, 0, 1, 1];

			}
			let texture: Texture; 
			if (image instanceof Texture) 
			{
				texture = image;
				this.setMaterialValues({
					displacementMap: image,
					displacementMapLocation: this.displacementMapLocation,
					displacementRes: [1/(texture.image.width * this.displacementMapLocation[2]), 1/(texture.image.height * this.displacementMapLocation[3])]
				});
			}
			else 
			{
				// if (this.x === 2112 && this.y === 1471 && this.level === 12) 
				// {
				// 	generateNormalMap(image, this.x, this.y, this.level);
				// }
				texture = new Texture(image);
				texture.generateMipmaps = false;
				// texture.format = RGBFormat;
				texture.flipY = false;
				texture.wrapS = ClampToEdgeWrapping;
				texture.wrapT = ClampToEdgeWrapping;
				texture.magFilter = LinearFilter;
				texture.minFilter = LinearFilter;
				texture.needsUpdate = true;
				this.setMaterialValues({
					displacementMap: texture,
					displacementMapLocation: this.displacementMapLocation,
					displacementRes: [1/(texture.image.width * this.displacementMapLocation[2]), 1/(texture.image.height * this.displacementMapLocation[3])],
					zoomFactor: this.getZoomFactor()
				});
				// this.material['displacementMap'] = texture;
			}
			if (this.level > this.mapView.maxZoomForPeaks) 
			{
				return;
			}
			// @ts-ignore
			await this.mapView.heightProvider.fetchPeaks(this.level, this.x, this.y).then((result: any[]) => 
			{
				if (!this.mapView) 
				{
					return;
				}
				result = result.filter(
					(f: { properties: { name: any; class: string; }; }) => { return f.properties.name && f.properties.class === 'peak' && f.properties['ele'] !== undefined; }
				);
				
				if (result.length > 0) 
				{
					const elevationDecoder = settings.elevationDecoder;
					const features = [];
					var colors = [];
					var points = [];
					const vec = new Vector3(
						0,
						0,
						0
					);
					const userData = MaterialHeightShader.useSharedShader ? this.userData : this.material.userData; 

					const displacementMapLocation = userData.displacementMapLocation.value;
					let coords, coordsXY = new Vector2(), pixel, color;
					const imageData = getImageData(texture.image as ImageBitmap);
					

					const scale = MaterialHeightShader.scaleRatio;
					result.forEach((f: { geometry: { coordinates: any[]; }; localCoords: Vector3; id: any; pointIndex: number; level: number; x: number; y: number; color: number; properties: { ele: number; name: string, computedEle?: number}; }, index: any) => 
					{
						coords = f.geometry.coordinates;
						UnitsUtils.datumsToSpherical(
							coords[1],
							coords[0], coordsXY, 
							scale
						);
						vec.set(coordsXY.x, 0, -coordsXY.y);
						f.localCoords = this.worldToLocal(
							vec
						);
						if (Math.abs(f.localCoords.x) <=
										0.5 &&
										Math.abs(f.localCoords.z) <=
										0.5) 
						{
							const id = coords.join(
								','
							);
							f.id = id;
							f.pointIndex = features.length;
							f.level = this.level;
							f.x = this.x;
							f.y = this.y;
							pixel = getPixel(imageData, displacementMapLocation, {lat: coords[1], lon: coords[0]}, this.level);
							const ele = f.properties.computedEle = Math.ceil(pixel[0]/255* elevationDecoder[0] + pixel[1]/255* elevationDecoder[1] + pixel[2]/255* elevationDecoder[2]+ elevationDecoder[3]);
							f.localCoords.y = ele;
							color = f.color = currentColor = (currentColor + 1) %0xfffffe;
							
							featuresByColor[color] = f;
							// if (f.properties.name.endsWith('Monte Bianco')) 
							// {
							// 	testColor = color;
							// 	console.log('monte bianco color', color);
							// }
							features.push(f);
							colors.push(
								(color >> 16 & 255) /
											255,
								(color >> 8 & 255) /
											255,
								(color & 255) / 255
							);
							points.push(
								f.localCoords.x,
								f.localCoords.y,
								f.localCoords.z
							);
						}
					});
					if (points.length > 0) 
					{
						const geometry = new BufferGeometry();
						const pointAttributes = new Float32BufferAttribute(
							points,
							3
						);
						pointAttributes.name = 'points';
						geometry.setAttribute('position', pointAttributes);

						const colorsAttributes = new Float32BufferAttribute(
							colors,
							3
						);
						colorsAttributes.name = 'colors';
						geometry.setAttribute('color', colorsAttributes);

						var mesh = new Points(
							geometry,
							sharedPointMaterial,
						);
						// const userData = MaterialHeightShader.useSharedShader ? this.userData : this.material.userData; 
						mesh.userData = {};
						mesh.frustumCulled = false;

						mesh.updateMatrix();
						mesh.updateMatrixWorld(true);
						this.pointsMesh = mesh;
						this.objectsHolder.add(mesh);
					}
				}

				// requestRenderIfNotRequested(true);
			}).catch((err) => 
			{
				console.error('error fetching peaks', err);
			});
			
		}
	}

	protected async handleParentOverZoomTile(resolve?): Promise<any>
	{
		if (!this.mapView) 
		{
			return;
		}
		const tileBox = tileToBBOX([this.x, this.y, this.level]);
		const parent = this.parent as MaterialHeightShader;
		const parentOverZoomFactor = parent.heightOverZoomFactor;
		const parentTileBox = tileToBBOX([parent.x, parent.y, parent.level]);
		const width = parentTileBox[2] - parentTileBox[0];
		const height = parentTileBox[3] - parentTileBox[1];
		this.heightOverZoomFactor = parentOverZoomFactor * 2;
		this.displacementMapLocation[0] = parent.displacementMapLocation[0] + Math.floor((tileBox[0] - parentTileBox[0]) / width * 10 ) / 10 / parentOverZoomFactor;
		this.displacementMapLocation[1] = parent.displacementMapLocation[1] + Math.floor((tileBox[1] - parentTileBox[1]) / height * 10 ) / 10 / parentOverZoomFactor;
		this.displacementMapLocation[2] = this.displacementMapLocation[3] = 1 / this.heightOverZoomFactor;

		const userData = MaterialHeightShader.useSharedShader ? parent.userData : parent.material.userData; 
		await this.onHeightImage(userData.displacementMap.value, false);
		resolve?.();
	}

	/**
	* Overrides normal raycasting, to avoid raycasting when isMesh is set to false.
	*
	* Switches the geometry for a simpler one for faster raycasting.
	*/
	public raycast(raycaster: Raycaster, intersects: Intersection[]): boolean
	{
		if (this.isVisible()) 
		{
			const oldGeometry = this.geometry;
			this.geometry = MapPlaneNode.geometry;

			const result = Mesh.prototype.raycast.call(this, raycaster, intersects);

			this.geometry = oldGeometry;

			return result;
		}

		return false;
	}
}
