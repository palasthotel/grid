boxEditorControls['hidden']=GridBackbone.View.extend({
    initialize:function(){

    },
    render:function(){
        return this;
    },
    fetchValue:function(){
        return this.model.container[this.model.structure.key];
    }
});