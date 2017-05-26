'use strict';

// https://github.com/mzabriskie/axios
import axios from 'axios';

// -----------------------------------
// init
// -----------------------------------

/*
 * settings for ajax connection
 */
const _settings = {};
export const init = (settings) => {
	_settings.url = settings.url;
}

/*
 * private ajax execution method
 */
const requestBackend = (component, method, params = [])=>{
	if(typeof _settings.url === typeof undefined) throw("Please init backend with ajax url")
	return axios.post(
		_settings.url,
		{
			method: method,
			component: component,
			params: params,
		}
	).then((response)=>response.data.result);
}


// -----------------------------------
//  general requests
// -----------------------------------

export const requestGridDocumentLoad =
	(grid_id) => requestBackend(
		"grid.document",
		"loadGrid",
		[grid_id]
	)
export const requestGridDocumentCheckDraftState =
	(grid_id) => requestBackend(
		"grid.document",
		"checkDraftStatus",
		[grid_id]
	)
export const requestGridDocumentRevisions =
	(grid_id) => requestBackend(
		"grid.document",
		"getGridRevisions",
		[grid_id]
	)
export const requestGridPermissionRights =
	() => requestBackend(
		"grid.permissions",
		"Rights"
	)
export const requestGridStylesGetAll =
	() => requestBackend(
		"grid.styles",
		"getAllStyles"
	)
export const requestGridStylesGetContainer =
	() => requestBackend(
		"grid.styles",
		"getContainerStyles"
	)
export const requestGridStylesGetSlot =
	() => requestBackend(
		"grid.styles",
		"getSlotStyles"
	)
export const requestGridStylesGetBox =
	() => requestBackend(
		"grid.styles",
		"getBoxStyles"
	)



// -------------------------
// grid document manipulation
// -------------------------

export const requestGridDocumentPublishDraft =
	(grid_id) => requestBackend(
		"grid.document",
		"publishDraft",
		[grid_id]
	)
export const requestGridDocumentRevertDraft =
	(grid_id) => requestBackend(
		"grid.document",
		"revertDraft",
		[grid_id]
	)
export const requestGridDocumentRevertToRevision =
	({grid_id, revision}) => requestBackend(
		"grid.document",
		"setToRevision",
		[grid_id, revision]
	)


// -------------------------
// container requests
// -------------------------

export const requestGridEditingContainerGetTypes =
	(grid_id) => requestBackend(
		"grid.editing.container",
		"getContainerTypes",
		[grid_id]
	)
export const requestGridEditingContainerAdd =
	({grid_id, container_type, to_index}) => requestBackend(
		"grid.editing.container",
		"addContainer",
		[ grid_id, container_type, to_index ]
	)
export const requestGridEditingContainerMove =
	({grid_id, container_id, to_index} ) => requestBackend(
		"grid.editing.container",
		"moveContainer",
		[ grid_id, container_id, to_index ]
	)
export const requestGridEditingContainerDelete =
	({ grid_id, container_id } ) => requestBackend(
		"grid.editing.container",
		"deleteContainer",
		[ grid_id, container_id ]
	)
export const requestGridEditingContainerReuse =
	({grid_id, container_id, title} ) => requestBackend(
		"grid.editing.container",
		"reuseContainer",
		[ grid_id, container_id, title ]
	)
export const requestGridEditingContainerUpdate =
	( {grid_id, container_id, container} ) => requestBackend(
		"grid.editing.container",
		"updateContainer",
		[ grid_id, container_id, container ]
	)

// -------------------------
// box requests
// -------------------------

export const requestGridEditingBoxMetaTypes =
	(grid_id) => requestBackend(
		"grid.editing.box",
		"getMetaTypesAndSearchCriteria",
		[grid_id]
	)
export const requestGridEditingBoxSearch =
	({grid_id, box_meta_type, query, criteria}) => requestBackend(
		"grid.editing.box",
		"Search",
		[grid_id, box_meta_type, query,	criteria]
	)
export const requestGridEditingBoxCreate =
	({grid_id, to_container_id, to_slot_id,to_box_index, box_type, box_content}) => requestBackend(
		"grid.editing.box",
		"CreateBox",
		[ grid_id, to_container_id, to_slot_id,to_box_index, box_type, box_content ]
	)
export const requestGridEditingBoxMove =
	({grid_id, from_container_id, from_slot_id,	from_box_index, to_container_id, to_slot_id, to_box_index}) => requestBackend(
		"grid.editing.box",
		"moveBox",
		[ grid_id, from_container_id, from_slot_id,	from_box_index, to_container_id, to_slot_id, to_box_index ]
	)
export const requestGridEditingBoxRemove =
	({grid_id, container_id, slot_id, index}) => requestBackend(
		"grid.editing.box",
		"removeBox",
		[ grid_id, container_id, slot_id, index ]
	)
export const requestGridEditingBoxFetch =
	({grid_id, container_id, slot_id, index}) => requestBackend(
		"grid.editing.box",
		"fetchBox",
		[ grid_id, container_id, slot_id, index ]
	)
export const requestGridEditingBoxUpdate =
	({grid_id, container_id, slot_id, index, box}) => requestBackend(
		"grid.editing.box",
		"UpdateBox",
		[ grid_id, container_id, slot_id, index, box ]
	)

// -------------------------
// grid widget requests
// -------------------------
export const requestGridWidgetsTypeAheadSearch =
	({grid_id, container_id, slot_id, box_index, field, query}) => requestBackend(
		"grid.widgets.typeahead",
		"typeAheadSearch",
		[ grid_id, container_id, slot_id, box_index, field, query ]
	)
export const requestGridWidgetsTypeAheadGetText =
	({grid_id, container_id, slot_id, box_index, path, id}) => requestBackend(
		"grid.widgets.typeahead",
		"typeAheadGetText",
		[ grid_id, container_id, slot_id, box_index, path, id ]
	)