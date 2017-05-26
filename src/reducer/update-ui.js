
import {
	GRID_UI_STATE,
	GRID_LOADING,
	GRID_BOX_EDIT,
	GRID_CONTAINER_EDIT,
	GRID_CONTAINER_IN_PLACE_DIALOG,
	GRID_BOX_IN_PLACE_DIALOG,

} from '../actions/types';

export default function updateUI(state, action){
	switch (action.type) {

		case GRID_UI_STATE:
			const new_state = {
				...state,
			};
			new_state[action.payload.key] = action.payload.value;
			return new_state;

		case GRID_LOADING:
			return {
				...state,
				is_loading: action.payload.is_loading,
			};
			break;
		case GRID_CONTAINER_EDIT:
			return {
				...state,
				edit_container: action.payload.container_id,
			}
		case GRID_BOX_EDIT:
			return {
				...state,
				edit_box: action.payload.box,
			}
		case GRID_CONTAINER_IN_PLACE_DIALOG:
			return {
				...state,
				container_dialog_index: action.payload.index,
			}
		case GRID_BOX_IN_PLACE_DIALOG:
			return {
				...state,
				box_dialog: {
					...action.payload,
				}
			}
		default:
			return state;
	}
}