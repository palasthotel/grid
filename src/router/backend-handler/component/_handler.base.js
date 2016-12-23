
export default class HandlerBase{
	constructor(getState, setState, events){
		this.setState = setState;
		this.getState = getState;
		this.events = events;
	}
}