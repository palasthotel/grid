import HandlerBase from './_handler.base.js';

export default class GridDocument extends HandlerBase{
	
	loadGrid(response){
		const {data} = response;
		this.setState({
			loading:false,
			container: data.container,
			isDraft: data.isDraft,
		})
	}
	
}