import {Frustum, Matrix4, Vector3} from 'three';
import {MapNode} from '../nodes/MapNode';
import {MapHeightNode} from '../nodes/MapHeightNode';
import {MapView} from '../MapView';

import {LODControl} from './LODControl';

const projection = new Matrix4();
const pov = new Vector3();
const frustum = new Frustum();
const position = new Vector3();

/**
 * Check the planar distance between the nodes center and the view position.
 *
 * Only subdivides elements inside of the camera frustum.
 */
export class LODFrustum implements LODControl 
{
	/**
	* Distance to subdivide the tiles.
	*/
	public subdivideDistance: number = 120;

	/**
	* Distance to simplify the tiles.
	*/
	public simplifyDistance: number = 400;

	/**
	* If true only the central point of the plane geometry will be used
	*
	* Otherwise the object bouding sphere will be tested, providing better results for nodes on frustum edge but will lower performance.
	*/
	public testCenter: boolean = true;

	/**
	* If set true only the center point of the object is considered. 
	* 
	* Otherwise the full bouding box of the objects are considered.
	*/
	public pointOnly: boolean = false;

	// private nodeMap = new Map<String, MapNode>();

	protected isChildReady(node: MapNode): boolean
	{
		
		return node.isTextureReady && (!(node instanceof MapHeightNode) || node.isHeightReady);
	}

	protected handleNode(node, handled: Set<MapNode>, camera, minZoom, maxZoom, inFrustum = false, canSubdivide = true, canSimplify = true): void
	{
		if (!(node instanceof MapNode) || handled.has(node)) 
		{
			return;
		}
		if (!node.mapView) 
		{
			return;
		}
		handled.add(node);
		node.getWorldPosition(position);
		var worldDistance = pov.distanceTo(position);
		const distance = worldDistance / Math.pow(2, 20 - node.level);
		
		inFrustum = inFrustum || (this.pointOnly ? frustum.containsPoint(position) : frustum.intersectsObject(node));

		if (canSubdivide && (maxZoom > node.level && distance < this.subdivideDistance) && inFrustum)
		{
			node.subdivide();
			const children = node.children;
			if (children) 
			{
				for (let index = 0; index < children.length; index++) 
				{
					const n = children[index];
					if (n instanceof MapNode) 
					{
						this.handleNode(n, handled, camera, minZoom, maxZoom, false, true, false);
					}
				}
			}
			node.hide();
		}
		else if (canSimplify && (node.level > maxZoom || (!inFrustum || minZoom < node.level )&& distance > this.simplifyDistance) && node.parentNode)
		{
			const parentNode = node.parentNode;
			parentNode.simplify(distance, camera.far);
			this.handleNode(parentNode, handled, camera, minZoom, maxZoom, false, false, true);
		}
		else if ((!canSimplify && !canSubdivide || inFrustum || distance < this.simplifyDistance) && minZoom <= node.level && worldDistance < camera.far)
		{
			if (!this.isChildReady(node))
			{
				node.initialize();
			}
		}
	}

	private toHandle = new Set<MapNode>();

	public getChildrenToTraverse(parent): Set<MapNode>
	{
		const toHandle = this.toHandle;
		toHandle.clear();
		function handleChild(child): void 
		{
			if (child instanceof MapNode && !child.subdivided) 
			{
				toHandle.add(child);
			}
			else 
			{
				child.children.forEach((c) => 
				{
					if (child instanceof MapNode) 
					{
						handleChild(c);
					}
				});
			}
		}
		handleChild(parent);
		return toHandle;
	}

	private lastMatrix: Matrix4

	private handled = new Set<MapNode>();

	public updateLOD(view: MapView, camera, renderer, scene, force = false): void
	{
		if (!force && this.lastMatrix && this.lastMatrix.equals(camera.matrixWorldInverse) ) 
		{
			return;
		}
		if (!this.lastMatrix) 
		{
			this.lastMatrix = new Matrix4();
		}
		this.lastMatrix.copy(camera.matrixWorldInverse);
		projection.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
		frustum.setFromProjectionMatrix(projection);
		
		camera.getWorldPosition(pov);
		const minZoom = view.provider.minZoom;
		const maxZoom = view.provider.maxZoom + view.provider.maxOverZoom;

		const toHandle = this.getChildrenToTraverse(view.children[0]);
		let handled = this.handled;
		toHandle.forEach( (node) => {return this.handleNode(node, handled, camera, minZoom, maxZoom);});
		handled.clear();
	}
}
