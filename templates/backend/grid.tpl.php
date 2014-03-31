<script type="text/javascript">
document.ID=<?php echo $grid_id;?>;
document.gridmode="<?php echo $grid_mode;?>";
document.PathToConfig="<?php echo $pathToCKEditorConfig;?>";
document.gridajax="<?php echo $ajaxendpoint;?>";
document.previewurl="<?php echo $preview_url;?>";
document.previewpattern="<?php echo $preview_pattern;?>";
document.grid_debug_mode=<?php echo json_encode($debug_mode); ?>;
</script>
<script id="tpl_toolbar" type="text/grid-icanhaz">
<?php require('ich.toolbar.html'); ?>
</script>
<script id="tpl_toolContainers" type="text/grid-icanhaz">
<?php require("ich.toolContainers.html"); ?>
</script>
<script id="tpl_toolContainersContainer" type="text/grid-icanhaz">
<?php require("ich.toolContainersContainer.html"); ?>
</script>
<script id="tpl_toolBoxes" type="text/grid-icanhaz">
<?php require('ich.toolBoxes.html');?>
</script>
<script id="tpl_toolBoxBlueprint" type="text/grid-icanhaz">
<?php require('ich.toolBoxBlueprint.html');?>
</script>
<script id="tpl_grid" type="text/grid-icanhaz">
<?php require('ich.grid.html');?>
</script>
<script id="tpl_container" type="text/grid-icanhaz">
<?php require('ich.container.html');?>
</script>
<script id="tpl_containerEditor" type="text/grid-icanhaz">
<?php require('ich.containerEditor.html');?>
</script>
<script id="tpl_slot" type="text/grid-icanhaz">
<?php require('ich.slot.html');?>
</script>
<script id="tpl_slotstylechanger" type="text/grid-icanhaz">
<?php require('ich.slotstylechanger.html');?>
</script>
<script id="tpl_box" type="text/grid-icanhaz">
<?php require('ich.box.html');?>
</script>
<script id="tpl_boxeditor" type="text/grid-icanhaz">
<?php require('ich.boxeditor.html');?>
</script>
<script id="tpl_revisions" type="text/grid-icanhaz">
<?php require('ich.revisions.html');?>
</script>

<div id="new-grid-wrapper" class="grid-all-wrapper"></div>
<div id="new-grid-boxeditor" class="grid-boxeditor"></div>
