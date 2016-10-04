"use strict";

import {EventEmitter} from 'events';

/**
 * import default widgets
 */
import TextWidget from "./component/box-editor/widgets/text.js";
import NumberWidget from "./component/box-editor/widgets/number.js";
import HiddenWidget from "./component/box-editor/widgets/hidden.js";
import TextareaWidget from './component/box-editor/widgets/textarea.js';
import CheckboxWidget from './component/box-editor/widgets/checkbox.js';
import SelectWidget from './component/box-editor/widgets/select.js';
import InfoWidget from './component/box-editor/widgets/info.js';

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
	"number": NumberWidget,
	"hidden": HiddenWidget,
	"textarea": TextareaWidget,
	"checkbox": CheckboxWidget,
	"select": SelectWidget,
	"info": InfoWidget,
};
