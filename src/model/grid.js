
import Model from 'ampersand-model';

import {Container, ContainerCollection} from './container.js';



var Grid = Model.extend({
	props: {
		id: ['number', true, -1],
		isDraft: ['boolean', true, true],
		autor: 'string',
	},
	session: {
		// [type, required, default]
		loading: ['boolean', true, false],
		revisions: {
			type: 'array',
			default: function () { return []; }
		}
	},
	collections:{
		container: ContainerCollection,
	},
});
module.exports.Grid = Grid;