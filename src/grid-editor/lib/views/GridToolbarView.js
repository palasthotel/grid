/**
* @author Palasthotel <rezeption@palasthotel.de>
* @copyright Copyright (c) 2014, Palasthotel
* @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
* @package Palasthotel\Grid
*/

window.GridToolbarView = GridBackbone.View.extend({
    id:"grid-toolbar",
    _toolContainersView: null,
    _toolBoxesView: null,
    _revisionsView: null,
    events:{
        "click .grid-toolbar [role=publish]": "publish",
        "click .grid-toolbar [role=preview]": "preview",
        "click .grid-toolbar [role=revert]": "revert",
        "click .grid-toolbar [role=revisions]": "revisions",
        "click .grid-toolbar [role=authors]": "onClickAuthors",
        "click .grid-element-type[data-type=box]:not(.active)": "showBoxTools",
        "click .grid-element-type[data-type=container]:not(.active)": "showContainerTools"
    },
    initialize: function() {
        this.listenTo(this.model, "change:isDraft", this.setState);
        this.listenTo(GRID.authors, "add", this.onUpdateAuthors);
        this.listenTo(GRID.authors, "remove", this.onUpdateAuthors);
        this.listenTo(GRID.authors, "reset", this.onUpdateAuthors);
        this.setState();
    },
    render: function() {

        this.$el.html(ich.tpl_toolbar(this.model.toJSON()));

        this.$toolbar = this.$el.find(".grid-toolbar");

        this.$tool_elements = this.$el.find(".grid-tool-elements");
        this.$tool_element_content = this.$el.find(".grid-element-type-content");
        this.$tab_container = this.$el.find(".grid-element-type[data-type=container]");
        this.$tab_box = this.$el.find(".grid-element-type[data-type=box]");
        this.$element_trash = this.$el.find(".grid-element-trash");
        this.$authors_count = this.$el.find(".indicator-authors-count");

        if(GRID.mode == "grid"){
           this._revisionsView = new GridRevisionsView({collection:GRID.revisions});
           this.$el.append(this._revisionsView.$el.hide());

        }
        var type = "container";
        if(GRID.mode == "container" || !GRID.getRights().get("create-container")){
            this.$tab_container.remove();
            type = "box";
        }
        if(!GRID.getRights().get("create-box")){
            this.$tab_box.remove();
            type = false;
        }

        if(type == "container" ){
            this.showContainerTools();
        } else if(type == "box"){
            this.showBoxTools();
        }
        this.onUpdateAuthors();

        return this;
    },
    publish: function(){
        if(!GRID.getRights().get("publish") || GRID.locked()){
            alert("You have no rights for that...");
            return false;
        }
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
        window.open(this.model.get("PREVIEW_URL"),"grid_preview");
    },
    revert: function(){
        if(!GRID.getRights().get("revert") || GRID.locked() ){
            alert("You have no rights for that...");
            return false;
        }
        GRID.revert();
    },
    revisions: function(){
        this._revisionsView.$el.slideToggle();
        jQuery("html, body").animate({scrollTop: 0},300);
    },
    toggleBoxes: function(){
        GRID.log("BTN toggleBoxes");
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
            this.showBoxTools();
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
        var elements_top_offset = this.$el.offset().top;
        var tab_height = this.$tab_container.outerHeight();
        var height = window_height-elements_top_offset-tab_height;
        this.$tool_element_content.css("height", height);
        this.trigger('toolbar_resize',height);
    },
    /**
     * authors button
     */
    onUpdateAuthors: function(){
        if(GRID.authors.getCount() < 2){
            this.$authors_count.parents("li").hide();
        } else {
            this.$authors_count.parents("li").show();
            this.$authors_count.text(GRID.authors.getCount());
        }
        this.$toolbar.removeClass("async-request-lock");
        var self = this;
        GRID.authors.each(function(author){
            if(author.get("request_lock")){
                self.$toolbar.addClass("async-request-lock");
            }
        });
    },
    onClickAuthors: function(e){
        GRID.toggleAuthors();
        this.$toolbar.removeClass("async-request-lock");
    },
    /**
     * when user requests lock event
     */
    async_request_lock: function(){
        this.$toolbar.addClass("async-request-lock");
    }
});

