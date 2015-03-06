/**
* @author Palasthotel <rezeption@palasthotel.de>
* @copyright Copyright (c) 2014, Palasthotel
* @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
* @package Palasthotel\Grid
*/

var GridAuthors = GridBackbone.Collection.extend({
    async_authors_list: function(authors){
    	var self = this;
    	_.each(authors, function(author){
    		self.add({name: author});
    	});
    },
    getCount: function(){
        return this.length+1;
    },
    async_authors_joined: function(author){
        this.add({name: author});
    },
    async_authors_left: function(author){
        this.remove(this.findWhere({name: author}));
    },
});