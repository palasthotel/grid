/**
* @author Palasthotel <rezeption@palasthotel.de>
* @copyright Copyright (c) 2014, Palasthotel
* @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
* @package Palasthotel\Grid
*/

var GridBoxBlueprint = GridBackbone.Model.extend({
    initialize: function(spec){
    	if(!spec || !spec.type || spec.type == "") throw "InvalidConstructArgs GridBoxBlueprint: needs type";
    	if(!spec.content || typeof spec.content != "object" ) throw "InvalidConstructArgs GridBoxBlueprint: needs content";
    }
});