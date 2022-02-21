import {locahostServer} from './LocalHeightProvider';
import {OpenStreetMapsProvider} from '../source/providers/OpenStreetMapsProvider';
import { getSharedImageBitmapLoader, ImageBitmapLoader } from '../source/utils/FetchLoader';
import {settings} from './settings';


export default class TestMapProvider extends OpenStreetMapsProvider 
{
	imageBitmapLoader = getSharedImageBitmapLoader({imageOrientation: settings.flipRasterImages ? 'flipY': undefined, fetchOptions: {credentials: 'same-origin'}});
	public constructor(local = false)
	{
		super(local? `https://${locahostServer}/styles/terrain_no_label/`: 'https://a.tile.openstreetmap.org/');
	}

	protected getImageBitmapLoader(): ImageBitmapLoader 
	{
		return this.imageBitmapLoader;
	}
}
