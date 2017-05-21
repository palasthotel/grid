
export default class HandlerBase{
	constructor(getState, setState, events, backend, config){
		this._setState = setState;
		this._getState = getState;
		this._events = events;
		this._backend = backend;
		this._config = config;
		this.init();
	}
	init(){
		// overwrite in component handler class
	}
}