"use strict";

/**
 * import default widgets
 */
import TextWidget from "./component/input-widgets/text.js";
import NumberWidget from "./component/input-widgets/number.js";
import HiddenWidget from "./component/input-widgets/hidden.js";
import TextareaWidget from './component/input-widgets/textarea.js';
import HtmlWidget from './component/input-widgets/html.js';
import CheckboxWidget from './component/input-widgets/checkbox.js';
import SelectWidget from './component/input-widgets/select.js';
import InfoWidget from './component/input-widgets/info.js';
import ListWidget from './component/input-widgets/list.js';
import DividerWidget from './component/input-widgets/divider.js';
import AutocompleteWidget from './component/input-widgets/autocomplete.js';
import MultiAutocompleteWidget from './component/input-widgets/multi-autocomplete.js';
import FileWidget from './component/input-widgets/file.js';
import WPMediaselectWidget from './component/input-widgets/wp_mediaselect.js';

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
	toobar_buttons: [],
	toolbar_buttons_editor: [],
	overlays: [],
	overlays_editor: [],
};



/**
 * collect all plugin information for grid here
 */
if(typeof window.GRID !== typeof {}) throw new Exception("GRID is missing");

GRID.box_editor_widgets = {
	"text": TextWidget,
	"number": NumberWidget,
	"hidden": HiddenWidget,
	"textarea": TextareaWidget,
	"html": HtmlWidget,
	"checkbox": CheckboxWidget,
	"select": SelectWidget,
	"info": InfoWidget,
	"list": ListWidget,
	"divider": DividerWidget,
	"autocomplete": AutocompleteWidget,
	"multi-autocomplete": MultiAutocompleteWidget,
	"file": FileWidget,
	"wp_mediaselect": WPMediaselectWidget,
};
