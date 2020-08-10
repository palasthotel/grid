<?php
namespace Grid\Constants;

/**
 * Class Hooks
 * all hook names for grid
 * @package Grid\Constants
 */

class Hook{

	const TYPE_HOOK = "hook";
	const TYPE_HOOK_ALTER = "hook_alter";

	const CREATE_GRID = "createGrid";
	const CLONE_GRID = "cloneGrid";
	const PUBLISH_GRID = "publishGrid";
	const DESTROY_GRID = "destroyGrid";

	const CREATE_CONTAINER = "createContainer";
	
	const WILL_RENDER_GRID = "will_render_grid";
	const DID_RENDER_GRID = "did_render_grid";
	
	const WILL_RENDER_CONTAINER = "will_render_container";
	const DID_RENDER_CONTAINER = "did_render_container";
	
	const WILL_RENDER_SLOT = "will_render_slot";
	const DID_RENDER_SLOT = "did_render_slot";
	
	const WILL_RENDER_BOX = "will_render_box";
	const DID_RENDER_BOX = "did_render_box";

	const SAVE_BOX = "save_box";
	const SAVE_SLOT = "save_slot";
	const SAVE_CONTAINER = "save_container";

	const DELETE_BOX = "delete_box";
	const DELETE_CONTAINER = "delete_container";

	const ALTER_CONFIGURATION_BOX_CONTENT_STRUCTURE = "configuration_box_alter_content_structure";
	const ALTER_BOX_CONTENT_STRUCTURE = "box_alter_content_structure";

	const ALTER_REUSE_CONTAINER_IDS = "reuse_container_ids";

}