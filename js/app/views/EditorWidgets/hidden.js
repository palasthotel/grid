boxEditorControls['hidden']=GridBackbone.View.extend({
	className: "grid-editor-widget-hidden",
    initialize:function(){

    },
    render:function(){
        return this;
    },
    fetchValue:function(){
        return this.model.container[this.model.structure.key];
    }
});