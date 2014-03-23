boxEditorControls['select']=Backbone.View.extend({
    initialize:function(){

    },
    render:function(){
        var html="<label>"+this.model.structure.label+"</label><select>";
        _.each(this.model.structure.selections,function(elem){
            var selected="";
            if(this.model.container[this.model.structure.key]==elem.key)selected="selected";
            html+="<option "+selected+" value='"+elem.key+"'>"+elem.text+"</option>";
        });
        html=html+"</select>";
        jQuery(this.$el).html(html);
        return this;
    },
    fetchValue:function(){
        return jQuery(this.$el).find("select").val();
    }
});