
export default class HandlerBase{
	constructor(getState, setState, events){
		this._setState = setState;
		this._getState = getState;
		this._events = events;
	}
}