boxEditorControls['html']=GridBackbone.View.extend({
    initialize:function(){

    },
    render:function(){
        var text=this.model.container[this.model.structure.key];
        if(!text)text="";
        this.$el.html("<label>"+this.model.structure.label+"</label><textarea class='dynamic-value form-html'>"+text+"</textarea>");
        return this;
    },
    fetchValue:function(){
        return CKEDITOR.instances[this.$el.find("div.cke").attr("id").substring(4)].getData();
    }
});
