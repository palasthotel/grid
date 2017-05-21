import HandlerBase from './_handler.base';
import {Events} from '../../../constants';

/**
 * gui events related to boxes
 */
export default class BoxHandler extends HandlerBase{
	/**
	 * init handler event listeners
	 */
	init(){
		super.init();
		this._events.on(Events.GET_BOX_TYPES,this.onGetBoxTypes.bind(this));
		this._events.on(Events.BOX_ADD,this.onAdd.bind(this));
		this._events.on(Events.BOX_MOVE,this.onMove.bind(this));
		this._events.on(Events.BOX_DELETE,this.onDelete.bind(this));
	}
	
	/**
	 * sidebar box type search
	 * @param type
	 * @param search
	 * @param criteria
	 */
	onGetBoxTypes(type, search = "", criteria = []){
		this._backend.execute(
			"grid.editing.box",
			"Search",
			[
				this._config.ID,
				type,
				search,
				criteria
			]
		);
	}
	
	/**
	 * when adding a box from sidebar to grid
	 * @param box
	 * @param to
	 */
	onAdd(box, to){
		this._backend.execute("grid.editing.box","CreateBox",[
			this._config.ID,
			to.container_id,
			to.slot_id,
			to.box_index,
			box.type,
			box.content,
		]);
	}
	
	/**
	 * moving box in grid from one to another position
	 * @param from
	 * @param to
	 * @param box
	 */
	onMove(from, to, box){
		console.log(from, to, box);
		this._backend.execute("grid.editing.box","moveBox",[
			this._config.ID,
			from.container_id,
			from.slot_id,
			from.index,
			to.container_id,
			to.slot_id,
			to.index
		]);
	}
	
	/**
	 * delete box from grid
	 * @param box_props
	 */
	onDelete(box_props){
		console.log("onDelete", box_props);
		const {container_id,slot_id,index} = box_props;
		this._backend.execute("grid.editing.box","removeBox",[
			this._config.ID,
			container_id,
			slot_id,
			index
		]);
	}
	
}