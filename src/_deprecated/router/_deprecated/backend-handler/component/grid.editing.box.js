import HandlerBase from './_handler.base.js';
import {Events} from '../../../constants';

export default class GridEditingBox extends HandlerBase{
	
	getMetaTypesAndSearchCriteria(response){
		const {data} = response;
		this._setState({box_types: data});
	}
	
	Search(response){
		const {data} = response;
		const type = response.params[1];
		
		/**
		 * save to global state
		 * do not trigger setState
		 */
		let state = this._getState();
		for(let i = 0; i < state.box_types.length; i++){
			if(state.box_types[i].type == type){
				state.box_types[i].boxes = data;
				break;
			}
		}
		
		/**
		 * send directly to component
		 */
		this._events.emit(Events.GOT_BOX_TYPE_SEARCH, type, data);
		
	}
	
	fetchBox(response){
		
	}
	
	CreateBox(response){
		const {params, data} = response;
		this._events.emit(Events.BOX_WAS_ADDED, data, params[1], params[2], params[3], params[4]);
	}
	
	moveBox(response){
		// const box = this.state.container[from.container_index].slots[from.slot_index].boxes.splice(from.index,1);
		// this.state.container[to.container_index].slots[to.slot_index].boxes.
	}
	
	removeBox(response){
		const {params, data} = response;
		
		this._getState().container[params[1]].slots[params[2]].boxes.splice(params[3],1);
		this._setState(this.state);
		
		this._events.emit(Events.BOX_WAS_DELETED, data, params[1], params[2], params[3]);
	}
	
	reuseBox(response){
		
	}
	
	UpdateBox(response){
		
	}
	
}