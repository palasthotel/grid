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
        "click .grid-element-type[data-type=box]:not(.active)": "showBoxTools",
        "click .grid-element-type[data-type=container]:not(.active)": "showContainerTools"
    },
    initialize: function() {
    	GRID.log("INIT GridToolbarView");
        this.listenTo(this.model, "change:isDraft", this.setState);
        this.setState();
    },
    render: function() {
        GRID.log('i am rendering the toolbar');

        this.$el.html(ich.tpl_toolbar(this.model.toJSON()));
        
        this.$tool_elements = this.$el.find(".grid-tool-elements");
        this.$tool_element_content = this.$el.find(".grid-element-type-content");
        this.$tab_container = this.$el.find(".grid-element-type[data-type=container]");
        this.$tab_box = this.$el.find(".grid-element-type[data-type=box]");
        this.$element_trash = this.$el.find(".grid-element-trash");

        if(GRID.mode == "grid"){
           this._revisionsView = new GridRevisionsView({collection:GRID.revisions}); 
           this.$el.append(this._revisionsView.$el.hide());
           this.showContainerTools();
        } else if(GRID.mode == "container"){
            this.showBoxTools();
        }
        
        return this;
    },
    publish: function(){
        console.log("BTN publish");
        this.model.save();
    },
    setState: function(){
        var isDraft = this.model.get("isDraft");
        this.$el.find(".grid-toolbar").attr("data-draft", isDraft);
        var $button = this.$el.find(".grid-tool-state span");
        if(isDraft){
            $button.html("Draft");
        } else {
            $button.html("Published");
        }
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
        this._revisionsView.$el.slideToggle();
    },
    toggleBoxes: function(){
        console.log("BTN toggleBoxes");
    },
    // container tools
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
        this.hideBoxTools();
        if(!this.containerToolsVisible()){
            this.showContainerTools();
        } else {
            this.hideContainerTools();
        }
    },
    showContainerTools: function(){
        this.hideBoxTools();
        if(!this.containerToolsVisible()){
            this.$el.find(this.getToolContainersView().el).remove();
            this.$el.find('.grid-element-type-content').append(this.getToolContainersView().render().el);
            this.$tab_container.addClass('active');
        }
    },
    hideContainerTools: function(){
        if( this.containerToolsVisible() ){
            this.$el.find(this.getToolContainersView().el).remove();
            this.$tab_container.removeClass('active');
        }
    },
    // boxes tools
    getToolBoxesView: function(){
        if(!(this._toolBoxesView instanceof GridToolBoxTypesView) ){
            this._toolBoxesView = new GridToolBoxTypesView({collection:GRID.getBoxTypes()});
        }
        return this._toolBoxesView;
    },
    boxToolsVisible: function(){
        return (this.$el.find(this.getToolBoxesView().el).length == 1);
    },
    toggleBoxTools: function(){
        this.hideContainerTools();
        if(!this.boxToolsVisible()){
            this.showBoxTools
        } else {
            this.hideBoxTools();
        }
    },
    showBoxTools: function(){
        this.hideContainerTools();
        if(!this.boxToolsVisible()){
            this.$el.find('.grid-element-type-content').append(this.getToolBoxesView().render().el);
            this.$tab_box.addClass('active');
        }
    },
    hideBoxTools: function(){
        if(this.boxToolsVisible()) {
            this.$tab_box.removeClass('active');
            this.$el.find(this.getToolBoxesView().el).remove();
        }
    },
    // resize Container and Box toolbar
    onResize: function(){
        var window_height = jQuery(window).height();
        var elements_top_offset = this.$tool_element_content.offset().top;
        var tab_height = this.$tab_container.outerHeight(true);
        var trash_height = this.$element_trash.outerHeight(true);
        this.$tool_element_content.css("height", (window_height-elements_top_offset-tab_height-trash_height));
    }
});