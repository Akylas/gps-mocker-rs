import { FitBoundsOptions, IControl, LngLat, Map, Marker } from 'maplibre-gl';
import DOM from 'maplibre-gl/src/util/dom';
import { Event, Evented } from 'maplibre-gl/src/util/evented';
import { bindAll, extend, warnOnce } from 'maplibre-gl/src/util/util';

type GeolocateOptions = {
    fitBoundsOptions?: FitBoundsOptions;
    trackUserLocation?: boolean;
    showAccuracyCircle?: boolean;
    showUserLocation?: boolean;
};

interface Position {
    lat: number;
    lon: number;
    altitude?: number;
    accuracy?: number;
}

const defaultOptions: GeolocateOptions = {
    fitBoundsOptions: {
        maxZoom: 15
    },
    trackUserLocation: false,
    showAccuracyCircle: true,
    showUserLocation: true
};

let supportsGeolocation;

function checkGeolocationSupport(callback) {
    if (supportsGeolocation !== undefined) {
        callback(supportsGeolocation);
    } else if (window.navigator.permissions !== undefined) {
        // navigator.permissions has incomplete browser support
        // http://caniuse.com/#feat=permissions-api
        // Test for the case where a browser disables Geolocation because of an
        // insecure origin
        window.navigator.permissions.query({ name: 'geolocation' }).then((p) => {
            supportsGeolocation = p.state !== 'denied';
            callback(supportsGeolocation);
        });
    } else {
        supportsGeolocation = !!window.navigator.geolocation;
        callback(supportsGeolocation);
    }
}

/**
 * A `GeolocateControl` control provides a button that uses the browser's geolocation
 * API to locate the user on the map.
 *
 * Not all browsers support geolocation,
 * and some users may disable the feature. Geolocation support for modern
 * browsers including Chrome requires sites to be served over HTTPS. If
 * geolocation support is not available, the GeolocateControl will show
 * as disabled.
 *
 * The zoom level applied will depend on the accuracy of the geolocation provided by the device.
 *
 * The GeolocateControl has two modes. If `trackUserLocation` is `false` (default) the control acts as a button, which when pressed will set the map's camera to target the user location. If the user moves, the map won't update. This is most suited for the desktop. If `trackUserLocation` is `true` the control acts as a toggle button that when active the user's location is actively monitored for changes. In this mode the GeolocateControl has three interaction states:
 * * active - the map's camera automatically updates as the user's location changes, keeping the location dot in the center. Initial state and upon clicking the `GeolocateControl` button.
 * * passive - the user's location dot automatically updates, but the map's camera does not. Occurs upon the user initiating a map movement.
 * * disabled - occurs if Geolocation is not available, disabled or denied.
 *
 * These interaction states can't be controlled programmatically, rather they are set based on user interactions.
 *
 * @implements {IControl}
 * @param {Object} [options]
 * @param {Object} [options.positionOptions={enableHighAccuracy: false, timeout: 6000}] A Geolocation API [PositionOptions](https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions) object.
 * @param {Object} [options.fitBoundsOptions={maxZoom: 15}] A {@link Map#fitBounds} options object to use when the map is panned and zoomed to the user's location. The default is to use a `maxZoom` of 15 to limit how far the map will zoom in for very accurate locations.
 * @param {Object} [options.trackUserLocation=false] If `true` the Geolocate Control becomes a toggle button and when active the map will receive updates to the user's location as it changes.
 * @param {Object} [options.showAccuracyCircle=true] By default, if showUserLocation is `true`, a transparent circle will be drawn around the user location indicating the accuracy (95% confidence level) of the user's location. Set to `false` to disable. Always disabled when showUserLocation is `false`.
 * @param {Object} [options.showUserLocation=true] By default a dot will be shown on the map at the user's location. Set to `false` to disable.
 *
 * @example
 * map.addControl(new maplibregl.GeolocateControl({
 *     positionOptions: {
 *         enableHighAccuracy: true
 *     },
 *     trackUserLocation: true
 * }));
 * @see [Locate the user](https://maplibre.org/maplibre-gl-js-docs/example/locate-user/)
 */
export default class UserLocationControl extends Evented implements IControl {
    _map: Map;
    options: GeolocateOptions;
    _container: HTMLElement;
    _dotElement: HTMLElement;
    _circleElement: HTMLElement;
    _watchState: 'OFF' | 'ACTIVE_LOCK' | 'WAITING_ACTIVE' | 'BACKGROUND';
    _lastKnownPosition: any;
    _userLocationDotMarker: Marker;
    _accuracyCircleMarker: Marker;
    _accuracy: number;
    _setup: boolean; // set to true once the control has been setup

    constructor(options: GeolocateOptions = {}) {
        super();
        this.options = extend({}, defaultOptions, options);

        bindAll(['_onSuccess', '_onError', '_onZoom', '_finish', '_setupUI', '_updateCamera', '_updateMarker'], this);
    }

    onAdd(map: Map) {
        this._map = map;
        this._container = DOM.create('div', 'maplibregl-ctrl maplibregl-ctrl-group mapboxgl-ctrl mapboxgl-ctrl-group');
        checkGeolocationSupport(this._setupUI);
        return this._container;
    }

    onRemove() {
        // clear the markers from the map
        if (this.options.showUserLocation && this._userLocationDotMarker) {
            this._userLocationDotMarker.remove();
        }
        if (this.options.showAccuracyCircle && this._accuracyCircleMarker) {
            this._accuracyCircleMarker.remove();
        }

        DOM.remove(this._container);
        this._map.off('zoom', this._onZoom);
        this._map = undefined;
    }

    /**
     * Check if the Geolocation API Position is outside the map's maxbounds.
     *
     * @param {Position} position the Geolocation API Position
     * @returns {boolean} Returns `true` if position is outside the map's maxbounds, otherwise returns `false`.
     * @private
     */
    _isOutOfMapMaxBounds(position: Position) {
        const bounds = this._map.getMaxBounds();

        return bounds && (position.lon < bounds.getWest() || position.lon > bounds.getEast() || position.lat < bounds.getSouth() || position.lat > bounds.getNorth());
    }

    get currentPosition() {
        return this._lastKnownPosition;
    }

    /**
     * When the Geolocation API returns a new location, update the GeolocateControl.
     *
     * @param {Position} position the Geolocation API Position
     * @private
     */
    updatePosition(position: Position, forceCenter = false) {
        // console.log('updatePosition', position);
        if (!this._map) {
            // control has since been removed
            return;
        }
        if (this._isOutOfMapMaxBounds(position)) {
            this.fire(new Event('outofmaxbounds', position));
            this._updateMarker();
            return;
        }

        // if (this.options.trackUserLocation) {
        // keep a record of the position so that if the state is BACKGROUND and the user
        // clicks the button, we can move to ACTIVE_LOCK immediately without waiting for
        // watchPosition to trigger _onSuccess
        this._lastKnownPosition = position;
        // }

        // if showUserLocation and the watch state isn't off then update the marker location
        if (this.options.showUserLocation) {
            this._updateMarker(position);
        }

        // if in normal mode (not watch mode), or if in watch mode and the state is active watch
        // then update the camera
        if (forceCenter || !this.options.trackUserLocation) {
            this._updateCamera(position);
        } else {
            const bounds = this._map.getBounds();
            if (!bounds.contains(position)) {
                this._updateCamera(position);
            }
        }
        if (this.options.showUserLocation) {
            this._dotElement.classList.remove('maplibregl-user-location-dot-stale', 'mapboxgl-user-location-dot-stale');
        }

        this.fire(new Event('geolocate', position));
    }

    centerOnLocation() {
        this._updateCamera(this._lastKnownPosition);
    }

    /**
     * Update the camera location to center on the current position
     *
     * @param {Position} position the Geolocation API Position
     * @private
     */
    _updateCamera(position: Position) {
        const center = new LngLat(position.lon, position.lat);
        const radius = position.accuracy;
        const bearing = this._map.getBearing();
        const options = extend({ bearing }, this.options.fitBoundsOptions);

        this._map.fitBounds(center.toBounds(radius), options, {
            geolocateSource: true // tag this camera change so it won't cause the control to change to background state
        });
    }

    /**
     * Update the user location dot Marker to the current position
     *
     * @param {Position} [position] the Geolocation API Position
     * @private
     */
    _updateMarker(position?: Position | null) {
        if (position) {
            const center = new LngLat(position.lon, position.lat);
            this._accuracyCircleMarker.setLngLat(center).addTo(this._map);
            this._userLocationDotMarker.setLngLat(center).addTo(this._map);
            this._accuracy = position.accuracy || 0;
            if (this.options.showUserLocation && this.options.showAccuracyCircle) {
                this._updateCircleRadius();
            }
        } else {
            this._userLocationDotMarker.remove();
            this._accuracyCircleMarker.remove();
        }
    }

    _updateCircleRadius() {
        const y = this._map._container.clientHeight / 2;
        const a = this._map.unproject([0, y]);
        const b = this._map.unproject([1, y]);
        const metersPerPixel = a.distanceTo(b);
        const circleDiameter = Math.ceil((2.0 * this._accuracy) / metersPerPixel);
        this._circleElement.style.width = `${circleDiameter}px`;
        this._circleElement.style.height = `${circleDiameter}px`;
    }

    _onZoom() {
        if (this.options.showUserLocation && this.options.showAccuracyCircle) {
            this._updateCircleRadius();
        }
    }

    _setupUI() {
        this._container.addEventListener('contextmenu', (e: MouseEvent) => e.preventDefault());

        if (this.options.trackUserLocation) {
            this._watchState = 'OFF';
        }

        // when showUserLocation is enabled, keep the Geolocate button disabled until the device location marker is setup on the map
        if (this.options.showUserLocation) {
            this._dotElement = DOM.create('div', 'maplibregl-user-location-dot mapboxgl-user-location-dot');

            this._userLocationDotMarker = new Marker({ element: this._dotElement, pitchAlignment: 'map' });

            this._circleElement = DOM.create('div', 'maplibregl-user-location-accuracy-circle mapboxgl-user-location-accuracy-circle');
            this._accuracyCircleMarker = new Marker({ element: this._circleElement, pitchAlignment: 'map' });

            if (this.options.trackUserLocation) this._watchState = 'OFF';

            this._map.on('zoom', this._onZoom);
        }

        this._setup = true;

        // when the camera is changed (and it's not as a result of the Geolocation Control) change
        // the watch mode to background watch, so that the marker is updated but not the camera.
        if (this.options.trackUserLocation) {
            this._map.on('movestart', (event: any) => {
                const fromResize = event.originalEvent && event.originalEvent.type === 'resize';
                if (!event.geolocateSource && this._watchState === 'ACTIVE_LOCK' && !fromResize) {
                    this._watchState = 'BACKGROUND';
                    this.fire(new Event('trackuserlocationend'));
                }
            });
        }
    }

    /**
     * Programmatically request and move the map to the user's location.
     *
     * @returns {boolean} Returns `false` if called before control was added to a map, otherwise returns `true`.
     * @example
     * // Initialize the geolocate control.
     * var geolocate = new maplibregl.GeolocateControl({
     *  positionOptions: {
     *    enableHighAccuracy: true
     *  },
     *  trackUserLocation: true
     * });
     * // Add the control to the map.
     * map.addControl(geolocate);
     * map.on('load', function() {
     *   geolocate.trigger();
     * });
     */
    trigger() {
        if (!this._setup) {
            warnOnce('Geolocate control triggered before added to a map');
            return false;
        }
        if (this.options.trackUserLocation) {
            // update watchState and do any outgoing state cleanup
            switch (this._watchState) {
                case 'OFF':
                    // turn on the Geolocate Control
                    this._watchState = 'WAITING_ACTIVE';

                    this.fire(new Event('trackuserlocationstart'));
                    break;
                case 'WAITING_ACTIVE':
                case 'ACTIVE_LOCK':
                    // turn off the Geolocate Control
                    this._watchState = 'OFF';
                    this.fire(new Event('trackuserlocationend'));
                    break;
                case 'BACKGROUND':
                    this._watchState = 'ACTIVE_LOCK';
                    // set camera to last known location
                    if (this._lastKnownPosition) this._updateCamera(this._lastKnownPosition);

                    this.fire(new Event('trackuserlocationstart'));
                    break;
            }

            // manage geolocation.watchPosition / geolocation.clearWatch
            if (this._watchState === 'OFF') {
                // clear watchPosition as we've changed to an OFF state
                this._clearWatch();
            }
        }

        return true;
    }

    _clearWatch() {
        if (this.options.showUserLocation) {
            this._updateMarker(null);
        }
    }
}

/* Geolocate Control Watch States
 * This is the private state of the control.
 *
 * OFF
 *    off/inactive
 * WAITING_ACTIVE
 *    Geolocate Control was clicked but still waiting for Geolocation API response with user location
 * ACTIVE_LOCK
 *    Showing the user location as a dot AND tracking the camera to be fixed to their location. If their location changes the map moves to follow.
 * ACTIVE_ERROR
 *    There was en error from the Geolocation API while trying to show and track the user location.
 * BACKGROUND
 *    Showing the user location as a dot but the camera doesn't follow their location as it changes.
 * BACKGROUND_ERROR
 *    There was an error from the Geolocation API while trying to show (but not track) the user location.
 */

/**
 * Fired on each Geolocation API position update which returned as success.
 *
 * @event geolocate
 * @memberof GeolocateControl
 * @instance
 * @property {Position} data The returned [Position](https://developer.mozilla.org/en-US/docs/Web/API/Position) object from the callback in [Geolocation.getCurrentPosition()](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition) or [Geolocation.watchPosition()](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/watchPosition).
 * @example
 * // Initialize the geolocate control.
 * var geolocate = new maplibregl.GeolocateControl({
 *   positionOptions: {
 *       enableHighAccuracy: true
 *   },
 *   trackUserLocation: true
 * });
 * // Add the control to the map.
 * map.addControl(geolocate);
 * // Set an event listener that fires
 * // when a geolocate event occurs.
 * geolocate.on('geolocate', function() {
 *   console.log('A geolocate event has occurred.')
 * });
 *
 */

/**
 * Fired on each Geolocation API position update which returned as an error.
 *
 * @event error
 * @memberof GeolocateControl
 * @instance
 * @property {PositionError} data The returned [PositionError](https://developer.mozilla.org/en-US/docs/Web/API/PositionError) object from the callback in [Geolocation.getCurrentPosition()](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition) or [Geolocation.watchPosition()](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/watchPosition).
 * @example
 * // Initialize the geolocate control.
 * var geolocate = new maplibregl.GeolocateControl({
 *   positionOptions: {
 *       enableHighAccuracy: true
 *   },
 *   trackUserLocation: true
 * });
 * // Add the control to the map.
 * map.addControl(geolocate);
 * // Set an event listener that fires
 * // when an error event occurs.
 * geolocate.on('error', function() {
 *   console.log('An error event has occurred.')
 * });
 *
 */

/**
 * Fired on each Geolocation API position update which returned as success but user position is out of map maxBounds.
 *
 * @event outofmaxbounds
 * @memberof GeolocateControl
 * @instance
 * @property {Position} data The returned [Position](https://developer.mozilla.org/en-US/docs/Web/API/Position) object from the callback in [Geolocation.getCurrentPosition()](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition) or [Geolocation.watchPosition()](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/watchPosition).
 * @example
 * // Initialize the geolocate control.
 * var geolocate = new maplibregl.GeolocateControl({
 *   positionOptions: {
 *       enableHighAccuracy: true
 *   },
 *   trackUserLocation: true
 * });
 * // Add the control to the map.
 * map.addControl(geolocate);
 * // Set an event listener that fires
 * // when an outofmaxbounds event occurs.
 * geolocate.on('outofmaxbounds', function() {
 *   console.log('An outofmaxbounds event has occurred.')
 * });
 *
 */

/**
 * Fired when the Geolocate Control changes to the active lock state, which happens either upon first obtaining a successful Geolocation API position for the user (a geolocate event will follow), or the user clicks the geolocate button when in the background state which uses the last known position to recenter the map and enter active lock state (no geolocate event will follow unless the users's location changes).
 *
 * @event trackuserlocationstart
 * @memberof GeolocateControl
 * @instance
 * @example
 * // Initialize the geolocate control.
 * var geolocate = new maplibregl.GeolocateControl({
 *   positionOptions: {
 *       enableHighAccuracy: true
 *   },
 *   trackUserLocation: true
 * });
 * // Add the control to the map.
 * map.addControl(geolocate);
 * // Set an event listener that fires
 * // when a trackuserlocationstart event occurs.
 * geolocate.on('trackuserlocationstart', function() {
 *   console.log('A trackuserlocationstart event has occurred.')
 * });
 *
 */

/**
 * Fired when the Geolocate Control changes to the background state, which happens when a user changes the camera during an active position lock. This only applies when trackUserLocation is true. In the background state, the dot on the map will update with location updates but the camera will not.
 *
 * @event trackuserlocationend
 * @memberof GeolocateControl
 * @instance
 * @example
 * // Initialize the geolocate control.
 * var geolocate = new maplibregl.GeolocateControl({
 *   positionOptions: {
 *       enableHighAccuracy: true
 *   },
 *   trackUserLocation: true
 * });
 * // Add the control to the map.
 * map.addControl(geolocate);
 * // Set an event listener that fires
 * // when a trackuserlocationend event occurs.
 * geolocate.on('trackuserlocationend', function() {
 *   console.log('A trackuserlocationend event has occurred.')
 * });
 *
 */
