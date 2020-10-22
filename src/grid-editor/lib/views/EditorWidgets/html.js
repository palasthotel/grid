/**
* @author Palasthotel <rezeption@palasthotel.de>
* @copyright Copyright (c) 2014, Palasthotel
* @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
* @package Palasthotel\Grid
*/

import {initHTMLEditor} from "../../utils";

boxEditorControls['html']=GridBackbone.View.extend({
    className: "grid-editor-widget grid-editor-widget-html",
    render:function(){
        const text=this.model.container[this.model.structure.key] || "";
        this.$el.html(
            "<label>"+this.model.structure.label+"</label>"+
            "<textarea name='"+this.cid+"' class='dynamic-value form-html'>"+text.replace(/\'/g, "&#39;")+"</textarea>"
        );
        initHTMLEditor(this.el.querySelector(".form-html")).then(editor=>{
            this.editor = editor;
        })

        return this;
    },
    fetchValue:function(){
        return this.editor.getData();
    }
});
