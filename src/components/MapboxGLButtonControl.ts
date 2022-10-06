export default class MapboxGLButtonControl {
    _className;
    _title;
    _eventHandler;
    _btn: HTMLButtonElement;
    _icon;
    _container;
    _map;
    constructor({ className = '', title = '', eventHandler, icon = null }) {
        this._className = className;
        this._title = title;
        this._icon = icon;
        this._eventHandler = eventHandler;
    }

    onAdd(map) {
        this._btn = document.createElement('button');
        this._btn.className = 'maplibregl-ctrl-icon' + ' ' + this._className;

        this._btn.type = 'button';
        this._btn.title = this._title;
        this._btn.onclick = this._eventHandler;
        if (this._icon) {
            this._btn.appendChild(this._icon);
        } else {
            this._icon = document.createElement('span');
            this._icon.className = 'maplibregl-ctrl-icon';
            this._icon.setAttribute('aria-hidden', 'true');
            this._btn.appendChild(this._icon);
        }

        this._container = document.createElement('div');
        this._container.className = 'maplibregl-ctrl maplibregl-ctrl-group';
        this._container.appendChild(this._btn);

        return this._container;
    }

    onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
    }
}
