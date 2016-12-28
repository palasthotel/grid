import {Events} from '../../../constants';

export default class ContainerHandler{
	init(){
		this._events.on(Events.CONTAINER_ADD,this.onAdd.bind(this));
		this._events.on(Events.CONTAINER_MOVE,this.onMove.bind(this));
		this._events.on(Events.CONTAINER_DELETE,this.onDelete.bind(this));
	}
	onAdd(){
		
	}
	onMove(){
		
	}
	onDelete(){
		
	}
}