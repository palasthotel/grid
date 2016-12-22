import HandlerBase from './_handler.base.js';

export default class GridDocument extends HandlerBase{
	
	loadGrid(result){
		this.setState({
			loading:false,
			container: result.data.result.container,
			isDraft: result.data.result.isDraft,
		})
	}
	
}