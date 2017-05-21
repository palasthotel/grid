import State from 'ampersand-state';
import Collection from 'ampersand-collection';

import {SlotCollection} from './slot.js';

const Container = State.extend({
	extraProperties: 'allow',
	props: {
		grid: 'state',
		id: 'any',
		title: 'string',
		type: "string",
	},
	session:{
		editing: ['boolean', false, true],
	},
	collections:{
		slots: SlotCollection,
	},
});

const ContainerCollection = Collection.extend({
	model: Container
});

/**
 * expose to public
 */
module.exports.Container = Container;
module.exports.ContainerCollection = ContainerCollection;