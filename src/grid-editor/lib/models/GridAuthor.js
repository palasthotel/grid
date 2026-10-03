/**
* @author Palasthotel <rezeption@palasthotel.de>
* @copyright Copyright (c) 2014, Palasthotel
* @license GPL-3.0-or-later https://www.gnu.org/licenses/gpl-3.0.html
* @package Palasthotel\Grid
*/

window.GridAuthor = GridBackbone.Model.extend({
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
