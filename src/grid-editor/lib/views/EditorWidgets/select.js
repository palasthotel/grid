/**
* @author Palasthotel <rezeption@palasthotel.de>
* @copyright Copyright (c) 2014, Palasthotel
* @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
* @package Palasthotel\Grid
*/

import _ from 'underscore'

boxEditorControls['select']=GridBackbone.View.extend({
    className: "grid-editor-widget grid-editor-widget-select",
    initialize:function(){

    },
    render:function(){

        const structure = this.model.structure;
        const container = this.model.container;

        console.debug(structure, container)

        const isMultiple = (typeof structure.multiple !== typeof undefined && structure.multiple);
        const values = container[structure.key];
        const hasMultipleValues = (typeof values === typeof []);
        const selections = structure.selections;

        const multiple = (isMultiple)? "multiple='multiple'": "";
        const size = (!isMultiple || selections.size < 8)? "": (selections.length < 12)? "size='6'": "size='8'";

        let html="<label>"+this.model.structure.label+"</label><select "+multiple+" "+size+">";
        _.each(selections,function(elem){
            var selected="";
            if(
                (!hasMultipleValues && `${values}` === `${elem.key}`)
                ||
                (hasMultipleValues && _.indexOf(values, elem.key) > -1)
            ) selected="selected";

            html+="<option "+selected+" value='"+elem.key+"'>"+elem.text+"</option>";
        });
        html=html+"</select>";
        jQuery(this.el).html(html);
        return this;
    },
    fetchValue:function(){
        return jQuery(this.$el).find("select").val();
    }
});