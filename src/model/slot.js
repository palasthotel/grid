import Model from 'ampersand-model';
import Collection from 'ampersand-collection';

import Box from './box.js';

/**
 * expose to public
 */
module.exports.Slot = Slot;
module.exports.SlotCollection = SlotCollection;

const SlotCollection = Collection.extend({
	model: Slot
});

const Slot = Model.extend({
	
});