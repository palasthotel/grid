// https://ampersandjs.com/docs/#ampersand-state
// https://ampersandjs.com/docs/#ampersand-collection

import State from 'ampersand-state';

import {ContainerCollection} from './container.js';

var Grid = State.extend({
	props: {
		id: ['number', true, -1],
	},
	session: {
		isDraft: ['boolean', true, true],
		// [type, required, default]
	},
	collections:{
		container: ContainerCollection,
	},
});
module.exports.Grid = Grid;