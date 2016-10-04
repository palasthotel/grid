"use strict";

import {EventEmitter} from 'events';

/**
 * import default widgets
 */
import TextWidget from "./component/box-editor/widgets/text.js";

/**
 *
 * @type {
 *  {
 *  id: null,
 *  events: *,
 *  toobar_buttons: Array,
 *  toolbar_buttons_editor: Array,
 *  overlays: Array,
 *  overlays_editor: Array
 *  }}
 */
var GRID = window.GRID = {
	id: null,
	events: new EventEmitter(),
	toobar_buttons: [],
	toolbar_buttons_editor: [],
	overlays: [],
	overlays_editor: [],
};

GRID.events.setMaxListeners(0);



/**
 * collect all plugin information for grid here
 */
if(typeof window.GRID != typeof {}) throw new Exception("GRID is missing");

GRID.box_editor_widgets = {
	"text": TextWidget,
};
