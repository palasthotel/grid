/**
* @author Palasthotel <rezeption@palasthotel.de>
* @copyright Copyright (c) 2014, Palasthotel
* @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
* @package Palasthotel\Grid
*/

import _ from 'underscore'
import {initHTMLEditor} from "../utils";

window.GridContainerEditor = GridBackbone.View.extend({
    className: "grid-container-editor",
    events: {
        'click .grid-editor-controls [role=cancel]' : 'onCancel',
        'click .grid-editor-controls [role=save]' : 'onSave',
        'click .grid-editor-legend' : 'onToggle',
        'click .grid-editor-url-button': 'onUrlToggle'
    },
    initialize: function(){
    },
    render: function(){
        GRID.log(this.model.toJSON());
        var styles=GRID.getContainerStyles().toJSON();
        var self=this;
        _.each(styles,function(elem){
            if(elem.slug==self.model.get("style"))
                elem.selected="selected";
            else
                elem.selected="";
        });
        this.$el.html(ich.tpl_containereditor({
            'lang_values':document.lang_values,
            'model':this.model.toJSON(),
            'styles':styles
        }));

        initHTMLEditor(this.el.querySelector(".grid-editor-prolog")).then(editor=>this.prologEditor = editor);
        initHTMLEditor(this.el.querySelector(".grid-editor-epilog")).then(editor=>this.epilogEditor = editor);

        this.$el.find(".grid-collapsable-shown").addClass("grid-active");

        jQuery.each(this.$el.find(".grid-editor-url-input"), function(index, val) {
             var $url = jQuery(val);
             if($url.val() == ""){
                $url.siblings('button').trigger("click");
             }
        });

        return this;
    },

    onToggle:function(e)
    {
        jQuery(e.currentTarget).parent().toggleClass('grid-active');
    },

    onUrlToggle: function(e){
        var $parent = jQuery(e.target).parent();
        if($parent.hasClass('grid-editor-url-show')){
            $parent.find('input').attr("disabled","disabled").val("");
            $parent.find('button').html("Add link");
        } else {
            $parent.find('button').html("Delete Link");
            $parent.find('input').removeAttr('disabled');
        }
        jQuery(e.target).parent().toggleClass('grid-editor-url-show');
    },

    onCancel: function(){
        GRID.hideEditor(function(){
            jQuery(GRID.$root_editor).html("");
        });
    },

    onSave:function(e)
    {
        var class_prefix = ".grid-editor-";
        this.model.set('title',this.$el.find(class_prefix+"title").val());
        this.model.set('titleurl', this.$el.find(class_prefix+"titleurl").val());
        this.model.set('titleurltarget', "");

        this.model.set('prolog',this.prologEditor.getData());
        this.model.set('epilog',this.epilogEditor.getData());

        this.model.set('readmore', this.$el.find(class_prefix+"readmore").val());
        this.model.set('readmoreurl',this.$el.find(class_prefix+"readmoreurl").val());
        this.model.set('readmoreurltarget',"");

        this.model.set('style', this.$el.find(class_prefix+"style").val());
        this.model.set('style_label', jQuery(this.$el).find(class_prefix+"style option:selected").text());
        this.model.save();

        GRID.hideEditor(function(){
            GRID.$root_editor.html("");
        });
    }
});

