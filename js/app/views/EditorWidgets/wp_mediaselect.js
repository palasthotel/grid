boxEditorControls['wp-mediaselect']=GridBackbone.View.extend({
    events:{
        "click .upload_image_button": "open_wp_media"
    },
    initialize:function(){
        GRID.log(this);	
    },
    render:function(){
        this.custom_file_frame;

        var element = this.model.structure;
        var c_val = this.model.container[element.key];
        
        this.$el.append("<label>"+element.label+"</label>");
        this.$upload_btn = jQuery("<button class='upload_image_button'>Upload</button>");

        this.$el.append(this.$upload_btn);

        this.$input = $("<input />")
                    .attr('value', JSON.stringify(c_val))
                    .attr('type', 'hidden')
                    .addClass('dynamic-value form-json')
                    .attr("data-path",this.model.parentpath+element.key)
                    .attr('data-key', element.key);
        this.$el.append(this.$input);

        return this;
                        $select_image_size = $("<select class='image-sizes'></select>");
                        $dynamic_field.append($select_image_size);
                        wp_buildImageSizeSelect(c_val, $input);
                        $select_image_size.on("change",function(){
                            $this = $(this);
                            json = JSON.parse($this.siblings('.dynamic-value').val());
                            json.size = $this.val();
                            $this.siblings('.dynamic-value').val(JSON.stringify(json));
                        });



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
            console.log("close");
            // get selections and save to hidden input plus other AJAX stuff etc.
            var selection = frame.state().get('selection');
            jQuery.each(frame.state().get('selection')._byId, function(id, val) {
                var r_json = {
                    "id": val.id,
                    "size": "full",
                    "sizes": val.attributes.sizes
                };
                console.log(r_json);
                self.$input.val(JSON.stringify(r_json));
                //wp_buildImageSizeSelect(r_json, $button.siblings('.dynamic-value'));
                return false;
            });
        });
        frame.open();
        return false;
    },
    // buildImageSizeSelect: function(){
    //     var $dynamic_input = this.$input;
    //     var json = JSON.parse(this.$input.val());
    //     if(typeof json.sizes != "object"){
    //         this.$select_image_size.hide();
    //         return;
    //     }
    //     $.each(json.sizes, function(index, size) {
    //          selected = "";
    //          if(json.size == index){
    //             selected = "selected='selected'";
    //          }
    //          jQuery("<option "+selected+" >"+index+"</option>").
    //          attr('value', index).appendTo($select_image_size);
    //     });
    //     if($select_image_size.children().length > 0){ 
    //         $select_image_size.show();
    //     } else {
    //         $select_image_size.hide();
    //     }
    // },
    fetchValue:function(){
        return 42;
    }
});