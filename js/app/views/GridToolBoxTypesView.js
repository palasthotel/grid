/**
* @author Palasthotel <rezeption@palasthotel.de>
* @copyright Copyright (c) 2014, Palasthotel
* @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
* @package Palasthotel\Grid
*/

var GridToolBoxTypesView = GridBackbone.View.extend({
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
            $this.next("dl").append(blueprints_view.render().el);
        } else {
            $this.next("dl").empty();
        }
    }
});

