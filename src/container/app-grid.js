'use strict';

import { connect } from 'react-redux'
import AppGrid from '../component/app-grid'

import {
	actionGridDocumentPublishDraft,
	actionGridDocumentRevertDraft,
	actionGridDocumentRevertToRevision,
} from '../actions/grid.document';

import {
	actionGridContainerEditingAdd,
	actionGridContainerEditingDelete,
	actionGridContainerEditingMove,
	actionGridContainerEditingUpdate,
} from '../actions/grid.container.editing'

import {
	actionGridBoxEditingBoxSearch,
	actionGridBoxEditingCreate,
	actionGridBoxEditingRemove,
	actionGridBoxEditingMove,
	actionGridBoxEditingUpdate,
} from '../actions/grid.box.editing'

import {
	actionUiStateChange,
	actionEditGridBox,
	actionCloseGridBoxEdit,
	actionEditGridContainer,
	actionEditGridContainerClose,
	actionContainerShowInPlaceDialog
} from '../actions/ui'

function grid_is_ready(state){
	return ( typeof state.grid !== typeof undefined && typeof state.grid.id === typeof 1 )
}


export default connect(
	// store state to props. called on every store change
	(state, ownProps) => {
		return {
			is_ready: grid_is_ready(state),
			...state,
		}
	},
	// add dispatch function to props. called only once
	(dispatch) => {

		return {
			// -----------
			// ui events
			// -----------
			onUiStateChange(key, value){
				dispatch(actionUiStateChange(key, value))
			},

			// -----------
			// grid events
			// -----------
			onPublish(grid_id){
				dispatch(actionGridDocumentPublishDraft(grid_id))
			},
			onRevertDraft(grid_id){
				dispatch(actionGridDocumentRevertDraft(grid_id))
			},
			onRevertToRevision(grid_id, revision){
				dispatch(actionGridDocumentRevertToRevision({grid_id,revision}))
			},

			// -----------
			// container events
			// -----------
			onContainerShowInPlaceDialog(args){
				dispatch(actionContainerShowInPlaceDialog(args))
			},
			onContainerAdd(grid_id, container, to_index){
				dispatch(actionGridContainerEditingAdd({grid_id, container_type: container.type, to_index }))
			},
			onContainerMove: (grid_id, container_id, to_index)=>{
				dispatch(actionGridContainerEditingMove({grid_id,container_id, to_index}))
			},
			onContainerDelete: (grid_id, container_id)=>{
				dispatch(actionGridContainerEditingDelete({grid_id, container_id}))
			},
			onContainerReuse: ()=>{
				console.log("onContainerReuse not implemented")
			},
			onContainerEdit: (grid_id, container_id)=>{
				dispatch(actionEditGridContainer(container_id))
			},
			onContainerEditCancel: ()=>{
				dispatch(actionEditGridContainerClose())
			},
			onContainerEditUpdate: (grid_id, container_id, container)=>{
				dispatch(actionGridContainerEditingUpdate({grid_id, container_id, container}))
			},

			// -----------
			// container editor events
			// -----------


			// -----------
			// box events
			// -----------
			onBoxAdd(grid_id, to_container_id, to_slot_id, to_box_index, box){
				dispatch(actionGridBoxEditingCreate({grid_id, to_container_id, to_slot_id,to_box_index, box_type: box.type, box_content: box.content}))
			},
			onBoxMove(grid_id, from_container_id, from_slot_id, from_box_index, to_container_id, to_slot_id, to_box_index ){
				dispatch(actionGridBoxEditingMove({grid_id, from_container_id, from_slot_id, from_box_index, to_container_id, to_slot_id, to_box_index}));
			},
			onBoxEdit(grid_id, box){
				dispatch(actionEditGridBox(box))
			},
			onBoxDelete(grid_id, container_id, slot_id, index){
				dispatch(actionGridBoxEditingRemove({grid_id,container_id,slot_id, index}));
			},
			onBoxTypeSearch(grid_id, box_meta_type, query, criteria){
				dispatch(actionGridBoxEditingBoxSearch({grid_id,box_meta_type,query, criteria}));
			},

			// -----------
			// box editor events
			// -----------
			onSaveBoxeditor(grid_id, container_id, slot_id, box_index, box){
				dispatch(actionGridBoxEditingUpdate({grid_id, container_id, slot_id, index:box_index, box}))
			},
			onDiscardBoxeditor(){
				dispatch(actionCloseGridBoxEdit())
			}

		}
	}
)(AppGrid)