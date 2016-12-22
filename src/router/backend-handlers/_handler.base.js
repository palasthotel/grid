
export default class HandlerBase{
	constructor(getState, setState){
		this.setState = setState;
		this.getState = getState;
	}
}