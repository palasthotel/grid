<?php
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid
 */
?>

<script type="text/javascript">
	
	window.grid = {
		ID: <?php echo $grid_id;?>,
		mode: "<?php echo $grid_mode;?>",
		debug: <?php echo ($debug_mode == "on")? "true": "false"; ?>,
		path_to_config: "<?php echo $pathToCKEditorConfig;?>",
		endpoint: "<?php echo $ajaxendpoint;?>",
		preview: {
			url: "<?php echo $preview_url;?>",
			pattern: "<?php echo $preview_pattern;?>",
		},
		async: {
			service: "<?php echo $async_service; ?>",
			domain: "<?php echo $async_domain; ?>",
			author: "<?php echo $async_author; ?>",
			path: "<?php echo $async_path; ?>",
			timeout: <?php echo $async_timeout; ?>,
		},
		
		// component injections
		plugins:[],
		editor_widgets:[],
		
	};
	
</script>

<div id="grid-app"></div>
