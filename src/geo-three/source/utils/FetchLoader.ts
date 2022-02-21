import Queue from '@akylas/load-queue';
class LruCache<T> 
{
	private values: Map<string, T> = new Map<string, T>();

	private maxEntries: number = 20;
  
	public get(key: string): T 
	{
		const hasKey = this.values.has(key);
		let entry: T;
		if (hasKey) 
		{
			// peek the entry, re-insert for LRU strategy
			entry = this.values.get(key);
			this.values.delete(key);
			this.values.set(key, entry);
		}
  
		return entry;
	}
  
	public put(key: string, value: T): void
	{
		if (this.values.size >= this.maxEntries) 
		{
			// least-recently used cache eviction strategy
			const keyToDelete = this.values.keys().next().value;
  
			this.values.delete(keyToDelete);
		}
  
		this.values.set(key, value);
	}
  
}

class TaskLoader 
{
	private abortController = new AbortController();

	private url: string;

	public constructor(entry, success, failure) 
	{
		this.load(entry, success, failure);
		this.url = entry.url;
	}

	private async load(entry, success, failure): Promise<any>
	{
		try 
		{
			const options = runningFetchOptions[entry.url];
			const fetchOptions = options.fetchOptions;
			fetchOptions.signal = this.abortController.signal;
			const res = await fetch( entry.url, fetchOptions );
			let result;
			switch (fetchOptions?.output || 'arraybuffer') 
			{
			case 'json' :
				result = await res.json();
				break;
			case 'blob' :
				result = await res.blob();
				break;
			case 'text' :
				result = await res.text();
				break;
			case 'imageBitmap' : {
				const blob = await res.blob();
				result = await createImageBitmap( blob, options as any );
				break;
			}
			default:
				result = await res.arrayBuffer();
				break;
			}
			success(result);
			delete runningFetchOptions[entry.url];
		}
		catch (err) 
		{
			failure(err);
			delete runningFetchOptions[entry.url];
		}
	}

	public cancel(): void
	{
		// console.log('cancel', this.url);
		this.abortController.abort();
	}
}

type FetchOptions = RequestInit & {output?: 'json' | 'arraybuffer' | 'blob' | 'text' | 'imageBitmap'}
type FetchLoaderOptions = {
	[k: string]: any
	fetchOptions?: FetchOptions
}
const runningFetchOptions: {[k: string]: {
	[k: string]: any
    fetchOptions?: FetchOptions;
}} = {};
const queue = new Queue(TaskLoader, 50);

export class FetchLoader
{
	public options: FetchLoaderOptions;

	public cache: LruCache<any>;

	public constructor(options: FetchLoaderOptions = {}) 
	{
		this.cache = new LruCache();
		this.options = options;
	}


	public async load<T = ArrayBuffer>( url, requestOptions?: FetchOptions ): Promise<T>  
	{
		if ( url === undefined ) {url = '';}

		const cached = this.cache.get( url );

		if ( cached !== undefined ) 
		{
			return cached;
		}
		const options = {...this.options};
		options.fetchOptions = {...options.fetchOptions || {}, ...requestOptions || {}};
		runningFetchOptions[url] = options;
		return new Promise<T>((resolve, reject) => 
		{
			queue.add(url, function(resUrl, res)
			{
				if (res instanceof Error) 
				{
					reject(res);
				}
				else 
				{
					resolve(res);
				}
			}, reject);

		}).then((res) => 
		{
			if (res) 
			{
				this.cache.put( url, res );
			}
			return res;
		});
	}

	public cancel(url: string): void
	{
		queue.cancel(url);
	}
}

export class ImageBitmapLoader extends FetchLoader
{
	declare public cache: LruCache<ImageBitmap>;

	public constructor(options ={}) 
	{
		super ({premultiplyAlpha: 'none', colorSpaceConversion: 'none', ...options});
		this.options.fetchOptions = this.options.fetchOptions || {};
		if (!this.options.fetchOptions.output) 
		{
			this.options.fetchOptions.output = 'imageBitmap';
		}
	}

}


let bitmapLoaders: {[k: string]: ImageBitmapLoader} = {};
let fetchLoaders: {[k: string]: FetchLoader} = {};
export function getSharedImageBitmapLoader(options?: {[k: string]: any}): ImageBitmapLoader 
{	
	const key= JSON.stringify(options || {});
	if (!bitmapLoaders[key]) 
	{
		bitmapLoaders[key] = new ImageBitmapLoader(options);
	}
	return bitmapLoaders[key];
}
export function getSharedFetchLoader(options?: {[k: string]: any}): FetchLoader 
{
	const key= JSON.stringify(options || {});
	if (!fetchLoaders[key]) 
	{
		fetchLoaders[key] = new FetchLoader(options);
	}
	return fetchLoaders[key];
}
