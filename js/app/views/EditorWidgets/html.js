boxEditorControls['html']=GridBackbone.View.extend({
    className: "grid-editor-widget grid-editor-widget-html",
    initialize:function(){

    },
    render:function(){
        var text=this.model.container[this.model.structure.key];
        if(!text)text="";
        this.$el.html("<label>"+this.model.structure.label+"</label><textarea name='"+this.cid+"' class='dynamic-value form-html'>"+text+"</textarea>");
        return this;
    },
    fetchValue:function(){
        return CKEDITOR.instances[this.cid].getData();
    }
});
