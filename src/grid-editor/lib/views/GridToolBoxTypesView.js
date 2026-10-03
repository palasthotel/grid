/**
* @author Palasthotel <rezeption@palasthotel.de>
* @copyright Copyright (c) 2014, Palasthotel
* @license GPL-3.0-or-later https://www.gnu.org/licenses/gpl-3.0.html
* @package Palasthotel\Grid
*/

window.GridToolBoxTypesView = GridBackbone.View.extend({
    className: "grid-tool grid-element-box",
    events:{
    	"click .grid-box-type": "toggleBoxType"
    },
    render: function(){
    	var self = this;
        this.$el.empty();
        var json = {boxtypes:[]};
        this.collection.each(function(boxtype, index){
            var boxtype_json = boxtype.toJSON();
            boxtype_json.index = index;
            json.boxtypes.push(boxtype_json);
        });
        this.$el.append(ich.tpl_toolBoxes(json));
        this.delegateEvents();
        return this;
    },
    toggleBoxType: function(event){
        var $this = jQuery(event.currentTarget);
        $this.toggleClass('active');
        if($this.hasClass('active')){
            var blueprints_view = new GridToolBoxBlueprintsView({model:this.collection.at($this.data("index"))});
            $this.next("dd").append(blueprints_view.render().el);
        } else {
            $this.next("dd").empty();
        }
    }
});

