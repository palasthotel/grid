var GridToolBoxesView = Backbone.View.extend({
    className: "g-tool g-box clearfix",
    events:{
    	"click .box-type-tabs li": "searchBoxes"
    },
    initializes: function(){
    	this.render();
    },
    render: function(){
    	var self = this;
        this.$el.html(ich.tpl_toolBoxes());
        this.collection.each(function(boxtype, index){
        	GRID.log(["type tab", boxtype, index]);
        	jQuery("<li></li>").attr("data-index",index).attr("title", boxtype.get("title") ).attr("data-type", boxtype.get("type") ).appendTo(self.$el.find(".box-type-tabs"));
        });
        this.$el.find(".box-type-tabs li").first().trigger("click");
        return this;
    },
    searchBoxes: function(event){
    	GRID.log(["searchBoxes",event]);
    	var $li = jQuery(event.target);
    	var boxtype = this.collection.at($li.data("index"));
    	boxtype.searchBoxes(function(){
    		GRID.log(boxtype.get("blueprints"));
    		boxtype.get("blueprints").each(function(blueprint){
    			
    		});
    	});
    }
});