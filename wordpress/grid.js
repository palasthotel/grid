jQuery(function() {

    /* Make Regions within the Grid sortable */
    jQuery("#gridsortable1, #gridsortable2, #gridsortable3").sortable({
        connectWith: ".connectedGridSortable"
    }).disableSelection();

    /* React on a Drag'n'Drop of a container */
    jQuery("#gridsortable1, #gridsortable2, #gridsortable3").bind("sortupdate",
    function(event, ui) {
        jQuery("#grid .region .container").each(function(index) {
            var old_meta_id = jQuery(this).attr("meta-id");
            var new_meta_key = "_grid_region_" + jQuery(this).parent().attr("meta-region") + "_container_" + index + "_" + jQuery(this).attr("meta-type");
            console.log("Hit: " + old_meta_id + " " + new_meta_key);
            var data = {
                action: 'grid_move_widget',
                old_meta_id: old_meta_id,
                new_meta_key: new_meta_key
            };

            // since 2.8 ajaxurl is always defined in the admin header and points to admin-ajax.php
            jQuery.post(ajaxurl, data,
            function(response) {
                //alert('Got this from the server: ' + response);
            });
            

        });

    });



});
