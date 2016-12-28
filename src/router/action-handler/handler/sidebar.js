
export default class SidebarHandler{
	/**
	 * sidebar box type search
	 * @param done
	 * @param type
	 * @param criteria
	 * @param query
	 */
	onBoxTypeSearch(done, type, criteria, query){
		this._backend.execute(
			"grid.editing.box",
			"Search",
			[
				this._config.ID,
				type,
				query,
				criteria
			], (error, response)=>{
				done(response.data);
			}
		);
	}
}