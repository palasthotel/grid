/**
* @author Palasthotel <rezeption@palasthotel.de>
* @copyright Copyright (c) 2014, Palasthotel
* @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
* @package Palasthotel\Grid
*/

import GridBackbone from 'backbone'

boxEditorControls['text']=GridBackbone.View.extend({
    className: "grid-editor-widget grid-editor-widget-text",
    initialize:function(){

    },
    render:function(){
        this.$el.empty();

        this.$el.append( jQuery("<label/>").text(this.model.structure.label) );
        this.$el.append(
            jQuery("<input type=text class='dynamic-value'/>")
            .val(this.model.container[this.model.structure.key] || "")
        );

        return this;
    },
    fetchValue:function(){
        return jQuery(this.$el).find("input").val();
    }
});