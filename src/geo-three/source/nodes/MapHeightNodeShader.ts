import {BufferGeometry, Intersection, LinearFilter, Material, MeshPhongMaterial, NearestFilter, Raycaster, RGBFormat, Texture, Vector3, Vector4} from 'three';
import {MapHeightNode} from './MapHeightNode';
import {MapNodeGeometry} from '../geometries/MapNodeGeometry';
import {MapPlaneNode} from './MapPlaneNode';
import {UnitsUtils} from '../utils/UnitsUtils';
import {MapNode} from './MapNode';
import {MapView} from '../MapView';
import {tileToBBOX} from '@mapbox/tilebelt';

/**
 * Map height node that uses GPU height calculation to generate the deformed plane mesh.
 *
 * This solution is faster if no mesh interaction is required since all trasnformations are done in the GPU the transformed mesh cannot be accessed for CPU operations (e.g. raycasting).
 *
 * @param parentNode - The parent node of this node.
 * @param mapView - Map view object where this node is placed.
 * @param location - Position in the node tree relative to the parent.
 * @param level - Zoom level in the tile tree of the node.
 * @param x - X position of the node in the tile tree.
 * @param y - Y position of the node in the tile tree.
 */
export class MapHeightNodeShader extends MapHeightNode 
{
	/**
	 * Variable used to get correct height map location while using maxOverZoom
	 */
	protected heightMapLocation = [0, 0, 1, 1];

	/**
	 * Variable used to get correct height map location while using maxOverZoom
	 */
	protected overZoomFactor = 1;


	public constructor(parentNode: MapHeightNode = null, mapView: MapView = null, location: number = MapNode.root, level: number = 0, x: number = 0, y: number = 0) 
	{
		super(parentNode, mapView, location, level, x, y, MapHeightNodeShader.geometry, MapHeightNodeShader.prepareMaterial(new MeshPhongMaterial({map: MapHeightNodeShader.EMPTY_TEXTURE})));

		this.frustumCulled = false;
	}

	public static ELEVATION_DECODER = [6553.6 * 255, 25.6 * 255, 0.1 * 255, -10000];

	/**
	 * Empty texture used as a placeholder for missing textures.
	 */
	public static EMPTY_TEXTURE: Texture = new Texture();

	/**
	 * Size of the grid of the geometry displayed on the scene for each tile.
	 */
	public static geometrySize: number = 256;

	/**
	 * Map node plane geometry.
	 */
	public static geometry: BufferGeometry = new MapNodeGeometry(1, 1, MapHeightNode.geometrySize, MapHeightNode.geometrySize);

	public static baseGeometry: BufferGeometry = MapPlaneNode.geometry;

	public static baseScale: Vector3 = new Vector3(UnitsUtils.EARTH_PERIMETER, 1, UnitsUtils.EARTH_PERIMETER);

	declare public material: Material;

	/**
	 * Prepare the three.js material to be used in the map tile.
	 *
	 * @param material - Material to be transformed.
	 */
	public static prepareMaterial(material: Material): Material
	{
		material.userData = {
			heightMap: {value: MapHeightNodeShader.EMPTY_TEXTURE},
			elevationDecoder: {value: MapHeightNodeShader.ELEVATION_DECODER},
			heightMapLocation: {value: new Vector4()}
		};

		material.onBeforeCompile = (shader) => 
		{
			// Pass uniforms from userData to the
			for (const i in material.userData) 
			{
				shader.uniforms[i] = material.userData[i];
			}

			// Vertex variables
			shader.vertexShader =
				`
			uniform sampler2D heightMap;
			uniform vec4 heightMapLocation;
			uniform vec4 elevationDecoder;
			float getPixelElevation(vec4 e) {
				// Convert encoded elevation value to meters
				return ((e.r * elevationDecoder.x + e.g * elevationDecoder.y  + e.b * elevationDecoder.z) + elevationDecoder.w) * exageration;
			}
			float getElevation(vec2 coord) {
				vec4 e = texture2D(heightMap, coord * heightMapLocation.zw + heightMapLocation.xy);
				return getPixelElevation(e);
			}
			` + shader.vertexShader;

			// Vertex depth logic
			shader.vertexShader = shader.vertexShader.replace('#include <fog_vertex>', `
			#include <fog_vertex>
	
			// Calculate height of the title
			float _height = getElevation(vUv);
			vec3 _transformed = position + _height * normal;
	
			// Vertex position based on height
			gl_Position = projectionMatrix * modelViewMatrix * vec4(_transformed, 1.0);
			`);
		};

		return material;
	}

	public onHeightImage(image): void
	{
		if (image) 
		{
			const texture = new Texture(image as any);
			texture.generateMipmaps = false;
			texture.format = RGBFormat;
			texture.magFilter = NearestFilter;
			texture.minFilter = NearestFilter;
			texture.needsUpdate = true;
			
			// @ts-ignore
			this.material.userData.heightMap.value = texture;
		}
	}

	protected async handleParentOverZoomTile(resolve?): Promise<any>
	{
		const tileBox = tileToBBOX([this.x, this.y, this.level]);
		const parent = this.parent as MapHeightNodeShader;
		const parentOverZoomFactor = parent.overZoomFactor;
		const parentTileBox = tileToBBOX([parent.x, parent.y, parent.level]);
		const width = parentTileBox[2] - parentTileBox[0];
		const height = parentTileBox[3] - parentTileBox[1];
		this.overZoomFactor = parentOverZoomFactor * 2;
		this.heightMapLocation[0] = parent.heightMapLocation[0] + Math.floor((tileBox[0] - parentTileBox[0]) / width * 10 ) / 10 / parentOverZoomFactor;
		this.heightMapLocation[1] = parent.heightMapLocation[1] + Math.floor((tileBox[1] - parentTileBox[1]) / height * 10 ) / 10 / parentOverZoomFactor;
		this.heightMapLocation[2] = this.heightMapLocation[3] = 1 / this.overZoomFactor;

		this.material.userData.heightMapLocation.value.set(...this.heightMapLocation);
		await this.onHeightImage(parent.material.userData.heightMap.value);

		if (resolve) 
		{
			resolve();
		}
	}

	/**
	 * Overrides normal raycasting, to avoid raycasting when isMesh is set to false.
	 *
	 * Switches the geometry for a simpler one for faster raycasting.
	 */
	public raycast(raycaster: Raycaster, intersects: Intersection[]): void
	{
		if (this.isVisible()) 
		{
			this.geometry = MapPlaneNode.geometry;

			const result = super.raycast(raycaster, intersects);

			this.geometry = MapHeightNodeShader.geometry;

			return result;
		}
		
		// @ts-ignore
		return false;
	}
}
