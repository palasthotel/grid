boxEditorControls['hidden']=Backbone.View.extend({
    initialize:function(){

    },
    render:function(){
        return this;
    },
    fetchValue:function(){
        return this.model.container[this.model.structure.key];
    }
});