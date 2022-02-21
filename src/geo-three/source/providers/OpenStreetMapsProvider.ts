import RasterMapProvider from './RasterMapProvider';


/**
 * Open street maps tile server.
 *
 * Works with any service that uses a address/zoom/x/y.format URL for tile access.
 */
export class OpenStreetMapsProvider extends RasterMapProvider 
{

	/**
	* Map image tile format.
	*/
	public format: string;

	public constructor(address: string = 'https://a.tile.openstreetmap.org/')
	{
		super(address);
		this.format = 'png';
	}

	public buildURL(zoom, x, y): string
	{
		return this.address + zoom + '/' + x + '/' + y + '.' + this.format;
	}
}
