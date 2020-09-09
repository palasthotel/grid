/**
* @author Palasthotel <rezeption@palasthotel.de>
* @copyright Copyright (c) 2014, Palasthotel
* @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
* @package Palasthotel\Grid
*/

var GridAuthor = GridBackbone.Model.extend({
	defaults: function(){
		return {
			has_lock: false,
			request_lock: false
		}
	},
    initialize: function(spec){
    	if( !spec ) throw "No parameters in constructor of author";
    	if( !spec.id ) throw "InvalidConstructArgs GridAuthor needs id";
    	if(!spec.name ) throw "InvalidConstructArgs GridAuthor needs name";
    }
});
