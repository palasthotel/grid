/**
* @author Palasthotel <rezeption@palasthotel.de>
* @copyright Copyright (c) 2014, Palasthotel
* @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
* @package Palasthotel\Grid
*/

var GridAuthors = GridBackbone.Collection.extend({
    async_authors_list: function(data){
    	var self = this;
    	_.each(data, function(item){
    		self.add({id: item.identifier, name: item.author});
    	});
    },
    getCount: function(){
        return this.length+1;
    },
    async_authors_joined: function(data){
        this.add({id:data.identifier, name: data.author});
    },
    async_authors_left: function(data){
        this.remove(this.get(data));
    },
});