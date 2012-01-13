$(function(){
  
  /* Make Regions within the Grid sortable */
  $( "#sortable1, #sortable2, #sortable3" ).sortable({
  			connectWith: ".connectedSortable"
  		}).disableSelection();
  		
  /* React on a Drag'n'Drop of a container */	
  $( "#sortable1, #sortable2, #sortable3" ).bind( "sortupdate", function(event, ui) {
      $("#grid .region .container").each(function(index){
          var old_meta_id = $(this).attr("meta-id");
          var new_meta_key = "grid_region_"+$(this).parent().attr("meta-region")+"_container_"+index+"_"+$(this).attr("meta-type");
          console.log(old_meta_id + " " +new_meta_key);
          jQuery.ajax('http://anmutunddemut.de?debug=true&meta-id='+old_meta_id+'&meta-key='+new_meta_key);
          
      });
      
  });

});
