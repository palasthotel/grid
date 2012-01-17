jQuery(function(){
  
  /* Make Regions within the Grid sortable */
  jQuery( "#gridsortable1, #gridsortable2, #gridsortable3" ).sortable({
  			connectWith: ".connectedGridSortable"
  		}).disableSelection();
  		
  /* React on a Drag'n'Drop of a container */	
  jQuery( "#gridsortable1, #gridsortable2, #gridsortable3" ).bind( "sortupdate", function(event, ui) {
      jQuery("#grid .region .container").each(function(index){
          var old_meta_id = jQuery(this).attr("meta-id");
          var new_meta_key = "grid_region_"+$(this).parent().attr("meta-region")+"_container_"+index+"_"+$(this).attr("meta-type");
          console.log("Hit: " + old_meta_id + " " +new_meta_key);
          /*jQuery.ajax('http://anmutunddemut.de?debug=true&meta-id='+old_meta_id+'&meta-key='+new_meta_key);*/
          
      });
      
  });

});
