var GridSlotStyleChangerView = Backbone.View.extend({
    className:"choose-style",
    tagName: "ul",
    events:{
        "click li": "changeStyle",
    },
    initialize: function() {
    	GRID.log("INIT GridToolbarView");
        this.listenTo(this.model.getGrid().getSlotStyles(),"add",this.render);
    },
    render: function() {
        GRID.log('i am rendering slot styles changer');
        var styles = [];
        this.model.getGrid().getSlotStyles().each( function(style){
            styles.push(style.toJSON());
        });
        this.$el.html(ich.tpl_slotstylechanger({styles: styles, style: this.model.toJSON().style}));
        return this;
    },
    changeStyle: function(event){
        GRID.log(["changeStyle",event]);
        this.model.set("style",jQuery(event.target).attr("data-style"));
        this.model.save();
    }
});