$(function() {
	$( ".boxlist" ).sortable({
		connectWith: ".connectedSortable"
	}).disableSelection();
	
	$(function() {
			$( "#tabs" ).tabs();
		});
	
	$(function() {
			$( ".boxadder" ).hide();
	});
	
	
	$(function() {
			$("#addbox").bind("click", function( event ) {
			      event.preventDefault(); // prevent default handling
			      // do the action 
			     $( ".boxadder" ).show();
			});
	});
	
	$(function() {
			$("#hideboxes").bind("click", function( event ) {
			      event.preventDefault(); // prevent default handling
			      // do the action 		
			     $( ".box" ).hide();
			});
	});
	
	
	$(function() {
			$("#addcontainer").bind("click", function( event ) {
			      event.preventDefault(); // prevent default handling
			      // do the action 
			     $(".grid").prepend('<div class="container container-troika"><h2><a href="#containertitleurl" class="container-title">container 1 – Topics – Title</a></h2><div id="sortable3" class="boxlist connectedSortable"></div></div>');
					 $( ".boxlist" ).sortable({
							connectWith: ".connectedSortable"
						}).disableSelection();
			});
	});
	
	
	
});