'use strict';

import {
	actionGridIsLoading,
	actionGridUpdate,
} from '../../actions/state'

import {
	requestGridDocumentRevertDraft,
} from '../../connection/backend'

export function onRevertDraft(dispatch, grid_id){

	dispatch(actionGridIsLoading(true))
	return requestGridDocumentRevertDraft(grid_id).then((result)=>{

		dispatch(actionGridIsLoading(false))
		dispatch(actionGridUpdate(result));

	})

}