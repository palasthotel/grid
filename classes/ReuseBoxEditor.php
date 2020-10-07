<?php

namespace Palasthotel\Grid;

use Palasthotel\Grid\Hook;
use Palasthotel\Grid\Model\Grid;
use Palasthotel\Grid\Model\Container;
use Palasthotel\Grid\Model\Slot;

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

	public function run($editlinkfunction,$deletelinkfunction)
	{
		$grid=new \grid_grid();
		$grid->storage=$this->editor->storage;
		$boxIds=$this->editor->storage->getReuseableBoxIds();
		$usedIds=$this->editor->storage->getReusedBoxIds();

		$boxIds = $this->editor->storage->fireHookAlter(
			Core::ALTER_REUSE_BOX_IDS,
			$boxIds
		);

		$boxes=array();
		foreach($boxIds as $boxid)
		{
			$box = $this->editor->storage->loadReuseBox($boxid);
			$box->grid = $grid;
			$boxes[]=$box;
		}

		$grid->container=array();
		foreach($boxes as $box)
		{
			$container=new \grid_container();
			$container->storage=$this->editor->storage;
			$container->type="c-1d1";
			$container->readmore=t("edit");
			$container->readmoreurl=$editlinkfunction($box->boxid);
			if(!in_array($box->boxid, $usedIds))
			{
				$container->epilog="<a href=\"".$deletelinkfunction($box->boxid)."\">delete</a>";
			}

			$container->slots=array();
			$container->slots[]=new \grid_slot();
			$container->slots[0]->storage=$this->editor->storage;
			$container->slots[0]->boxes=array();
			$container->slots[0]->boxes[]=$box;
			$grid->container[]=$container;
		}
		$html=$grid->render(TRUE);
		return "<div class='grid-reuse-box-list'>".$html."</div>";
	}

	public function runEditor( $id,$ckeditor,$ajax,$debugmode,$preview)
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