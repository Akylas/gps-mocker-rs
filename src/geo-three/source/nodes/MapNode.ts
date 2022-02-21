import {Group, LinearFilter, Material, Mesh, MeshPhongMaterial, Object3D, RGBFormat, Texture, Vector3, BufferGeometry} from 'three';
import {MapView} from '../MapView';
import {CanvasUtils} from '../utils/CanvasUtils';


const nodesMap = new Map<string, MapNode>();

export function getNode(level, x, y): MapNode
{
	return nodesMap.get(`${level}_${x}_${y}`);
}
export function clearNodeCache(): void
{
	nodesMap.clear();
}

export function clearCacheRecursive(item: MapNode): void
{
	if (item.childrenCache) 
	{
		item.childrenCache.forEach(clearCacheRecursive);
		item.childrenCache = null;
		item.nodesLoaded = 0;
	}
	if (item.children?.length > 0) 
	{
		item.children.forEach((c) => {return c instanceof MapNode && clearCacheRecursive(c);});
		item.children = [];
	}
	item.dispose();
}

/**
 * Represents a map tile node inside of the tiles quad-tree
 *
 * Each map node can be subdivided into other nodes.
 *
 * It is intended to be used as a base class for other map node implementations.
 */
export abstract class MapNode extends Mesh 
{
	/**
	 * The map view object where the node is placed.
	 */
	public mapView: MapView = null;

	/**
	 * Parent node (from an upper tile level).
	 */
	public parentNode: MapNode = null;

	/**
	 * Index of the map node in the quad-tree parent node.
	 *
	 * Position in the tree parent, can be topLeft, topRight, bottomLeft or bottomRight.
	 */
	public location: number;

	/**
	 * Tile level of this node.
	 */
	public level: number;

	/**
	 * Tile x position.
	 */
	public x: number;

	/**
	 * Tile y position.
	 */
	public y: number;


	/**
	 * Variable indicating if it ready to be drawn
	 * which means it has started or loaded its texture
	 */
	public isTextureReady: boolean;

	/**
	 * Flag indicating if the tile texture was loaded (even if failed).
	 */
	public textureLoaded: boolean = false;

	/**
	 * Indicates how many children nodes where loaded.
	 */
	public nodesLoaded: number = 0;

	/**
	 * Variable to check if the node is subdivided.
	 *
	 * To avoid bad visibility changes on node load.
	 */
	public subdivided: boolean = false;

	/**
	 * Cache with the children objects created from subdivision.
	 *
	 * Used to avoid recreate object after simplification and subdivision.
	 *
	 * The default value is null.
	 */
	public childrenCache: any[] = null;

	/**
	 * Variable to check if the node is a mesh. (existing but not declared in THREE)
	 *
	 * Used to draw or not draw the node
	 */
	// @ts-ignore
	public isMesh: boolean ;

	/**
	 * Three Group used to show markers or anything related to the tile.
	 */
	public objectsHolder: THREE.Group;

	/**
	 * Base geometry is attached to the map viewer object.
	 *
	 * It should have the full size of the world so that operations over the MapView bounding box/sphere work correctly.
	 */
	public static baseGeometry: BufferGeometry = null;

	/**
	 * Base scale applied to the map viewer object.
	 */
	public static baseScale: Vector3 = null;
 
	/**
	 * How many children each branch of the tree has.
	 *
	 * For a quad-tree this value is 4.
	 */
	public static childrens: number = 4;
 
	/**
	 * Root node has no location.
	 */
	public static root: number = -1;
 
	/**
	 * Index of top left quad-tree branch node.
	 *
	 * Can be used to navigate the children array looking for neighbors.
	 */
	public static topLeft: number = 0;
 
	/**
	 * Index of top left quad-tree branch node.
	 *
	 * Can be used to navigate the children array looking for neighbors.
	 */
	public static topRight: number = 1;
 
	/**
	 * Index of top left quad-tree branch node.
	 *
	 * Can be used to navigate the children array looking for neighbors.
	 */
	public static bottomLeft: number = 2;
 
	/**
	 * Index of top left quad-tree branch node.
	 *
	 * Can be used to navigate the children array looking for neighbors.
	 */
	public static bottomRight: number = 3;


	public constructor(parentNode: MapNode = null, mapView: MapView = null, location: number = MapNode.root, level: number = 0, x: number = 0, y: number = 0, geometry: BufferGeometry = null, material: Material = null) 
	{
		super(geometry, material);

		this.mapView = mapView;
		this.parentNode = parentNode;
	
		this.location = location;
		this.level = level;
		this.x = x;
		this.y = y;
		nodesMap.set(`${level}_${x}_${y}`, this);

		const autoLoad = mapView.nodeShouldAutoLoad();

		this.isMesh = false;
		this.matrixAutoUpdate = false;
		this.isTextureReady = autoLoad;

		this.objectsHolder = new Group();
		this.objectsHolder.visible = !autoLoad;
		this.add(this.objectsHolder);
		if (autoLoad) 
		{
			this.initialize();
		}
	}


	/**
	 * Initialize resources that require access to data from the MapView.
	 *
	 * Called automatically by the constructor for child nodes and MapView when a root node is attached to it.
	 */
	public initialize(): void 
	{
	}

	public dispose(): void 
	{
		// console.log('dispose', this.level, this.x, this.y);
		this.mapView.provider.cancelTile(this.level, this.x, this.y);
		this.geometry = null;
		this.material = null;
		this.objectsHolder = null;
		this.mapView = null;
		this.parentNode = null;
		nodesMap.delete(`${this.level}_${this.x}_${this.y}`);
	}

	/**
	 * Create the child nodes to represent the next tree level.
	 *
	 * These nodes should be added to the object, and their transformations matrix should be updated.
	 */
	public createChildNodes(): void {}

	/**
	 * Subdivide node,check the maximum depth allowed for the tile provider.
	 *
	 * Uses the createChildNodes() method to actually create the child nodes that represent the next tree level.
	 */
	public subdivide(): void
	{
		const mapView = this.mapView;
		const maxZoom = Math.min(mapView.provider.actualMaxZoom, mapView.heightProvider.actualMaxZoom);
		if (this.subdivided || this.level + 1 > maxZoom) 
		{
			return;
		}

		this.subdivided = true;
		
		if (this.childrenCache !== null) 
		{
			this.childrenCache.forEach((n) => 
			{
				if (n instanceof MapNode) 
				{
					if (n.textureLoaded) 
					{
						n.show();
					}
					else 
					{
						n.hide();
					}
				}
			});
			this.children = this.childrenCache;
			if (this.nodesLoaded >= MapNode.childrens) 
			{
				this.hide();
			}
		}
		else 
		{
			this.createChildNodes();
		}
	}


	/**
	 * Simplify node, remove all children from node, store them in cache.
	 *
	 * Reset the subdivided flag and restore the visibility.
	 *
	 * This base method assumes that the node implementation is based off Mesh and that the isMesh property is used to toggle visibility.
	 */
	public simplify(distance, far): void
	{
		if (!this.subdivided) 
		{
			return;
		}
		this.subdivided = false;

		// try to find multiple rules to clean up memory
		if (this.mapView.lowMemoryUsage || distance > far/100 || this.parentNode?.subdivided && this.parentNode?.parentNode?.subdivided) 
		{
			if (this.children?.length) 
			{
				this.children.forEach((c) => {return c instanceof MapNode && clearCacheRecursive(c);});
				this.children = [];
			}
			if (this.childrenCache) 
			{
				this.childrenCache.forEach((c) => {return c instanceof MapNode && clearCacheRecursive(c);});
				this.childrenCache = null;
				this.nodesLoaded = 0;
			}
		}
		else 
		{
			this.childrenCache = this.children;
			if (this.childrenCache) 
			{
				this.childrenCache.forEach((c) => 
				{
					if (c.childrenCache && c.children.length > 1) 
					{
						c.childrenCache = null;
						c.nodesLoaded = 0;
					}
				});
			}
		}
		this.show();
		this.didSimplify();
	}

	protected didSimplify(): void
	{
		this.children = [this.objectsHolder];

	}

	public show(): void
	{
		this.isMesh = true;
		this.objectsHolder.visible = true;
	}

	public isVisible(): Boolean
	{
		return this.isMesh;
	}

	public hide(): void
	{
		this.isMesh = false;
		this.objectsHolder.visible = false;
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
	

	public setMaterialValues(values): void
	{
		// @ts-ignore
		const userData = this.material.userData;
		Object.keys(values).forEach((k) => 
		{
			// eslint-disable-next-line no-prototype-builtins
			if (userData.hasOwnProperty(k)) 
			{
				userData[k].value = values[k];
			}
		});
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
		return this.mapView.provider.fetchTile(this.level, this.x, this.y).then((image) => {return this.onTextureImage(image);}).catch(() => 
		{
			const canvas = CanvasUtils.createOffscreenCanvas(1, 1);
			const context = canvas.getContext('2d');
			context.fillStyle = '#FF0000';
			context.fillRect(0, 0, 1, 1);

			const texture = new Texture(canvas as any);
			texture.generateMipmaps = false;
			texture.needsUpdate = true;
			// @ts-ignore
			this.material.map = texture;
		}).catch((err) => 
		{
			console.error('error fetching image', err);
		}).finally(() => 
		{
			if (!this.mapView) 
			{
				return;
			}
			this.textureLoaded = true;
			this.nodeReady();
		});
	}

	/**
	 * Increment the child loaded counter.
	 *
	 * Should be called after a map node is ready for display.
	 */
	public nodeReady(): void
	{
		// Update parent nodes loaded
		if (!this.subdivided) 
		{
			this.show();
		}
		const parentNode = this.parentNode;
		if (parentNode !== null) 
		{
			parentNode.nodesLoaded++;
			if (parentNode.nodesLoaded >= MapNode.childrens) 
			{	
				parentNode.children.forEach((child, index) => 
				{
					if (child instanceof MapNode) 
					{
						if (child.subdivided) 
						{
							child.hide();
						}
						else 
						{
							child.show();
						}
					}
				});
				if (parentNode.subdivided === true) 
				{
					parentNode.hide();
				}

			}
		}
		// If its the root object just set visible
		else if (!this.subdivided)	
		{
			this.show();
		}
		this.mapView.onNodeReady(this);
	}

	/**
	 * Get all the neighbors in a specific direction (left, right, up down).
	 *
	 * @param direction - Direction to get neighbors.
	 * @returns The neighbors array, if no neighbors found returns empty.
	 */
	public getNeighborsDirection(direction: number): MapNode[] 
	{
		// TODO <ADD CODE HERE>

		return null;
	}

	/**
	 * Get all the quad tree nodes neighbors. Are considered neighbors all the nodes directly in contact with a edge of this node.
	 *
	 * @returns The neighbors array, if no neighbors found returns empty.
	 */
	public getNeighbors(): MapNode[] 
	{
		const neighbors = [];

		// TODO <ADD CODE HERE>

		return neighbors;
	}
}
