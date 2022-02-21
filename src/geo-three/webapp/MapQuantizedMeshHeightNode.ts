import decode, {DECODING_STEPS} from '@here/quantized-mesh-decoder';
import {settings} from './settings';
import {Box3, BufferAttribute, BufferGeometry, DoubleSide, Float32BufferAttribute, MeshPhongMaterial, Points, ShaderMaterial, Texture, TextureLoader, Vector2, Vector3} from 'three';
import {MapView} from '../source/MapView';
import {MapHeightNode} from '../source/nodes/MapHeightNode';
import {MapNode} from '../source/nodes/MapNode';
import {UnitsUtils} from '../source/utils/UnitsUtils';
import {requestRenderIfNotRequested} from './app';

export let currentColor = 0xffffff;

const container = new Box3(
	new Vector3(-1, -1, 0),
	new Vector3(1, 1, 1)
);

function constructPositionAttribute(vertexData, header): BufferAttribute
{
	const elementsPerVertex = 3;
	const vertexCount = vertexData.length / elementsPerVertex;
	const positionAttributeArray = new Float32Array(vertexData.length);
  
	const vertexMaxPosition = 32767;
	const containerSize = new Vector3();
  
	container.getSize(containerSize);
  
	const xScale = 1 / vertexMaxPosition;
	const yScale = 1 / vertexMaxPosition;
	const zScale = 1 / vertexMaxPosition;
	const minHeight = header.minHeight;
	const maxHeight = header.maxHeight;
  
	// const xScale = 1;
	// const yScale = 1;
	// const zScale = 1;
  
	for (let i = 0; i < vertexData.length; i++) 
	{
		positionAttributeArray[i * elementsPerVertex] = vertexData[i] * xScale - 0.5;
		positionAttributeArray[i * elementsPerVertex + 1] = vertexData[i + vertexCount* 2] * yScale* (maxHeight - minHeight)+ minHeight;
		positionAttributeArray[i * elementsPerVertex + 2] = 1-vertexData[i + vertexCount] * zScale - 0.5;
	}
  
	return new BufferAttribute(positionAttributeArray, elementsPerVertex);
}

function signNotZero(vector): Vector2
{
	return new Vector2(
		vector.x >= 0 ? 1 : -1,
		vector.y >= 0 ? 1 : -1
	);
}
  
function decodeOct(encodedVector: Vector2): Vector3
{
	let tempVector = encodedVector.divideScalar(255).multiplyScalar(2).subScalar(1);
  
	const decodedVector = new Vector3(
		tempVector.x,
		tempVector.y,
		1 - Math.abs(tempVector.x) - Math.abs(tempVector.y)
	);
  
	if (decodedVector.z < 0) 
	{
		const xy = new Vector2(decodedVector.x, decodedVector.y);
		const xyAbs = xy.distanceTo(new Vector2(0, 0));
		const xySign = signNotZero(xy);
		const decodedXy = xySign.multiplyScalar(1 - xyAbs);
  
		decodedVector.set(decodedXy.x, decodedXy.y, decodedVector.z);
	}
  
	return decodedVector.normalize();
}
  
function constructNormalAttribute(vertexNormalsBuffer, vertexData): BufferAttribute
{
	const view = new DataView(vertexNormalsBuffer);
	const elementsPerEncodedNormal = 2;
	const elementsPerNormal = 3;
	const vertexNormalsAttributeArray = new Float32Array(vertexData.length);
  
	for (let position = 0, i = 0; position < vertexNormalsBuffer.byteLength; position += Uint8Array.BYTES_PER_ELEMENT * elementsPerEncodedNormal, i++) 
	{
		const decodedNormal = decodeOct(new Vector2(
			view.getUint8(position),
			view.getUint8(position + Uint8Array.BYTES_PER_ELEMENT)
		));
  
		vertexNormalsAttributeArray[i * elementsPerNormal] = decodedNormal.x;
		vertexNormalsAttributeArray[i * elementsPerNormal + 1] = decodedNormal.y;
		vertexNormalsAttributeArray[i * elementsPerNormal + 2] = decodedNormal.z;
	}
  
	return new BufferAttribute(vertexNormalsAttributeArray, elementsPerNormal, true);
}

/**
 * Drops Z-coordinate of each vertex and scales
 * X and Y to the [0, 1] range
 */
function constructUvAttribute(verticesArray: ArrayLike<number>): BufferAttribute
{
	const containerSize = new Vector3();
	const elementsPerVertex = 3;
	const elementsPerUv = 2;
	const uvArray = new Float32Array(
		verticesArray.length / elementsPerVertex * elementsPerUv
	);
  
	container.getSize(containerSize);
  
	for (let i = 0, uvIndex = 0; i < verticesArray.length; i+=elementsPerVertex) 
	{
		uvArray[uvIndex++] = verticesArray[i+0] + 0.5;
		uvArray[uvIndex++] = -(verticesArray[i+2] - 0.5);
	}
  
	return new BufferAttribute(uvArray, elementsPerUv);
}
function constructGeometry({header, vertexData, triangleIndices, extensions}): BufferGeometry
{
	const planeGeometry = new BufferGeometry();
	const positionAttribute = constructPositionAttribute(vertexData, header);
	const uvAttribute = constructUvAttribute(positionAttribute.array);
  
	planeGeometry.setAttribute('position', positionAttribute);
	planeGeometry.setAttribute('uv', uvAttribute);
  
	if (triangleIndices !== undefined) 
	{
		const indexAttribute = new BufferAttribute(triangleIndices, 1);
  
		planeGeometry.setIndex(indexAttribute);
	}
  
	// if (extensions !== undefined && extensions.vertexNormals !== undefined) 
	// {
	// 	const normalAttribute = constructNormalAttribute(extensions.vertexNormals, vertexData);
  
	// 	planeGeometry.setAttribute('normal', normalAttribute);
	// }
	// else 
	// {
	planeGeometry.computeVertexNormals();
	// }
  
	return planeGeometry;
}
/** 
 * Represents a height map tile node that can be subdivided into other height nodes.
 * 
 * Its important to update match the height of the tile with the neighbors nodes edge heights to ensure proper continuity of the surface.
 * 
 * The height node is designed to use MapBox elevation tile encoded data as described in https://www.mapbox.com/help/access-elevation-data/
 *
 * @param parentNode  -The parent node of this node.
 * @param mapView - Map view object where this node is placed.
 * @param location - Position in the node tree relative to the parent.
 * @param level - Zoom level in the tile tree of the node.
 * @param x - X position of the node in the tile tree.
 * @param y - Y position of the node in the tile tree.
 * @param material   -Material used to render this height node.
 * @param geometry - Geometry used to render this height node.
 */
export class MapQuantizedMeshHeightNode extends MapHeightNode
{
	public static geometrySize = 16;

	public static baseScale: Vector3 = new Vector3(UnitsUtils.EARTH_PERIMETER, 1, UnitsUtils.EARTH_PERIMETER);

	/**
	* Empty texture used as a placeholder for missing textures.
	*/
	public static EMPTY_TEXTURE: Texture = new Texture();

	public static prepareMaterial(material, level, exageration): any 
	{
		// not all are used
		// but for now it helps in fast switching between martini and height shader
		material.userData = {
			heightMap: {value: MapQuantizedMeshHeightNode.EMPTY_TEXTURE},
			drawNormals: {value: 0},
			drawBlack: {value: 0},
			zoomlevel: {value: level},
			exageration: {value: exageration},
			computeNormals: {value: 1},
			drawTexture: {value: 1},
			elevationDecoder: {value: null}
		};

		material.onBeforeCompile = (shader) => 
		{
			// Pass uniforms from userData to the
			for (let i in material.userData) 
			{
				shader.uniforms[i] = material.userData[i];
			}
			// Vertex variables
			shader.vertexShader =
				`
				uniform float exageration;
				
				` + shader.vertexShader;
			shader.fragmentShader =
				`
				uniform bool drawNormals;
				uniform bool drawTexture;
				uniform bool drawBlack;
				` + shader.fragmentShader;

			// Vertex depth logic
			shader.fragmentShader = shader.fragmentShader.replace(
				'#include <dithering_fragment>',
				`
				if(drawBlack) {
					gl_FragColor = vec4( 0.0,0.0,0.0, 1.0 );
				} else if(drawNormals) {
					gl_FragColor = vec4( ( 0.5 * vNormal + 0.5 ), 1.0 );
				} else if (!drawTexture) {
					gl_FragColor = vec4( 0.0,0.0,0.0, 0.0 );
				}
					`
			);
			shader.vertexShader = shader.vertexShader.replace(
				'#include <fog_vertex>',
				`
					#include <fog_vertex>
					mvPosition = modelViewMatrix * vec4( position.x,  position.y * exageration, position.z, 1.0 );
					gl_Position = projectionMatrix * mvPosition;
					// gl_Position.y *= exageration;
					`
			);
		};

		return material;
	}

	public exageration = 1.0;


	declare public material: MeshPhongMaterial;

	public constructor(parentNode: MapHeightNode = null, mapView: MapView = null, location: number = MapNode.root, level: number = 0, x: number = 0, y: number = 0)
	{

		super(parentNode, mapView, location, level, x, y, MapQuantizedMeshHeightNode.geometry, MapQuantizedMeshHeightNode.prepareMaterial(new MeshPhongMaterial({
			map: MapQuantizedMeshHeightNode.EMPTY_TEXTURE,
			color: 0xffffff,
			side: DoubleSide
		}), level, settings.exageration));

		this.exageration = settings.exageration;
		this.frustumCulled = false;
	}
	
	/**
	* Original tile size of the images retrieved from the height provider.
	*
	*/
	public static tileSize = 256;

	
	// public async onHeightImage(image): Promise<void> 
	// {
	// 	if (image) 
	// 	{
	// 		const tileSize = image.width;
	// 		const gridSize = tileSize + 1;
	// 		var canvas = new OffscreenCanvas(tileSize, tileSize);
	
	// 		var context = canvas.getContext('2d');
	// 		context.imageSmoothingEnabled = false;
	// 		context.drawImage(image, 0, 0, tileSize, tileSize, 0, 0, canvas.width, canvas.height);
			
	// 		var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
	// 		var data = imageData.data;

	// 		const terrain = getTerrain(data, tileSize, this.elevationDecoder);
	// 		const martini = new Martini(gridSize);
	// 		const tile = martini.createTile(terrain);
	// 		const {vertices, triangles} = tile.getMesh(typeof this.meshMaxError === 'function' ? this.meshMaxError(this.level) : this.meshMaxError);
	// 		const attributes = getMeshAttributes(vertices, terrain, tileSize, [-0.5, -0.5, 0.5, 0.5], this.exageration);
	// 		this.geometry = new BufferGeometry();
	// 		this.geometry.setIndex(new Uint32BufferAttribute(triangles, 1));
	// 		this.geometry.setAttribute( 'position', new Float32BufferAttribute( attributes.position.value, attributes.position.size ) );
	// 		this.geometry.setAttribute( 'uv', new Float32BufferAttribute( attributes.uv.value, attributes.uv.size ) );
	// 		this.geometry.rotateX(Math.PI);

	// 		var texture = new Texture(image);
	// 		texture.generateMipmaps = false;
	// 		texture.format = RGBFormat;
	// 		texture.magFilter = NearestFilter;
	// 		texture.minFilter = NearestFilter;
	// 		texture.needsUpdate = true;
	// 		this.material.userData.heightMap.value = texture;
	// 	}
	// }
	

	public async loadHeightGeometry(): Promise<any> 
	{
		if (this.isHeightReady) 
		{
			return;
		}
		this.isHeightReady = true;
		const heightProvider = this.mapView.heightProvider;
		if (heightProvider === null) 
		{
			throw new Error('GeoThree: MapView.heightProvider provider is null.');
		}
		try 
		{
			const zoom = this.level;
			if (zoom > heightProvider.maxZoom && zoom <= heightProvider.maxZoom + heightProvider['maxOverZoom']) 
			{
				const parent = this.parent;
				if (parent.heightLoaded ) 
				{
					this.handleParentOverZoomTile();
				}
				else 
				{
					const promise = new Promise((resolve) => 
					{
						parent.heightListeners.push(() => {return this.handleParentOverZoomTile(resolve);});
					});
					if ( !parent.isHeightReady) 
					{
						// ensure parent is loaded first
						parent.loadHeightGeometry();
					}
					await promise;
				} 
			}
			else 
			{
				const buffer = await this.mapView.heightProvider.fetchTile(zoom, this.x, this.y);
				const decodedMesh = decode(buffer, {maxDecodingStep: DECODING_STEPS[DECODING_STEPS.length -1]});
				this.geometry = constructGeometry(decodedMesh);
				
				// this.geometry = new BufferGeometry();
				// this.geometry.setIndex(new Uint32BufferAttribute(triangles, 1));
				// this.geometry.setAttribute( 'position', new Float32BufferAttribute( attributes.position.value, attributes.position.size ) );
				// this.geometry.setAttribute( 'uv', new Float32BufferAttribute( attributes.uv.value, attributes.uv.size ) );
				// this.geometry.rotateX(Math.PI);
				// this.onHeightImage(image);
			}

			if (this.level > 14) 
			{
				return;
			}
			// @ts-ignore
			this.mapView.heightProvider.fetchPeaks(this.level, this.x, this.y).then((result: any[]) => 
			{
				result = result.filter(
					(f: { properties: { name: any; class: string; }; }) => 
					{
						return f.properties.name && f.properties['ele'] !== undefined; 
					}
				);
				
				if (result.length > 0) 
				{
					const features = [];
					var colors = [];
					var points = [];
					const vec = new Vector3(
						0,
						0,
						0
					);
					result.forEach((f: { geometry: { coordinates: any[]; }; localCoords: Vector3; id: any; pointIndex: number; level: number; x: number; y: number; color: number; properties: { ele: any; name: string}; }, index: any) => 
					{
						var coords = UnitsUtils.datumsToSpherical(
							f.geometry.coordinates[1],
							f.geometry.coordinates[0]
						);
						vec.set(coords.x, 0, -coords.y);
						f.localCoords = this.worldToLocal(
							vec
						);
						if (Math.abs(f.localCoords.x) <=
										0.5 &&
										Math.abs(f.localCoords.z) <=
										0.5) 
						{
							const id = f.geometry.coordinates.join(
								','
							);
							f.id = id;
							f.pointIndex =
											features.length;
							features.push(f);
							f.level = this.level;
							f.x = this.x;
							f.y = this.y;
							const color = f.color = currentColor--;
							// featuresByColor[color] = f;
							f.localCoords.y = 1;
							colors.push(
								(color >> 16 & 255) /
											255,
								(color >> 8 & 255) /
											255,
								(color & 255) / 255
							);
							points.push(
								f.localCoords.x,
								f.properties.ele,
								f.localCoords.z
							);
						}
					});
					if (points.length > 0) 
					{
						const geometry = new BufferGeometry();
						geometry.setAttribute(
							'position',
							new Float32BufferAttribute(
								points,
								3
							)
						);
						geometry.setAttribute(
							'color',
							new Float32BufferAttribute(
								colors,
								3
							)
						);
						const material = new ShaderMaterial({
							userData: 
								{
									heightMap: this.material.userData.heightMap,
									exageration: {value: settings.exageration},
									elevationDecoder: this.material.userData.elevationDecoder,
									heightMapLocation: this.material.userData.heightMapLocation,
									forViewing: {value: settings.debugFeaturePoints}, 
									far: {value: settings.far}, 
									pointTexture: {value: new TextureLoader().load( 'disc.png' )}
								},
							vertexShader: `
							attribute vec4 color;
							uniform float exageration;
							uniform bool forViewing;
							uniform float far;
							varying float depth;
							varying vec4 vColor;
	
							void main() {
								vec4 mvPosition = modelViewMatrix * vec4( position.x,  position.y * exageration, position.z, 1.0 );
								gl_Position = projectionMatrix * mvPosition;
								if (forViewing) {
									gl_PointSize = 10.0 - gl_Position.z/ far * 6.0;
									vColor = vec4(0.0, 0.0, 1.0, 1);
								} else {
									gl_Position.z -= (position.y / 1000.0 - floor(position.y / 1000.0)) * gl_Position.z / 1000.0;
									// gl_PointSize = pow(gl_Position.z, 1.2)/ far;
									gl_PointSize = 2.0 + gl_Position.z / far;
									vColor = color;
								}
								depth = gl_Position.z;
							}
							`,
							fragmentShader: `
							varying vec4 vColor;
							varying float depth;
							uniform float far;
							uniform bool forViewing;
							uniform sampler2D pointTexture;
							void main() {
								gl_FragColor = vColor;
								// if (forViewing) {
								// 	gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );
								// }
								if (depth > far) {
									discard;
								}
							}
							`,
							fog: true,
							transparent: true
						});
						var mesh = new Points(
							geometry,
							material
						);
						material.onBeforeCompile = (shader: { uniforms: { [x: string]: any; }; vertexShader: string; fragmentShader: string; }) => 
						{
							// Pass uniforms from userData to the
							for (const i in material.userData) 
							{
								shader.uniforms[i] = material.userData[i];
							}
						};
						// (mesh as any).features = features;
						mesh.frustumCulled = false;

						mesh.updateMatrix();
						mesh.updateMatrixWorld(true);
						// this.objectsHolder.visible = debugFeaturePoints;
						this.objectsHolder.add(mesh);
					}
				}

				requestRenderIfNotRequested(true);
			});

		}
		finally 
		{
			this.heightLoaded = true;
			this.heightListeners.forEach((l) => {return l();});
			this.heightListeners = [];
			this.nodeReady();
		}
	}

}
