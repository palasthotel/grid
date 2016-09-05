import Model from 'ampersand-model';
import Collection from 'ampersand-collection';

/**
 * expose to public
 */
module.exports.Box = Box;
module.exports.BoxCollection = BoxCollection;

/**
 * box collection defintion
 */
const BoxCollection = Collection.extend({
	model: Slot
});

/**
 * the box module
 */
const Box = Model.extend({
	props: {
		id: 'number',
		title: 'string',
	},
	session:{
		editing: ['boolean', false, true],
	},
	collections:{
		// content: editor widget attributes, whatever
	},
});