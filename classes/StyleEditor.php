<?php
namespace Palasthotel\Grid;
/**
 * @property Storage $storage
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2020, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid
 */

class StyleEditor {

	/**
	 * StyleEditor constructor.
	 *
	 * @param Storage $storage
	 */
    public function __construct(Storage $storage){
        $this->storage = $storage;
    }

	public function run()
	{
		if(isset($_POST) && !empty($_POST))
		{
			foreach($_POST['container_styles'] as $idx=>$data)
			{
				if(!isset($data['id']))
				{
					if(!empty($data['slug']) && !empty($data['style']))
					{
						$this->storage->createContainerStyle($data['slug'],$data['style']);
					}
				}
				else
				{
					if(isset($data['delete']))
					{
						$this->storage->deleteContainerStyle($data['id']);
					}
					else
					{
						$this->storage->updateContainerStyle($data['id'],$data['slug'],$data['style']);
					}
				}
			}
			foreach($_POST['slot_styles'] as $idx=>$data)
			{
				if(!isset($data['id']))
				{
					if(!empty($data['slug']) && !empty($data['style']))
					{
						$this->storage->createSlotStyle($data['slug'],$data['style']);
					}
				}
				else
				{
					if(isset($data['delete']))
					{
						$this->storage->deleteSlotStyle($data['id']);
					}
					else
					{
						$this->storage->updateSlotStyle($data['id'],$data['slug'],$data['style']);
					}
				}
			}
			foreach($_POST['box_styles'] as $idx=>$data)
			{
				if(!isset($data['id']))
				{
					if(!empty($data['slug']) && !empty($data['style']))
					{
						$this->storage->createBoxStyle($data['slug'],$data['style']);
					}
				}
				else
				{
					if(isset($data['delete']))
					{
						$this->storage->deleteBoxStyle($data['id']);
					}
					else
					{
						$this->storage->updateBoxStyle($data['id'],$data['slug'],$data['style']);
					}
				}
			}
		}
		$styles=$this->storage->containerStyles();
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
	<th>Style label</th>
	<th>Delete</th>
</tr>
<?php
	foreach($styles as $idx=>$style)
	{
?>
<tr>
	<td>
		<input type="hidden" name="container_styles[<?php echo $style->id?>][id]" value="<?php echo $style->id?>" />
		<input class="form-text" name="container_styles[<?php echo $style->id;?>][slug]" type="text" value="<?php echo $style->slug;?>" maxlength="190" />
	</td>
	<td><input class="form-text" name="container_styles[<?php echo $style->id;?>][style]" type="text" value="<?php echo $style->style;?>"/></td>
	<td><input type="checkbox" name="container_styles[<?php echo $style->id;?>][delete]" value="1" /></td>
</tr>
<?php
	}
?>
<tr>
	<td><input class="form-text" name="container_styles[-1][slug]" type="text" maxlength="190" /></td>
	<td><input class="form-text" name="container_styles[-1][style]" type="text"/></td>
	<td></td>
</tr>
</table>
<?php
	$styles=$this->storage->slotStyles();//db_query("select id,style,slug from {grid_slot_style} order by id asc");
?>
<p>Slot Styles</p>
<table>
<tr>
	<th>Slug</th>
	<th>Style label</th>
	<th>Delete</th>
</tr>
<?php
	foreach($styles as $idx=>$style)
	{
?>
<tr>
	<td>
		<input type="hidden" name="slot_styles[<?php echo $style->id?>][id]" value="<?php echo $style->id?>" />
		<input class="form-text" name="slot_styles[<?php echo $style->id;?>][slug]" type="text" value="<?php echo $style->slug;?>" maxlength="190" />
	</td>
	<td><input class="form-text" name="slot_styles[<?php echo $style->id;?>][style]" type="text" value="<?php echo $style->style;?>" /></td>
	<td><input type="checkbox" name="slot_styles[<?php echo $style->id;?>][delete]" value="1" /></td>
</tr>
<?php
	}
?>
<tr>
	<td><input class="form-text" name="slot_styles[-1][slug]" type="text" maxlength="190" /></td>
	<td><input class="form-text" name="slot_styles[-1][style]" type="text" /></td>
	<td></td>
</tr>
</table>
<?php
	$styles=$this->storage->boxStyles();//db_query("select id,style,slug from {grid_box_style} order by id asc");
?>
<p>Box Styles</p>
<table>
<tr>
	<th>Slug</th>
	<th>Style label</th>
	<th>Delete</th>
</tr>
<?php
	foreach($styles as $idx=>$style)
	{
?>
<tr>
	<td>
		<input type="hidden" name="box_styles[<?php echo $style->id?>][id]" value="<?php echo $style->id?>" />
		<input class="form-text" name="box_styles[<?php echo $style->id;?>][slug]" type="text" value="<?php echo $style->slug;?>" maxlength="190" />
	</td>
	<td><input class="form-text" name="box_styles[<?php echo $style->id;?>][style]" type="text" value="<?php echo $style->style;?>" /></td>
	<td><input type="checkbox" name="box_styles[<?php echo $style->id;?>][delete]" value="1" /></td>
</tr>
<?php
	}
?>
<tr>
	<td><input class="form-text" name="box_styles[-1][slug]" type="text" maxlength="190" /></td>
	<td><input class="form-text" name="box_styles[-1][style]" type="text" /></td>
	<td></td>
</tr>
</table>
<input class="form-submit" type="submit" />
</form>
</div>
<?php
		$result=ob_get_contents();
		ob_end_clean();
		return $result;
	}
}