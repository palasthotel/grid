

boxEditorControls['list']=GridBackbone.View.extend({
    initialize:function(){

    },
    render:function(){
        var html="<label>"+this.model.structure.label+"</label>";
        var list=this.model.container[this.model.structure.key];
        var self=this;
        var views=[];
        _.each(list,function(elem){
            var view=new boxEditorControls['listitem']({
                model:{
                    structure:self.structure.contentstructure,
                    container:elem,
                    box:self.model.box,
                    parentpath:self.model.parentpath+self.structure.key+"."
                }
            });
            views.push(view);
            html+=view.render().el;
        });
        //TODO: add "add" button
        jQuery(this.$el).html(html);
        this.views=views;
        return this;
    },
    fetchValue:function(){
        var content=[];
        _.each(views,function(view){
            content.push(view.fetchValue());
        });
        return content;
    }
});

boxEditorControls['listitem']=GridBackbone.View.extend({
    initialize:function(){

    },
    render:function(){
        var fieldcontainer=jQuery("<div></div>");
        var views=[];
        _.each(this.model.structure,function(elem){
            var type=elem.type;
            var view=new boxEditorControls[type](
            {
                model:
                {
                    structure:elem,
                    container:this.model.get("content"),
                    box:self.model.box,
                    parentpath:self.model.parentpath
                }
            });
            views.push(view);
            fieldcontainer.append(view.render().el);
        });
        jQuery(this.$el).html(fieldcontainer);
        this.views=views;
        return this;
    },
    fetchValue:function(){
        var obj={};
        _.each(this.views,function(view){
            obj[view.model.structure.key]=view.fetchValue();
        });
        return obj;
    }
});