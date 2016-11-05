import State from 'ampersand-state';
import Collection from 'ampersand-collection';

/**
 * the box module
 */
const Box = State.extend({
	props: {
		id: 'number',
		title: 'string',
		content: 'object',
	},
	session:{
		editing: ['boolean', false, true],
	},
});


/**
 * box collection defintion
 */
const BoxCollection = Collection.extend({
	model: Box
});



/**
 * expose to public
 */
module.exports.Box = Box;
module.exports.BoxCollection = BoxCollection;