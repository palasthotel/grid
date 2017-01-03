/**
 * method context is  ActionHandler
 */
export default class ContainerHandler{
	/**
	 * when adding a box from sidebar to grid
	 * @param done
	 * @param container
	 * @param index
	 */
	onContainerAdd(done,container,index){
		this._backend.execute("grid.editing.container","addContainer",[
			this._grid_id,
			container.type,
			index,
		],(error, response)=>{
			done(error,response.data);
		});
	}
	
	/**
	 * moving box in grid from one to another position
	 * @param done
	 * @param container
	 * @param to
	 */
	onContainerMove(done, container, to){
		console.log("onContainerMove action", container, to);
		this._backend.execute("grid.editing.container","moveContainer",[
			this._config.ID,
			container.id,
			to,
		],(error, response)=>{
			done(error, response.data);
		});
	}
	
	/**
	 * delete box from grid
	 * @param {function} done
	 * @param container
	 */
	onContainerDelete(done, container){
		this._backend.execute("grid.editing.container","deleteContainer",[
			this._grid_id,
			container.id,
		],(error, response)=>{
			console.log(response);
			done(error, response.data);
		});
	}
}