// https://ampersandjs.com/docs/#ampersand-state
// https://ampersandjs.com/docs/#ampersand-collection

import State from 'ampersand-state';

import {ContainerCollection} from './container.js';

var Grid = State.extend({
	props: {
		id: ['number', true, -1],
		isDraft: ['boolean', true, true],
	},
	session: {
		// [type, required, default]
		loading: ['boolean', true, false],
	},
	collections:{
		container: ContainerCollection,
	},
});
module.exports.Grid = Grid;