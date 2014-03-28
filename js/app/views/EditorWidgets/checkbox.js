boxEditorControls['checkbox']=GridBackbone.View.extend({
    initialize:function(){

    },
    render:function(){
        var value=this.model.container[this.model.structure.key];
        var checked='';
        if(value)
            checked='checked=checked';
        html="<label>"+this.model.structure.label+"</label>";
        html="<input type='checkbox' "+checked+"</input>";
        jQuery(this.$el).html(html);
        return this;
    },
    fetchValue:function(){
        return jQuery(this.$el).is(":checked");
    }
});