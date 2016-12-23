import HandlerBase from './_handler.base.js';
import {Events} from '../../../constants';

export default class GridEditingBox extends HandlerBase{
	
	getMetaTypesAndSearchCriteria(response){
		const {data} = response;
		this.setState({box_types: data});
	}
	
	Search(response){
		const {data} = response;
		const type = response.params[1];
		
		/**
		 * save to global state
		 * do not trigger setState
		 */
		let state = this.getState();
		for(let i = 0; i < state.box_types.length; i++){
			if(state.box_types[i].type == type){
				state.box_types[i].boxes = data;
				break;
			}
		}
		
		/**
		 * send directly to component
		 */
		this.events.emit(Events.GOT_BOX_TYPE_SEARCH, {type:type, boxes:data});
		
	}
}