import {getChildren, pointToTile, tileToBBOX} from '@mapbox/tilebelt';
import {CancelablePromise} from '../utils/CancelablePromise';
import {CanvasUtils} from '../utils/CanvasUtils';


/**
 * A map provider is a object that handles the access to map tiles of a specific service.
 *
 * They contain the access configuration and are responsible for handling the map theme size etc.
 *
 * MapProvider should be used as a base for all the providers.
 */
export abstract class MapProvider 
{
	/**
	 * Name of the map provider
	 */
	public name: string = '';

	/**
	 * Minimum tile level.
	 */
	public minZoom: number = 0;

	/**
	 * Maximum tile level.
	 */
	public maxZoom: number = 20;

	/**
	 * Allowed overMaxZoom.
	 */
	public maxOverZoom: number = 0;

	/**
	 * factor used to create bitmaps based on higher zooms
	 */
	public zoomDelta: number = 0;

	/**
	 * When to start using zoomDelta
	 */
	public minLevelForZoomDelta: number = 0;

	public get actualMaxZoom(): number 
	{
		return this.maxZoom + this.maxOverZoom;
	}


	/**
	 * Map bounds.
	 */
	public bounds: number[] = [];

	/**
	 * Map center point.
	 */
	public center: number[] = [];

	/**
	 * Get a tile for the x, y, zoom based on the provider configuration.
	 *
	 * The tile should be returned as a image object, compatible with canvas context 2D drawImage() and with webgl texImage2D() method.
	 *
	 * @param zoom - Zoom level.
	 * @param x - Tile x.
	 * @param y - Tile y.
	 * @returns Promise with the image obtained for the tile ready to use.
	 */
	public fetchImage(zoom: number, x: number, y: number): CancelablePromise<any> 
	{
		return null;
	}

	/**
	 * Get map meta data from server if supported.
	 *
	 * Usually map server have API method to retrieve TileJSON metadata.
	 */
	public getMetaData(): void {}

	protected fetchingTilesPromises = new Map<string, CancelablePromise<any>>();

	protected async fetchTileImage(zoom: number, x: number, y: number): Promise<any>
	{
		const key =`${zoom}_${x}_${y}`;
		const promise = this.fetchingTilesPromises[key] = this.fetchImage(zoom, x, y);
		this.fetchingTilesPromises[key] = promise;
		try 
		{
			return await promise;
		}
		finally 
		{
			delete this.fetchingTilesPromises[key];
		}
	}

	public cancelTile(zoom: number, x: number, y: number): void
	{
		const key =`${zoom}_${x}_${y}`;
		const promise = this.fetchingTilesPromises[key];
		// console.log('cancelTilePromise', key, Boolean(promise));
		if (promise) 
		{
			promise.cancel();
			delete this.fetchingTilesPromises[key];
		}
	}

	public async fetchTile(zoom: number, x: number, y: number): Promise<any>
	{
		return this.fetchTileImage(zoom, x, y);
	}
	
}
