/**
* @author Palasthotel <rezeption@palasthotel.de>
* @copyright Copyright (c) 2014, Palasthotel
* @license GPL-3.0-or-later https://www.gnu.org/licenses/gpl-3.0.html
* @package Palasthotel\Grid
*/

window.GridBoxBlueprints = GridBackbone.Collection.extend({
	model: GridBoxBlueprint,
	initialize: function(spec){
	},
	sync: function(method, collection, options){
		GridRequest.boxblueprints(collection, options);
	}
});