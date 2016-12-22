import HandlerBase from './_handler.base.js';

export default class GridDocument extends HandlerBase{
	
	getContainerTypes(result){
		this.setState({container_types: result.data.result});
	}
	
}