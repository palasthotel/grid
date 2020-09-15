<?php

namespace Palasthotel\Grid;

use Palasthotel\Grid\Constants\Hook;

/**
 * @property Editor editor
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2020, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid
 */

class ReuseBoxEditor
{

    public function __construct(Editor $editor){
        $this->editor = $editor;
    }

	public function getCSS($absolute=FALSE)
	{
		return $this->editor->getEditorCSS($absolute);
	}
	
	public function getJS($language='en',$absolute=FALSE)
	{
		return $this->editor->getEditorJS($language,$absolute);
	}
	
	public function run($grid_db,$editlinkfunction,$deletelinkfunction)
	{
		$grid=new Grid();
		$grid->storage=$this->editor->storage;
		$boxIds=$grid_db->getReuseableBoxIds();
		$usedIds=$grid_db->getReusedBoxIds();

		$boxIds = $grid_db->fireHookAlter(
			Hook::ALTER_REUSE_BOX_IDS,
			$boxIds
		);

		$boxes=array();
		foreach($boxIds as $boxid)
		{
			$box = $grid_db->loadReuseBox($boxid);
			$box->grid = $grid;
			$boxes[]=$box;
		}

		$grid->container=array();
		foreach($boxes as $box)
		{
			$container=new GridContainer();
			$container->storage=$grid_db;
			$container->type="c-1d1";
			$container->readmore=t("edit");
			$container->readmoreurl=$editlinkfunction($box->boxid);
			if(!in_array($box->boxid, $usedIds))
			{
				$container->epilog="<a href=\"".$deletelinkfunction($box->boxid)."\">delete</a>";
			}
			
			$container->slots=array();
			$container->slots[]=new GridSlot();
			$container->slots[0]->storage=$grid_db;
			$container->slots[0]->boxes=array();
			$container->slots[0]->boxes[]=$box;
			$grid->container[]=$container;
		}
		$html=$grid->render(TRUE);
		return "<div class='grid-reuse-box-list'>".$html."</div>";
	}
	
	public function runEditor($grid_db,$id,$ckeditor,$ajax,$debugmode,$preview)
	{
		return $this->editor->getEditorHTML(
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