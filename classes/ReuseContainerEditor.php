<?php

namespace Palasthotel\Grid;

use Palasthotel\Grid\Hook;
use Palasthotel\Grid\Model\Grid;
use Palasthotel\Grid\Model\Container;

/**
 * @property Editor $editor
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid
 */

class ReuseContainerEditor
{
	/**
	 * ReuseContainerEditor constructor.
	 *
	 * @param Editor $editor
	 */
    public function __construct($editor){
        $this->editor = $editor;
    }

	public function getCSS($absolute=FALSE)
	{

		return $this->editor->getEditorCSS($absolute);
	}

	public function getJS($language="en",$absolute=FALSE)
	{
		return $this->editor->getEditorJS($language,$absolute);
	}

  /**
   * @param Storage $storage
   * @param $editorlinkfunction
   * @param $deletelinkfunction
   *
   * @return string
   */
	public function run($storage,$editorlinkfunction,$deletelinkfunction)
	{

		$containerIds=$this->editor->storage->getReuseContainerIds();
		$containerIds = $storage->fireHookAlter(
		    Core::ALTER_REUSE_CONTAINER_IDS,
            $containerIds
        );
		$usedIds=$storage->getReusedContainerIds();

		$grid = new Grid();
		$grid->storage=$this->editor->storage;
		$grid->container=array();
		foreach($containerIds as $id)
		{
			/**
			 * load container from reuse container
			 */
			$container=$storage->loadReuseContainer($id);
			$container->grid=$grid;
			$container->classes[] = "grid-reuse-container";


			$edit=new \grid_container();
			$edit->grid=$grid;
			$edit->storage=$storage;
			$edit->type="c-1d1";
			$edit->readmore="edit";
			$edit->slots=array();
			$edit->prolog=$container->reusetitle;
			$edit->readmoreurl=$editorlinkfunction($id);
			$edit->classes[] = "grid-reuse-container-edit";
			if(!in_array($id, $usedIds))
			{
				$edit->epilog="<a class='btn-delete' href=\"".$deletelinkfunction($id)."\">delete</a>";
			}

			/**
			 * place to grid
			 * 1. reuse container with edit and container title
			 * 2. the original container to preview contents
			 */
			$grid->container[]=$edit;
			$grid->container[]=$container;

		}

		$grid = \grid_grid::build($grid);
		return "<div class='grid-reuse-container-list'>".$grid->render(TRUE)."</div>";
	}

	public function runEditor($id,$ckeditor,$ajax,$debugmode,$preview)
	{
		return $this->editor->getEditorHTML(
							"\"container:".$id."\"",
							"container",
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
			$grid_db->deleteReusableContainer($id);
			return TRUE;
		}
		ob_start();
?>
<form method="post">
<input type="hidden" name="grid_delete_id" value="<?php echo $id;?>">
<input type="submit" class="form-submit" value="Delete Container">
</form>
<?php
		$result=ob_get_contents();
		ob_end_clean();
		return $result;
	}
}
