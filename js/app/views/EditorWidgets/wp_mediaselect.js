/**
* @author Palasthotel <rezeption@palasthotel.de>
* @copyright Copyright (c) 2014, Palasthotel
* @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
* @package Palasthotel\Grid
*/

boxEditorControls['wp-mediaselect']=GridBackbone.View.extend({
    className: "grid-editor-widget grid-editor-widget-wp-mediaselect",
    events:{
        "click .upload_image_button": "open_wp_media"
    },
    initialize:function(){
    },
    render:function(){

        var element = this.model.structure;
        var c_val = this.model.container[element.key];;
        this.$el.append("<label>"+element.label+"</label>");
        this.$upload_btn = jQuery("<button class='upload_image_button'>Upload</button>");

        this.$el.append(this.$upload_btn);

        this.$input = jQuery("<input />")
                    .attr('value', JSON.stringify(c_val) )
                    .attr('type', 'hidden')
                    .addClass('dynamic-value form-json')
                    .attr("data-path",this.model.parentpath+element.key)
                    .attr('data-key', element.key);
        this.$el.append(this.$input);
        
        this.$select_image_size = jQuery("<select class='image-sizes'></select>");
        this.$el.append(this.$select_image_size);

        this.$select_image_size.on("change",function(){
            $this = jQuery(this);
            json = JSON.parse($this.siblings('.dynamic-value').val());
            json.size = $this.val();
            $this.siblings('.dynamic-value').val(JSON.stringify(json));
        });

        this.buildImageSizeSelect();

        return this;
    },
    open_wp_media: function(){
        var self = this;
        var frame = wp.media({
            //title : lang_values['title-wp-media'],
            multiple : false,
            library : { type : 'image'},
            button : { text : "upload image" },
        });
        frame.on('open',function() {
            var selection = frame.state().get('selection');
            val = JSON.parse(self.$input.val());
            attachment = wp.media.attachment(val.id);
            selection.add( attachment ? [ attachment ] : [] );                          
        });
        frame.on('close',function() {
            var selection = frame.state().get('selection');            
            jQuery.each(frame.state().get('selection')._byId, function(id, val) {
                var sizes = val.get("sizes");
                if(typeof sizes == "undefined"){
                    sizes = {
                        full: {
                            height: "",
                            width: "",
                            url: val.get("url"),
                            orientation: ""
                        }
                    };
                }
                var r_json = {
                    id: val.id,
                    size: "full",
                    sizes: sizes
                };
                self.$input.val(JSON.stringify(r_json));
                self.buildImageSizeSelect();
                return false;
            });
        });
        frame.open();
        return false;
    },
    buildImageSizeSelect: function(){
        var self = this;
        var $dynamic_input = this.$input;
        if(this.$input.val() == ""){
            return;
        } 
        GRID.log(this.$input.val());
        var json = null;
        if(this.$input.val() != "object"){
            json = JSON.parse(this.$input.val());
        } else {
            json =this.$input.val();
        }
        
        if(typeof json.sizes != "object"){
            this.$select_image_size.hide();
            return;
        }
        this.$select_image_size.empty();
        jQuery.each(json.sizes, function(index, size) {
             selected = "";
             if(json.size == index){
                selected = "selected='selected'";
             }
             jQuery("<option "+selected+" >"+index+"</option>").
             attr('value', index).appendTo(self.$select_image_size);
        });
        if(this.$select_image_size.children().length > 0){ 
            this.$select_image_size.show();
        } else {
            this.$select_image_size.hide();
        }
    },
    fetchValue:function(){
        return JSON.parse(this.$input.val());
    }
});