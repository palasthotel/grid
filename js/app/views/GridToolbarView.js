var GridToolbarView = GridBackbone.View.extend({
    id:"grid-toolbar",
    _toolContainersView: null,
    _toolBoxesView: null,
    _revisionsView: null,
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
    },
    render: function() {
        GRID.log('i am rendering the toolbar');
        _revisionsView=new GridRevisionsView({collection:GRID.revisions});
        this.$el.html(ich.tpl_toolbar(this.model.toJSON()));
        this.$el.find(".rev-wrapper table").replaceWith(_revisionsView.$el);
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
        GRID.revert();
    },
    revisions: function(){
        this.$el.find(".rev-wrapper").toggle();
    },
    toggleBoxes: function(){
        console.log("BTN toggleBoxes");
    },
    getToolContainersView: function(){
        if(!(this._toolContainersView instanceof GridToolContainersView) ){
            this._toolContainersView = new GridToolContainersView({collection:GRID.getContainerTypes()});
        }
        return this._toolContainersView;
    },
    containerToolsVisible: function(){
        return (this.$el.find(this.getToolContainersView().el).length == 1);
    },
    toggleContainerTools: function(){
        GRID.log(["toggleContainerTools", this.containerToolsVisible()]);
        if(this.boxToolsVisible()) this.toggleBoxTools();
        if(!this.containerToolsVisible()){
            this.$el.find('.grid-tools').append(this.getToolContainersView().render().el);
        } else {
            this.$el.find(this.getToolContainersView().el).remove();
        }
    },
    getToolBoxesView: function(){
        if(!(this._toolBoxesView instanceof GridToolBoxesView) ){
            this._toolBoxesView = new GridToolBoxesView({collection:GRID.getBoxTypes()});
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