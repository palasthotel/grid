/**
* @author Palasthotel <rezeption@palasthotel.de>
* @copyright Copyright (c) 2014, Palasthotel
* @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
* @package Palasthotel\Grid
*/

import GridBackbone from 'backbone'

boxEditorControls['info']=GridBackbone.View.extend({
    className: "grid-editor-widget grid-editor-widget-info",
    initialize:function(){

    },
    render:function(){
        if ( null != this.model.structure.label ){
            jQuery(this.el).html("<label>"+this.model.structure.label+"</label><p class='info'>"+this.model.structure.text+"</p>");
        }
        else{
            jQuery(this.el).html("<p class='info'>"+this.model.structure.text+"</p>");
        }
        return this;
    },
    fetchValue:function(){
        return {};
    }
});
