var GridToolbarView = Backbone.View.extend({
    id:"grid-toolbar",
    _toolContainersView: null,
    _toolBoxesView: null,
    events:{
        "click [role=publish]": "publish",
        "click [role=preview]": "preview",
        "click [role=revert]": "revert",
        "click [role=revisions]": "revisions",
        "click [role=toggle_boxes]": "toggleBoxes",
        "click [role=show_containers]": "toggleContainerTools",
        "click [role=show_boxes]": "toggleBoxTools"
    },
    initialize: function() {
    	GRID.log("INIT GridToolbarView");
        this.render();
    },
    render: function() {
        GRID.log('i am rendering the toolbar');
        this.$el.html(ich.tpl_toolbar(this.model.toJSON()));
        return this;
    },
    publish: function(){
        console.log("BTN publish");
        this.model.save();
    },
    preview: function(){
        console.log("BTN preview");
        window.open(this.model.get("PREVIEW_URL"),"_blank");
    },
    revert: function(){
        console.log("BTN revert");
    },
    revisions: function(){
        console.log("BTN revisions");
    },
    toggleBoxes: function(){
        console.log("BTN toggleBoxes");
    },
    getToolContainersView: function(){
        if(!(this._toolContainersView instanceof GridToolContainersView) ){
            this._toolContainersView = new GridToolContainersView({collection:this.model.getContainerTypes()});
        }
        return this._toolContainersView;
    },
    containerToolsVisible: function(){
        return (this.$el.find(this.getToolContainersView().el).length == 1);
    },
    toggleContainerTools: function(){
        GRID.log(["toggleContainerTools", this.containerToolsVisible()]);
        if(!this.containerToolsVisible()){
            this.$el.find('.grid-tools').append(this.getToolContainersView().render().el);
        } else {
            this.$el.find(this.getToolContainersView().el).remove();
        }
    },
    getToolBoxesView: function(){
        if(!(this._toolBoxesView instanceof GridToolBoxesView) ){
            this._toolBoxesView = new GridToolBoxesView({collection:this.model.getBoxTypes()});
        }
        return this._toolBoxesView;
    },
    boxToolsVisible: function(){
        return (this.$el.find(this.getToolBoxesView().el).length == 1);
    },
    toggleBoxTools: function(){
        GRID.log(["toggleBoxTools", this.boxToolsVisible()]);
        if(this.containerToolsVisible()) this.toggleContainerTools();
        if(!this.boxToolsVisible()){
            this.$el.find('.grid-tools').append(this.getToolBoxesView().render().el);
        } else {
            this.$el.find(this.getToolBoxesView().el).remove();
        }
    }
});