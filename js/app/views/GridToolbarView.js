var GridToolbarView = Backbone.View.extend({
    id:"grid-new-toolbar",
    events:{
        "click [role=publish]": "publish",
        "click [role=preview]": "preview",
        "click [role=revert]": "revert",
        "click [role=revisions]": "revisions",
        "click [role=hide_boxes]": "hideboxes"
    },
    initialize: function() {
    	GRID.log("INIT GridToolbarView");
        this.render();
    },
    render: function() {
        GRID.log('i am rendering the toolbar');
        this.$el.html(ich.tpl_toolbar());
        return this;
    },
    publish: function(){
        console.log("BTN publish");
    },
    preview: function(){
        console.log("BTN preview");
    },
    revert: function(){
        console.log("BTN revert");
    },
    revisions: function(){
        console.log("BTN revisions");
    },
    hideboxes: function(){
        console.log("BTN hideboxes");
    },
    addContainer: function(){
        console.log("BTN addContainer");
    },
    addBox: function(){
        console.log("BTN addBox");
    }
});