<?php
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid
 */

class grid_style_editor
{
	public function run($grid_db)
	{
		if(isset($_POST) && !empty($_POST))
		{
			foreach($_POST['container_styles'] as $idx=>$data)
			{
				if(!isset($data['id']))
				{
					if(!empty($data['slug']) && !empty($data['style']))
					{
						$grid_db->createContainerStyle($data['slug'],$data['style']);
//						db_query("insert into {grid_container_style} (style,slug) values ('".$data['style']."','".$data['slug']."')");
					}
				}
				else
				{
					if(isset($data['delete']))
					{
						$grid_db->deleteContainerStyle($data['id']);
//						db_query("delete from {grid_container_style} where id=".$data['id']);
					}
					else
					{
						$grid_db->updateContainerStyle($data['id'],$data['slug'],$data['style']);
//						db_query("update {grid_container_style} set style='".$data['style']."', slug='".$data['slug']."' where id=".$data['id']);
					}
				}
			}
			foreach($_POST['slot_styles'] as $idx=>$data)
			{
				if(!isset($data['id']))
				{
					if(!empty($data['slug']) && !empty($data['style']))
					{
						$grid_db->createSlotStyle($data['slug'],$data['style']);
//						db_query("insert into {grid_slot_style} (style,slug) values ('".$data['style']."','".$data['slug']."')");
					}
				}
				else
				{
					if(isset($data['delete']))
					{
						$grid_db->deleteSlotStyle($data['id']);
//						db_query("delete from {grid_slot_style} where id=".$data['id']);
					}
					else
					{
						$grid_db->updateSlotStyle($data['id'],$data['slug'],$data['style']);
//						db_query("update {grid_slot_style} set style='".$data['style']."', slug='".$data['slug']."' where id=".$data['id']);
					}
				}
			}
			foreach($_POST['box_styles'] as $idx=>$data)
			{
				if(!isset($data['id']))
				{
					if(!empty($data['slug']) && !empty($data['style']))
					{
						$grid_db->createBoxStyle($data['slug'],$data['style']);
//						db_query("insert into {grid_box_style} (style,slug) values ('".$data['style']."','".$data['slug']."')");
					}
				}
				else
				{
					if(isset($data['delete']))
					{
						$grid_db->deleteBoxStyle($data['id']);
//						db_query("delete from {grid_box_style} where id=".$data['id']);
					}
					else
					{
						$grid_db->updateBoxStyle($data['id'],$data['slug'],$data['style']);
//						db_query("update {grid_box_style} set style='".$data['style']."', slug='".$data['slug']."' where id=".$data['id']);
					}
				}
			}
		}
		$styles=$grid_db->containerStyles();//db_query("select id,style,slug from {grid_container_style} order by id asc");
		ob_start();
?>
<style type="text/css">
	.grid-style-editor input[type=text]{
		width: 100%;
	}
</style>
<div class="grid-style-editor">
<form method="post">
<p>Container Styles</p>
<table>
<tr>
	<th>Slug</th>
	<th>Style</th>
	<th>Delete</th>
</tr>
<?php
	foreach($styles as $idx=>$style)
	{
?>
<tr>
	<td>
		<input type="hidden" name="container_styles[<?php echo $style->id?>][id]" value="<?php echo $style->id?>">
		<input class="form-text" name="container_styles[<?php echo $style->id;?>][slug]" type="text" value="<?php echo $style->slug;?>">
	</td>
	<td><input class="form-text" name="container_styles[<?php echo $style->id;?>][style]" type="text" value="<?php echo $style->style;?>"></td>
	<td><input type="checkbox" name="container_styles[<?php echo $style->id;?>][delete]" value="1"></td>
</tr>
<?php
	}
?>
<tr>
	<td><input class="form-text" name="container_styles[-1][slug]" type="text"></td>
	<td><input class="form-text" name="container_styles[-1][style]" type="text"></td>
	<td></td>
</tr>
</table>
<?php
	$styles=$grid_db->slotStyles();//db_query("select id,style,slug from {grid_slot_style} order by id asc");
?>
<p>Slot Styles</p>
<table>
<tr>
	<th>Slug</th>
	<th>Style</th>
	<th>Delete</th>
</tr>
<?php
	foreach($styles as $idx=>$style)
	{
?>
<tr>
	<td>
		<input type="hidden" name="slot_styles[<?php echo $style->id?>][id]" value="<?php echo $style->id?>">
		<input class="form-text" name="slot_styles[<?php echo $style->id;?>][slug]" type="text" value="<?php echo $style->slug;?>">
	</td>
	<td><input class="form-text" name="slot_styles[<?php echo $style->id;?>][style]" type="text" value="<?php echo $style->style;?>"></td>
	<td><input type="checkbox" name="slot_styles[<?php echo $style->id;?>][delete]" value="1"></td>
</tr>
<?php
	}
?>
<tr>
	<td><input class="form-text" name="slot_styles[-1][slug]" type="text"></td>
	<td><input class="form-text" name="slot_styles[-1][style]" type="text"></td>
	<td></td>
</tr>
</table>
<?php
	$styles=$grid_db->boxStyles();//db_query("select id,style,slug from {grid_box_style} order by id asc");
?>
<p>Box Styles</p>
<table>
<tr>
	<th>Slug</th>
	<th>Style</th>
	<th>Delete</th>
</tr>
<?php
	foreach($styles as $idx=>$style)
	{
?>
<tr>
	<td>
		<input type="hidden" name="box_styles[<?php echo $style->id?>][id]" value="<?php echo $style->id?>">
		<input class="form-text" name="box_styles[<?php echo $style->id;?>][slug]" type="text" value="<?php echo $style->slug;?>">
	</td>
	<td><input class="form-text" name="box_styles[<?php echo $style->id;?>][style]" type="text" value="<?php echo $style->style;?>"></td>
	<td><input type="checkbox" name="box_styles[<?php echo $style->id;?>][delete]" value="1"></td>
</tr>
<?php
	}
?>
<tr>
	<td><input class="form-text" name="box_styles[-1][slug]" type="text"></td>
	<td><input class="form-text" name="box_styles[-1][style]" type="text"></td>
	<td></td>
</tr>
</table>
<input class="form-submit" type="submit">
</form>
</div>
<?php
		$result=ob_get_contents();
		ob_end_clean();
		return $result;
	}
}