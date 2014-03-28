boxEditorControls['wp-mediaselect']=GridBackbone.View.extend({
    events:{
        "click .upload_image_button": "open_wp_media"
    },
    initialize:function(){
        GRID.log(this);	
    },
    render:function(){
        this.custom_file_frame;

         this.$el.append('<input type="button" class="upload_image_button"  value="upload" />')

        return this;
    },
    open_wp_media: function(){
        event.preventDefault();
        //If the frame already exists, reopen it
        if (typeof(this.custom_file_frame)!=="undefined") {
         this.custom_file_frame.close();
        }

        //Create WP media frame.
        this.custom_file_frame = wp.media.frames.customHeader = wp.media({
         //Title of media manager frame
         title: "Sample title of WP Media Uploader Frame",
         library: {
            type: 'image'
         },
         button: {
            //Button text
            text: "insert text"
         },
         //Do not allow multiple files, if you want multiple, set true
         multiple: false
        });
        //callback for selected image
      this.custom_file_frame.on('select', function() {
         var attachment = custom_file_frame.state().get('selection').first().toJSON();
         //do something with attachment variable, for example attachment.filename
         //Object:
         //attachment.alt - image alt
         //attachment.author - author id
         //attachment.caption
         //attachment.dateFormatted - date of image uploaded
         //attachment.description
         //attachment.editLink - edit link of media
         //attachment.filename
         //attachment.height
         //attachment.icon - don't know WTF?))
         //attachment.id - id of attachment
         //attachment.link - public link of attachment, for example ""http://site.com/?attachment_id=115""
         //attachment.menuOrder
         //attachment.mime - mime type, for example image/jpeg"
         //attachment.name - name of attachment file, for example "my-image"
         //attachment.status - usual is "inherit"
         //attachment.subtype - "jpeg" if is "jpg"
         //attachment.title
         //attachment.type - "image"
         //attachment.uploadedTo
         //attachment.url - http url of image, for example "http://site.com/wp-content/uploads/2012/12/my-image.jpg"
         //attachment.width
      });
 
      //Open modal
      this.custom_file_frame.open();
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