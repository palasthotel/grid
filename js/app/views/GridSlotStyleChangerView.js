var GridSlotStyleChangerView = Backbone.View.extend({
    className:"style-changer",
    tagName: "div",
    events:{
        "click li": "changeStyle",
    },
    initialize: function() {
    	GRID.log("INIT GridToolbarView");
        this.listenTo(GRID.getSlotStyles(),"add",this.render);
    },
    render: function() {
        GRID.log('i am rendering slot styles changer');
        var styles = [];
        var activestyle = "Default Style";
        var self = this;
        GRID.getSlotStyles().each( function(style){
            if(style.get("slug") == self.model.get("style")) activestyle = style.get("title");
            styles.push(style.toJSON());
        });
        this.$el.html(ich.tpl_slotstylechanger({styles: styles, activestyle: activestyle}));
        return this;
    },
    changeStyle: function(event){
        this.model.set("style",jQuery(event.target).attr("data-style"));
        this.model.save();
    }
});