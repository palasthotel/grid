/**
* @author Palasthotel <rezeption@palasthotel.de>
* @copyright Copyright (c) 2014, Palasthotel
* @license GPL-3.0-or-later https://www.gnu.org/licenses/gpl-3.0.html
* @package Palasthotel\Grid
*/

window.GridBoxBlueprint = GridBackbone.Model.extend({
    initialize: function(spec){
    	if(!spec || !spec.type || spec.type == "") throw "InvalidConstructArgs GridBoxBlueprint: needs type";
    	if(!spec.content || typeof spec.content != "object" ) throw "InvalidConstructArgs GridBoxBlueprint: needs content";
    }
});