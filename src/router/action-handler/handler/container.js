/**
 * method context is  ActionHandler
 */
export default class ContainerHandler{
	/**
	 * when adding a box from sidebar to grid
	 * @param done
	 * @param box
	 * @param to
	 */
	onContainerAdd(done,container,to){
		console.log("onContainerAdd action");
		// this._backend.execute("grid.editing.container","CreateBox",[
		// 	this._grid_id,
		// 	to.container_id,
		// 	to.slot_id,
		// 	to.box_index,
		// 	box.type,
		// 	box.content,
		// ],(error, response)=>{
		// 	done(error,response.data);
		// });
	}
	
	/**
	 * moving box in grid from one to another position
	 * @param done
	 * @param from
	 * @param to
	 * @param box
	 */
	onContainerMove(done, from, to, box){
		console.log("onContainerMove action", from, to, box);
		// this._backend.execute("grid.editing.box","moveBox",[
		// 	this._config.ID,
		// 	from.container_id,
		// 	from.slot_id,
		// 	from.index,
		// 	to.container_id,
		// 	to.slot_id,
		// 	to.index
		// ],(error, response)=>{
		// 	done(error)
		// });
	}
	
	/**
	 * delete box from grid
	 * @param {function} done
	 * @param box_props
	 */
	onContainerDelete(done, container_props){
		console.log("onContainerDelete", box_props);
		const {container_id,slot_id,index} = box_props;
		// this._backend.execute("grid.editing.box","removeBox",[
		// 	this._config.ID,
		// 	container_id,
		// 	slot_id,
		// 	index
		// ],(error, response)=>{
		// 	done(error);
		// });
	}
}