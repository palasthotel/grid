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
        var c_val = this.model.container[element.key];
        this.$el.append("<label>"+element.label+"</label>");

	    /**
	     * show preview of image
	     */
	    this.$img_wrapper = $("<div></div>");
	    this.$img_wrapper.addClass("wp-mediaselect-image-wrapper");
	    this.$el.append(this.$img_wrapper);

	    /**
	     * upload button
	     */
        this.$upload_btn = jQuery("<button class='upload_image_button'>Upload</button>");
        this.$el.append(this.$upload_btn);

	    /**
	     * hidden input with saved values
	     */
        this.$input = jQuery("<input />")
                    .attr('value', JSON.stringify(c_val) )
                    .attr('type', 'hidden')
                    .addClass('dynamic-value form-json')
                    .attr("data-path",this.model.parentpath+element.key)
                    .attr('data-key', element.key);
        this.$el.append(this.$input);

	    /**
	     * available sizes select
	     */
        this.$select_image_size = jQuery("<select class='image-sizes'></select>");
        this.$el.append(this.$select_image_size);

        this.$select_image_size.on("change",function(){
            var $this = jQuery(this);
            var json = JSON.parse($this.siblings('.dynamic-value').val());
            json.size = $this.val();
            $this.siblings('.dynamic-value').val(JSON.stringify(json));
        });

        this.buildImageSizeSelect();

	    this.buildImagePreview();

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
	            self.buildImagePreview();
                return false;
            });
        });
        frame.open();
        return false;
    },
	get_json_from_input: function(){
		var json = null;
		if(this.$input.val() != "object"){
            console.log(json);
            try{
                json = JSON.parse(this.$input.val());
            } catch(e){
                json = null;
            }
		} else {
			json =this.$input.val();
		}
		return json;
	},
	buildImagePreview: function(){

		var json = this.get_json_from_input();

		console.log(json);

        if( json == null
	        || json == ''
			|| typeof json != typeof {}
			|| typeof json.sizes != typeof {}
			|| typeof json.sizes.thumbnail != typeof {}
			|| typeof json.sizes.thumbnail.url != typeof ""
        ) {
            return;
        }

        var $img = $("<img/>");
        $img
            .addClass("wp-mediaselect-image-preview")
            .attr("src", json.sizes.thumbnail.url)
            .attr("width", json.sizes.thumbnail.width)
            .attr("height",json.sizes.thumbnail.height);
        this.$img_wrapper.empty();
        this.$img_wrapper.append($img);


	},
    buildImageSizeSelect: function(){
        var self = this;

        if(this.$input.val() == ""){
            return;
        } 
        var json = this.get_json_from_input();
        
        if( json == null
			|| json == ''
			|| typeof json != typeof {}
			|| typeof json.sizes != typeof {} )
        {
            this.$select_image_size.hide();
            return;
        }

        this.$select_image_size.empty();
        jQuery.each(json.sizes, function(index, size) {
             var selected = "";
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
	    var value = "";
	    try{
		    value = JSON.parse(this.$input.val());
	    } catch(e){
		    GRID.log("empty image box");
	    }
        return value;
    }
});