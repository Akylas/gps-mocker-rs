import RasterMapProvider from './RasterMapProvider';


/**
 * Map tiler provider API.
 *
 * The map tiler server is based on open map tiles.
 *
 * API Reference
 *  - https://www.maptiler.com/
 */
export class MapTilerProvider extends RasterMapProvider 
{
	/**
	 * Server API access token.
	 */
	public apiKey: string;

	/**
	 * Map image tile file format (e.g png, jpg)
	 *
	 * Format can be for image or for geometry fetched from the system (e.g quantized-mesh-1.0)
	 */
	public format: string;

	/**
	 * Tile category (e.g. maps, tiles),
	 */
	public category: string;

	/**
	 * Map tile type, some of the vectorial styles available.
	 *
	 * Can be used for rasterized vectorial maps (e.g, basic, bright, darkmatter, hybrid, positron, streets, topo, voyager).
	 *
	 * Cam be used for data tiles (e.g hillshades, terrain-rgb, satellite).
	 */
	public style: string;

	public resolution: number;

	public constructor(apiKey, category, style, format) 
	{
		super('https://api.maptiler.com/');

		this.apiKey = apiKey !== undefined ? apiKey : '';

		this.format = format !== undefined ? format : 'png';

		this.category = category !== undefined ? category : 'maps';

		this.style = style !== undefined ? style : 'satellite';

		this.resolution = 512;
	}

	public buildURL(zoom, x, y): string
	{
		return this.address + this.category + '/' + this.style + '/' + zoom + '/' + x + '/' + y + '.' + this.format + '?key=' + this.apiKey;
	}
}
