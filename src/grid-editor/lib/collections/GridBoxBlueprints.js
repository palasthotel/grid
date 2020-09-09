/**
* @author Palasthotel <rezeption@palasthotel.de>
* @copyright Copyright (c) 2014, Palasthotel
* @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
* @package Palasthotel\Grid
*/

var GridBoxBlueprints = GridBackbone.Collection.extend({
	model: GridBoxBlueprint,
	initialize: function(spec){
	},
	sync: function(method, collection, options){
		GridRequest.boxblueprints(collection, options);
	}
});