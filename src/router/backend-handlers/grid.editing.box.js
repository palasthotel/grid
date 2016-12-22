import HandlerBase from './_handler.base.js';

export default class GridEditingBox extends HandlerBase{
	
	getMetaTypesAndSearchCriteria(result){
		this.setState({box_types: result.data.result});
	}
	
	Search(result){
		
		console.log("Search",result);
		const type = result.params[1];
		let state = this.getState();
		for(let i = 0; i < state.box_types.length; i++){
			if(state.box_types[i].type == type){
				state.box_types[i].boxes = result.data.result;
				break;
			}
		}
		this.setState(state);
		
	}
}