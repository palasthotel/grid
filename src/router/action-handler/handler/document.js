/**
 * method context is  ActionHandler
 */
export default class DocumentHandler{
	/**
	 * publish grid
	 */
	onPublish(done){
		console.log("onPublish action");
		this._backend.execute("grid.document","publishDraft",[
			this._grid_id,
		],(error, response)=>{
			console.log(response);
			done(error,response.data);
		});
	}
	
	/**
	 * revert draft to last published grid
	 * @param done
	 */
	onRevert(done){
		console.log("onRevert action");
		this._backend.execute("grid.document","revertDraft",[
			this._grid_id,
		],(error, response)=>{
			console.log(response);
			done(error,response.data);
		});
	}
}