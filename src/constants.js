/**
 * Drag and drop item types
 */
export const ItemTypes = {
	CONTAINER: 'container',
	NEW_CONTAINER: 'new_container',
	BOX: 'box',
	NEW_BOX: 'new_box'
};

export const States = {
	/**
	 * nothing happend
	 */
	WAITING: "waiting",
	/**
	 * loading something
	 */
	LOADING: "loading",
	/**
	 * done and finished with whatever
	 */
	DONE: "done",
};

/**
 * Events on the grid
 */
export const Events = {
	BACKEND: {
		key: "backend_event",
		description: "when a request goes to backend",
	},
	GET_BOX_TYPES: {
		key: "get_box_types",
		description: "get box types based on meta type and search criteria",
	},
	GOT_BOX_TYPE_SEARCH: {
		key: "got_box_type_search",
		description: "result of box type search",
	},
	GRID_RESIZE: {
		key: "grid_resize",
		description: "fired when grid is resized",
	},
	CONTAINER_ADD:{
		key: 'container_add',
		description: 'fired when a container added to the grid',
	},
	CONTAINER_MOVE:{
		key: 'container_move',
		description: 'fired when a container moved on the grid',
	},
	CONTAINER_DELETE:{
		key: 'container_delete',
		description: 'fired when a container is deleted from the grid',
	},
	BOX_ADD:{
		key: 'box_add',
		description: 'fired when a box added to the grid',
	},
	BOX_WAS_ADDED:{
		key: 'box_was_added',
		description: 'fired when a box added to the grid in backend',
	},
	BOX_MOVE:{
		key: 'box_move',
		description: 'fired when a box moved on the grid',
	},
	BOX_WAS_MOVED:{
		key: 'box_was_moved',
		description: 'fired when a box moved on the grid in backend',
	},
	BOX_DELETE:{
		key: 'box_delete',
		description: 'fired when a box is deleted from the grid',
	},
};

// deprecated
const alt = {
	EVENTS:{
		LOADING:{
			KEY: "grid_is_loading",
			description: "when the whole grid is initially loading",
		},
		LOADING_BOXES:{
			KEY: "grid_is_loading_boxes",
			description: "when grid is loading boxes from server",
		},
		LOADING_REVISIONS:{
			KEY: "grid_is_loading_revisions",
			description: "when grid loads revisions",
		}
	},
};