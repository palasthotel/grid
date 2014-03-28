boxEditorControls['number']=GridBackbone.View.extend({
    initialize:function(){

    },
    render:function(){
        var text=this.model.container[this.model.structure.key];
        if(!text)text="";
        this.$el.html("<label>"+this.model.structure.label+"</label><input type=number class='dynamic-value form-html' value='"+text+"'/>");
        return this;
    },
    fetchValue:function(){
        return jQuery(this.$el).find("input").val();
    }
});