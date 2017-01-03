/**
 * method context is  ActionHandler
 */
export default class DocumentHandler{
	/**
	 * publish grid
	 */
	onPublish(done){
		this._backend.execute("grid.document","publishDraft",[
			this._grid_id,
		],(error, response)=>{
			done(error,response.data);
		});
	}
	
	/**
	 * revert draft to last published grid
	 * @param done
	 * @param revision
	 */
	onRevert(done, revision){
		if(!revision){
			this._backend.execute("grid.document","revertDraft",[
				this._grid_id,
			],(error, response)=>{
				done(error,response.data);
			});
		} else {
			this._backend.execute("grid.document","setToRevision",[
				this._grid_id,
				revision.revision,
			],(error, response)=>{
				done(error,response.data);
			});
		}
	}
	
	
}