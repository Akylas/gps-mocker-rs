import {MapProvider} from '../source/providers/MapProvider';

export class EmptyProvider extends MapProvider 
{
	public constructor() 
	{
		super();
		this.name = 'local';
		this.minZoom = 0;
		this.maxZoom = 20;
	}

	public fetchTile(zoom, x, y): Promise<any>
	{
		return Promise.resolve(null);
	}

	public cancelTile(zoom: number, x: number, y: number): void 
	{
		
	}
}
