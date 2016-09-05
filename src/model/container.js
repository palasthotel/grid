import Model from 'ampersand-model';
import Collection from 'ampersand-collection';

import Grid from './grid.js';

const Container = Model.extend({
	props: {
		grid: 'state',
		id: 'number',
		title: 'string',
	},
	session:{
		editing: ['boolean', false, true],
	},
	collections:{
		// slots: ContainerCollection,
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