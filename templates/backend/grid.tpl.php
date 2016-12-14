<?php
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid
 */
?>

<script type="text/javascript">
	document.ID=<?php echo $grid_id;?>;
	document.gridmode="<?php echo $grid_mode;?>";
	document.PathToConfig="<?php echo $pathToCKEditorConfig;?>";
	document.gridajax="<?php echo $ajaxendpoint;?>";
	document.previewurl="<?php echo $preview_url;?>";
	document.previewpattern="<?php echo $preview_pattern;?>";
	document.grid_debug_mode=<?php echo json_encode($debug_mode); ?>;
	document.grid = {};
	document.grid.async = {};
	document.grid.async.service = "<?php echo $async_service; ?>";
	document.grid.async.domain = "<?php echo $async_domain; ?>";
	document.grid.async.author = "<?php echo $async_author; ?>";
	document.grid.async.path = "<?php echo $async_path; ?>";
	document.grid.async.timeout = <?php echo $async_timeout; ?>;
</script>

<div id="grid-app"></div>
