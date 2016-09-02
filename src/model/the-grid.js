import Model from 'ampersand-model';
import Collection from 'ampersand-collection';

module.exports.GRID = GRID;
module.exports.ContainerCollection = ContainerCollection;
module.exports.Container = Container;

const ContainerCollection = Collection.extend({
	model: Container
});


const GRID = Model.extend({
	props: {
		id: 'number',
		autor: 'string',
	},
	session: {
		loading: ['boolean', true, false],
		revisions: {
			type: 'array',
			default: function () { return []; }
		}
	},
	collections:{
		containers: ContainerCollection,
	},
});

const Container = Model.extend({
	props: {
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