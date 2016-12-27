import HandlerBase from './_handler.base.js';

export default class GridEditingContainer extends HandlerBase{
	
	getContainerTypes(response){
		const {data} = response;
		this._setState({container_types: data});
	}
	
}