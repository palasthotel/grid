$(function() {
	$( "#sortable1, #sortable2" ).sortable({
		connectWith: ".connectedSortable"
	}).disableSelection();
	
	$(function() {
			$( "#tabs" ).tabs();
		});
	
	
});