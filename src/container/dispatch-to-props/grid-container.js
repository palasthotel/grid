'use strict';

import {
	actionGridIsLoading,
	actionGridContainerAdd,
} from '../../actions/state'

import {
	requestGridEditingContainerAdd,
} from '../../connection/backend'


export function onContainerAdd(dispatch, grid_id, container, index){

	const args = {grid_id, container_type: container.type, index};

	dispatch(actionGridIsLoading(true))

	return requestGridEditingContainerAdd(args).then((result)=>{

		dispatch(actionGridIsLoading(false))
		dispatch(actionGridContainerAdd(args, {...result, type: container.type }));

		
	})

}

export function onContainerRemove(dispatch, grid_id, container, index){

	const args = {grid_id, container_type: container.type, index};

	dispatch(actionGridIsLoading(true))

	return requestGridEditingContainerAdd(args).then((result)=>{

		dispatch(actionGridIsLoading(false))
		dispatch(actionGridContainerAdd(args, {...result, type: container.type }));


	})

}