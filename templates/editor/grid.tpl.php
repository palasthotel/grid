<?php
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid
 */
?>
<script src="https://cdn.ckeditor.com/4.15.0/standard/ckeditor.js"></script>
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
<script id="tpl_toolbar" type="text/x-icanhaz">
<?php require( 'ich.toolbar.html' ); ?>
</script>
<script id="tpl_toolContainers" type="text/x-icanhaz">
<?php require( "ich.toolContainers.html" ); ?>
</script>
<script id="tpl_toolContainersContainer" type="text/x-icanhaz">
<?php require( "ich.toolContainersContainer.html" ); ?>
</script>
<script id="tpl_toolBoxes" type="text/x-icanhaz">
<?php require( 'ich.toolBoxes.html' );?>
</script>
<script id="tpl_toolBoxesBlueprint" type="text/x-icanhaz">
<?php require( 'ich.toolBoxesBlueprint.html' );?>
</script>
<script id="tpl_grid" type="text/x-icanhaz">
<?php require( 'ich.grid.html' );?>
</script>
<script id="tpl_container" type="text/x-icanhaz">
<?php require( 'ich.container.html' );?>
</script>
<script id="tpl_containereditor" type="text/x-icanhaz">
<?php require( 'ich.containereditor.html' );?>
</script>
<script id="tpl_slot" type="text/x-icanhaz">
<?php require( 'ich.slot.html' );?>
</script>
<script id="tpl_slotstylechanger" type="text/x-icanhaz">
<?php require( 'ich.slotstylechanger.html' );?>
</script>
<script id="tpl_box" type="text/x-icanhaz">
<?php require( 'ich.box.html' );?>
</script>
<script id="tpl_boxeditor" type="text/x-icanhaz">
<?php require( 'ich.boxeditor.html' );?>
</script>
<script id="tpl_revisions" type="text/x-icanhaz">
<?php require( 'ich.revisions.html' );?>
</script>
<script id="tpl_authors" type="text/x-icanhaz">
<?php require( 'ich.authors.html' );?>
</script>
<script id="tpl_author" type="text/x-icanhaz">
<?php require( 'ich.author.html' );?>
</script>
<script id="tpl_loading" type="text/x-icanhaz">
<?php require( 'ich.loading.html' );?>
</script>

<div id="grid-authors-wrapper" class="grid-authors-wrapper"></div>
<div id="new-grid-wrapper" class="grid-all-wrapper"></div>
<div id="new-grid-editor-wrapper" class="grid-editor-wrapper"></div>
