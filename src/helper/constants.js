/**
 * Drag and drop item types
 */
export const ItemTypes = {
	CONTAINER: 'container',
	NEW_CONTAINER: 'new_container',
	BOX: 'box',
	NEW_BOX: 'new_box'
};

/**
 * Events on the grid
 */
export const Events = {
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
	BOX_MOVE:{
		key: 'box_move',
		description: 'fired when a box moved on the grid',
	},
	BOX_DELETE:{
		key: 'box_delete',
		description: 'fired when a box is deleted from the grid',
	},
};