<?php
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid
 */

class grid_reuse_box_editor
{
	public function getCSS($absolute=FALSE)
	{
		$lib=new grid_library();
		return $lib->getEditorCSS($absolute);
	}
	
	public function getJS($language='en',$absolute=FALSE)
	{
		$lib=new grid_library();
		return $lib->getEditorJS($language,$absolute);
	}
	
	public function run($grid_db,$editlinkfunction,$deletelinkfunction)
	{
		$usedIds=$grid_db->getReusedBoxIds();
		$boxids=$grid_db->getReuseableBoxIds();
		$boxes=array();
		foreach($boxids as $boxid)
		{
			$boxes[]=$grid_db->loadReuseBox($boxid);
		}
		$grid=new grid_grid();
		$grid->storage=$grid_db;
		$grid->container=array();
		foreach($boxes as $box)
		{
			$container=new grid_container();
			$container->storage=$grid_db;
			$container->type="C-12";
			$container->stype="container";
			$container->readmore=t("edit");
			$container->readmoreurl=$editlinkfunction($box->boxid);
			if(!in_array($box->boxid, $usedIds))
			{
				$container->epilog="<a href=\"".$deletelinkfunction($box->boxid)."\">delete</a>";
			}
			
			$container->slots=array();
			$container->slots[]=new grid_slot();
			$container->slots[0]->storage=$grid_db;
			$container->slots[0]->boxes=array();
			$container->slots[0]->boxes[]=$box;
			$grid->container[]=$container;
		}
		$html=$grid->render(TRUE);
		return $html;
	}
	
	public function runEditor($grid_db,$id,$ckeditor,$ajax,$debugmode,$preview)
	{
		$grid_lib=new grid_library();
		return $grid_lib->getEditorHTML(
			"\"box:".$id."\"",
			"box",
			$ckeditor,
			$ajax,
			$debugmode,
			$preview,
			'');
	}
	
	public function runDelete($grid_db,$id)
	{
		if(isset($_POST) && !empty($_POST) && $_POST['grid_delete_id']==$id)
		{
			$grid_db->deleteReusableBox($id);
			return TRUE;
		}
		ob_start();
?>
<form method="post">
<input type="hidden" name="grid_delete_id" value="<?php echo $id;?>">
<input type="submit" class="form-submit" value="Delete Box">
</form>
<?php
		$result=ob_get_contents();
		ob_end_clean();
		return $result;
	}
}