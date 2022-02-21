import {LinearFilter, Material, MeshPhongMaterial, BufferGeometry, RGBFormat, Texture, Vector3, Raycaster, Intersection} from 'three';
import {MapNodeGeometry} from '../geometries/MapNodeGeometry';
import {MapNode} from './MapNode';
import {MapPlaneNode} from './MapPlaneNode';
import {UnitsUtils} from '../utils/UnitsUtils';
import {MapView} from '../MapView';
import {MapNodeHeightGeometry} from '../geometries/MapNodeHeightGeometry';
import {CanvasUtils} from '../utils/CanvasUtils';

/**
 * Represents a height map tile node that can be subdivided into other height nodes.
 *
 * Its important to update match the height of the tile with the neighbors nodes edge heights to ensure proper continuity of the surface.
 *
 * The height node is designed to use MapBox elevation tile encoded data as described in https://www.mapbox.com/help/access-elevation-data/
 */
export class MapHeightNode extends MapNode 
{
	/**
	 * Flag indicating if the tile height data was loaded (even if failed).
	 */
	public heightLoaded: boolean = false;

	/**
	 * Variable indicating if it ready to be drawn
	 * which means it has started or loaded its height data
	 */
	public isHeightReady: boolean;

	/**
	 * Map height node constructor.
	 *
	 * @param parentNode - The parent node of this node.
	 * @param mapView - Map view object where this node is placed.
	 * @param location - Position in the node tree relative to the parent.
	 * @param level - Zoom level in the tile tree of the node.
	 * @param x - X position of the node in the tile tree.
	 * @param y - Y position of the node in the tile tree.
	 * @param material - Material used to render this height node.
	 * @param geometry - Geometry used to render this height node.
	 */
	public constructor(parentNode: MapHeightNode = null, mapView: MapView = null, location: number = MapNode.root, level: number = 0, x: number = 0, y: number = 0, geometry: BufferGeometry = MapHeightNode.geometry, material: Material = new MeshPhongMaterial({color: 0x000000, emissive: 0xffffff})) 
	{
		super(parentNode, mapView, location, level, x, y, geometry, material);
		this.matrixAutoUpdate = false;
		const autoLoad = mapView.nodeShouldAutoLoad();
		this.isHeightReady = autoLoad;
	}

	/**
	 * Original tile size of the images retrieved from the height provider.
	 */
	public static tileSize: number = 256;

	/**
	 * Size of the grid of the geometry displayed on the scene for each tile.
	 */
	public static geometrySize: number = 16;

	/**
	 * Map node plane geometry.
	 */
	public static geometry: BufferGeometry = new MapNodeGeometry(1, 1, MapHeightNode.geometrySize, MapHeightNode.geometrySize);

	public static baseGeometry: BufferGeometry = MapPlaneNode.geometry;

	public static BASE_SCALE: Vector3 = new Vector3(UnitsUtils.EARTH_PERIMETER, 1, UnitsUtils.EARTH_PERIMETER);

	public initialize(): Promise<any>  
	{
		super.initialize();
		return Promise.all([this.loadTexture(), this.loadHeightGeometry()]);
	}


	public dispose(): void
	{
		this.mapView.heightProvider.cancelTile(this.level, this.x, this.y);
		super.dispose();
	}

	/**
	 * Handle loaded texture
	 *
	 * This base method assumes the existence of a material attribute with a map texture.
	 */
	protected onTextureImage(image): void
	{
		if (image) 
		{
			const texture = new Texture(image as any);
			texture.generateMipmaps = false;
			texture.format = RGBFormat;
			texture.magFilter = LinearFilter;
			texture.minFilter = LinearFilter;
			texture.needsUpdate = true;

			// @ts-ignore
			this.material.map = texture;
		}
	}
	
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
			this.textureLoaded = true;
			this.nodeReady();
		});
	}

	public nodeReady(): void 
	{
		if (!this.mapView || !this.heightLoaded || !this.textureLoaded) 
		{
			return;
		}

		super.nodeReady();
	}

	public createChildNodes(): void 
	{
		const level = this.level + 1;
		var prototype = Object.getPrototypeOf(this);

		const x = this.x * 2;
		const y = this.y * 2;
		let node = new prototype.constructor(this, this.mapView, MapNode.topLeft, level, x, y);
		node.scale.set(0.5, 1, 0.5);
		node.position.set(-0.25, 0, -0.25);
		this.add(node);
		node.updateMatrix();
		node.updateMatrixWorld(true);

		node = new prototype.constructor(this, this.mapView, MapNode.topRight, level, x + 1, y);
		node.scale.set(0.5, 1, 0.5);
		node.position.set(0.25, 0, -0.25);
		this.add(node);
		node.updateMatrix();
		node.updateMatrixWorld(true);

		node = new prototype.constructor(this, this.mapView, MapNode.bottomLeft, level, x, y + 1);
		node.scale.set(0.5, 1, 0.5);
		node.position.set(-0.25, 0, 0.25);
		this.add(node);
		node.updateMatrix();
		node.updateMatrixWorld(true);

		node = new prototype.constructor(this, this.mapView, MapNode.bottomRight, level, x + 1, y + 1);
		node.scale.set(0.5, 1, 0.5);
		node.position.set(0.25, 0, 0.25);
		this.add(node);
		node.updateMatrix();
		node.updateMatrixWorld(true);
	}

	declare public parentNode: MapHeightNode;

	declare public parent: MapHeightNode;

	public heightListeners = [];

	protected async handleParentOverZoomTile(resolve?): Promise<void> 
	{
		throw new Error('not implemented');
	}

	public async loadHeightGeometry(): Promise<any> 
	{
		if (this.isHeightReady || !this.mapView) 
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
				const parent = this.parentNode;
				if (parent.heightLoaded ) 
				{
					await this.handleParentOverZoomTile();
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
				const image = await this.mapView.heightProvider.fetchTile(zoom, this.x, this.y);
				await this.onHeightImage(image);
			}
		}
		finally 
		{
			if (this.mapView) 
			{
				this.heightLoaded = true;
				this.heightListeners.forEach((l) => {return l();});
				this.nodeReady();
			}
			this.heightListeners = [];
		}
	}

	/**
	 * Load height texture from the server and create a geometry to match it.
	 *
	 * @returns Returns a promise indicating when the geometry generation has finished.
	 */
	public onHeightImage(image): void
	{
		const canvas = CanvasUtils.createOffscreenCanvas(MapHeightNode.geometrySize + 1, MapHeightNode.geometrySize + 1);

		const context = canvas.getContext('2d');
		context.imageSmoothingEnabled = false;
		context.drawImage(image, 0, 0, MapHeightNode.tileSize, MapHeightNode.tileSize, 0, 0, canvas.width, canvas.height);

		const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

		const geometry = new MapNodeHeightGeometry(1, 1, MapHeightNode.geometrySize, MapHeightNode.geometrySize, true, 10.0, imageData, true);

		this.geometry = geometry;
		
	}

	/**
	 * Overrides normal raycasting, to avoid raycasting when isMesh is set to false.
	 */
	public raycast(raycaster: Raycaster, intersects: Intersection[]): void
	{
		if (this.isVisible()) 
		{
			return super.raycast(raycaster, intersects);
		}

		// @ts-ignore
		return false;
	}
}
