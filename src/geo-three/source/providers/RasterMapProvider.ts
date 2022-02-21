import {CancelablePromise} from '../utils/CancelablePromise';
import {CanvasUtils} from '../utils/CanvasUtils';
import {getSharedImageBitmapLoader, ImageBitmapLoader} from '../utils/FetchLoader';
import {MapProvider} from './MapProvider';
import {getChildren, pointToTile, tileToBBOX} from '@mapbox/tilebelt';

const imageBitmapLoader = getSharedImageBitmapLoader({imageOrientation: 'flipY', fetchOptions: {credentials: 'same-origin'}});

function zoomTiles(zoomedTiles, zoom): any[]
{
	if (zoomedTiles[0][2] === zoom)
	{
		return zoomedTiles;
	}
	else if (zoomedTiles[0][2] < zoom)
	{
		var oneIn = [];
		zoomedTiles.forEach(function(tile)
		{
			oneIn = oneIn.concat(getChildren(tile));
		});
		return zoomTiles(oneIn, zoom);
	}
	else 
	{
		var zoomedTiles = zoomedTiles.map(function(tile)
		{
			const bbox = tileToBBOX(tile);
			return pointToTile(
				bbox[0] + (bbox[2] - bbox[0])/2,
				bbox[1] + (bbox[3] - bbox[1])/2, zoom);
		});
		return zoomedTiles;
	}
}
function tilesToZoom(tiles, zoom): any[]
{
	var newTiles = zoomTiles(tiles, zoom);
	return newTiles;
}

export default abstract class RasterMapProvider extends MapProvider 
{
	public address: string;

	public constructor(address?: string)
	{
		super();
		this.address = address;
	}

	public abstract buildURL(zoom: number, x: number, y: number): string;

	// protected tilesAbortControllers: {[k: string]: AbortController} = {}

	protected getImageBitmapLoader(): ImageBitmapLoader 
	{
		return imageBitmapLoader;
	}

	protected async fetchTileImage(zoom: number, x: number, y: number): Promise<any>
	{
		const key =`${zoom}_${x}_${y}`;
		let promise;
		if (this.zoomDelta <= 0 || this.minLevelForZoomDelta > zoom) 
		{
			promise = this.fetchingTilesPromises[key] = this.fetchImage(zoom, x, y);
		}
		else 
		{
			const tiles = tilesToZoom([[x, y, zoom]], zoom + this.zoomDelta).sort(
				(valA, valB) => 
				{
					return valB[1] - valA[1] || 
					valA[0] - valB[0];
				},
			);
			let promises: CancelablePromise<ImageBitmap>[];
			promise = new CancelablePromise((resolve, reject) => 
			{
				Promise.all(promises = tiles.map((t) => {return this.fetchImage(t[2], t[0], t[1]);})).then(
					(images: ImageBitmap[]) =>
					{
						try 
						{
							promises = null;
							images = images.filter((i) => {return Boolean(i);});
							if (!images || !images.length) 
							{
								return resolve(null);
							}
							const width = images[0].width * Math.floor(this.zoomDelta * 2);
							const fullWidth = width / Math.sqrt(images.length);
							const canvas: HTMLCanvasElement = CanvasUtils.createOffscreenCanvas(width, width) as any;
							var context = canvas.getContext('2d');
							let tileY = tiles[0][1];
							let ix = 0;
							let iy = 0;
							//   context.strokeStyle = '#FF0000';
							let x, y;
							images.forEach((image, index) => 
							{
								if (tileY !==tiles[index][1]) 
								{
									tileY = tiles[index][1];
									ix = 0;
									iy += 1;
								}
								x = ix * fullWidth;
								y = iy * fullWidth;
								context.save();
								context.drawImage(image, x, y, fullWidth, fullWidth);
								context.restore();
								ix += 1;
							});
							resolve(createImageBitmap(canvas));
						}
						catch (error) 
						{
							reject(error);
						}
					}
				).catch(function(err)
				{
					promises = null;
					reject(err);
				});
				
			}, function()
			{
				if (promises) 
				{
					promises.forEach((item) => {return item.cancel();});
					promises = null;
				}
				return true;
			});
			
		}
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

	public fetchImage(zoom: number, x: number, y: number): CancelablePromise<ImageBitmap>
	{
		const url = this.buildURL(zoom, x, y);
		return new CancelablePromise<any>(async(resolve, reject) => 
		{	
			try 
			{
				const result = await this.getImageBitmapLoader().load(url);
				resolve(result);
			}
			catch (err) 
			{
				console.log('catched error', err);
				// mostly cancelled request!
				reject(err);
			}
		}, () => 
		{
			this.getImageBitmapLoader().cancel(url);
			return true;
		});
	}

}
