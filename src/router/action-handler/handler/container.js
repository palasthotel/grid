/**
 * method context is  ActionHandler
 */
export default class ContainerHandler{
	/**
	 * when adding a box from sidebar to grid
	 * @param {function} done
	 * @param {object} container
	 * @param {int} index
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
	 * @param {function} done
	 * @param {object} container
	 * @param {int} to
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
	 * @param {object} container
	 */
	onContainerDelete(done, container){
		this._backend.execute("grid.editing.container","deleteContainer",[
			this._grid_id,
			container.id,
		],(error, response)=>{
			done(error, response.data);
		});
	}
	
	/**
	 * make container reusable
	 * @param {function} done
	 * @param {object} container
	 * @param {string} reuse_title
	 */
	onContainerReuse(done, container, reuse_title){
		this._backend.execute("grid.editing.container","reuseContainer",[
			this._grid_id,
			container.id,
			reuse_title,
		],(error, response)=>{
			done(error, response.data);
		});
	}
}