import State from 'ampersand-state';
import Collection from 'ampersand-collection';

import {BoxCollection} from './box.js';

/**
 * a single slot
 */
const Slot = State.extend({
	props: {
		
	},
	collections: {
		boxes: BoxCollection,
	}
});

/**
 * collection of slots (for container slots)
 */
const SlotCollection = Collection.extend({
	model: Slot
});

/**
 * expose to public
 */
module.exports.Slot = Slot;
module.exports.SlotCollection = SlotCollection;
