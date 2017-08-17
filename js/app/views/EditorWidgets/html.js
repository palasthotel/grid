/**
* @author Palasthotel <rezeption@palasthotel.de>
* @copyright Copyright (c) 2014, Palasthotel
* @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
* @package Palasthotel\Grid
*/

boxEditorControls['html']=GridBackbone.View.extend({
    className: "grid-editor-widget grid-editor-widget-html",
    initialize:function(){

    },
    render:function(){
        var text=this.model.container[this.model.structure.key];
        if(!text)text="";
        this.$el.html("<label>"+this.model.structure.label+"</label><textarea name='"+this.cid+"' class='dynamic-value form-html'>"+text.replace(/\'/g, "&#39;")+"</textarea>");
        return this;
    },
    fetchValue:function(){
        return CKEDITOR.instances[this.cid].getData();
    }
});
