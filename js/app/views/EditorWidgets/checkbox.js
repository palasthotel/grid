boxEditorControls['checkbox']=GridBackbone.View.extend({
    className: "grid-editor-widget-checkbox",
    initialize:function(){

    },
    render:function(){
        var value=this.model.container[this.model.structure.key];
        var checked='';
        if(value) checked='checked=checked';
        html="<label><input type='checkbox' "+checked+" /> "+this.model.structure.label+"</label>";
        this.$el.html(html);
        return this;
    },
    fetchValue:function(){
        return this.$el.find("input[type=checkbox]").is(":checked");
    }
});