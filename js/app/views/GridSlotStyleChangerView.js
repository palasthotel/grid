/**
* @author Palasthotel <rezeption@palasthotel.de>
* @copyright Copyright (c) 2014, Palasthotel
* @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
* @package Palasthotel\Grid
*/

var GridSlotStyleChangerView = GridBackbone.View.extend({
    className:"grid-slot-style-changer style-changer",
    tagName: "div",
    events:{
        "click li": "changeStyle",
    },
    initialize: function() {
        this.listenTo(GRID.getSlotStyles(),"add",this.render);
    },
    render: function() {
        var styles = [];
        var activestyle = "Default Style";
        var self = this;
        GRID.getSlotStyles().each( function(style){
            if(style.get("slug") == self.model.get("style")) activestyle = style.get("title");
            styles.push(style.toJSON());
        });
        var container=this.model.getContainer();
        this.$el.html(ich.tpl_slotstylechanger({styles: styles, activestyle: activestyle,reused:container.get("reused")}));
        return this;
    },
    changeStyle: function(event){
        this.model.set("style",jQuery(event.target).attr("data-style"));
        this.model.save();
    }
});