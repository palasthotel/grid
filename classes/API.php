<?php

namespace Palasthotel\Grid;

use grid_box;/**
 * Class API
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2020, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid
 *
 * @property Storage store
 *
 */
class API {

	const ALTER_BOX_CONTENT_STRUCTURE = "box_alter_content_structure";
	const FIRE_DID_RENDER_BOX = "did_render_box";
	const FIRE_DID_RENDER_CONTAINER = "did_render_container";
	const FIRE_DID_RENDER_GRID = "did_render_grid";
	const FIRE_WILL_RENDER_BOX = "will_render_box";
	const ALTER_CONFIGURATION_BOX_CONTENT_STRUCTURE = "configuration_box_alter_content_structure";
	const FIRE_WILL_RENDER_CONTAINER = "will_render_container";
	const FIRE_WILL_RENDER_GRID = "will_render_grid";
	const FIRE_WILL_RENDER_SLOT = "will_render_slot";
	const FIRE_DID_RENDER_SLOT = "did_render_slot";

	/**
	 * @var Core
	 */
	private $core;

	/**
	 * @var Endpoint
	 */
	private $endpoint;


	/**
	 * API constructor.
	 *
	 * @param Core $core
	 * @param Endpoint $endpoint
	 */
	public function __construct(Core $core, $endpoint)
	{
		$this->core = $core;

		$this->requireBoxes();

		$endpoint->storage = $this->core->storage;
		$endpoint->api = $this;

		$this->endpoint = $endpoint;
	}

	public function requireBoxes(){
		// ----------------------------------------
		// base components
		// ----------------------------------------
		require_once dirname( __FILE__ ) . '/../components/grid_grid.php';
		require_once dirname( __FILE__ ) . '/../components/grid_container.php';
		require_once dirname( __FILE__ ) . '/../components/grid_slot.php';
		require_once dirname( __FILE__ ) . '/../components/grid_box.php';

		// ----------------------------------------
		// box types
		// ----------------------------------------
		require_once dirname( __FILE__ ) . '/../components/grid_error_box.php';

		require_once dirname( __FILE__ ) . '/../components/grid_static_box.php';
		require_once dirname( __FILE__ ) . '/../components/grid_html_box.php';
		require_once dirname( __FILE__ ) . '/../components/grid_video_box.php';
		require_once dirname( __FILE__ ) . '/../components/grid_soundcloud_box.php';
		require_once dirname( __FILE__ ) . '/../components/grid_plaintext_box.php';

		require_once dirname( __FILE__ ) . '/../components/grid_list_box.php';
		require_once dirname( __FILE__ ) . '/../components/grid_rss_box.php';

		require_once dirname( __FILE__ ) . '/../components/grid_reference_box.php';

		require_once dirname( __FILE__ ) . '/../components/grid_structure_configuration_box.php';
		require_once dirname( __FILE__ ) . '/../components/grid_container_configuration_box.php';
		require_once dirname( __FILE__ ) . '/../components/grid_slot_configuration_box.php';
	}

	//manages ajax call routing
	public function handleAjaxCall()
	{
		header("Content-Type: application/json; charset=UTF-8");
		if($_SERVER['REQUEST_METHOD']!='POST')
		{
			echo json_encode(array('error'=>'only POSTing is allowed'));
		}
		else
		{
			$input=file_get_contents("php://input");
			$json=json_decode($input);
			$method=$json->method;
			$params=$json->params;

			$this->endpoint->storage=$this->core->storage;
			try {
				$reflectionMethod=new \ReflectionMethod($this->endpoint,$method);
				$retval=$reflectionMethod->invokeArgs($this->endpoint,$params);
				echo json_encode(array('result'=>$retval));
			} catch (\Exception $e) {
				echo json_encode(array('error'=>$e->getMessage()));
			}
		}
	}

	public function handleUpload()
	{
		$gridid=$_POST['gridid'];
		if(preg_match("/(container:|box:|)\\d*/uisx", $gridid)!==1) {
			return FALSE;
		}
		$containerid=intval($_POST['container']);
		$slotid=intval($_POST['slot']);
		$idx=intval($_POST['box']);
		$file=$_FILES['file']['tmp_name'];
		$original_filename=$_FILES['file']['name'];
		$key=$_POST['key'];
		$grid=$this->core->storage->loadGrid($gridid);
		foreach($grid->container as $container)
		{
			if($container->containerid==$containerid)
			{
				foreach($container->slots as $slot)
				{
					if($slot->slotid==$slotid)
					{
						$box=$slot->boxes[$idx];
						return $box->performFileUpload($key,$file,$original_filename);
					}
				}
			}
		}
		return FALSE;//array('result'=>FALSE,'error'=>'box or slot or container or grid not found','gridid'=>$gridid,'container'=>$containerid,'slotid'=>$slotid,'box'=>$idx);
	}

	public function getMetaTypes() {
		$classes=get_declared_classes();
		$metaboxes=array();
		foreach($classes as $class)
		{
			if(is_subclass_of($class, "grid_box" ))
			{
				/**
				 * @var grid_box $obj
				 */
				$obj=new $class();
				$obj->storage = $this->core->storage;
				if($obj->isMetaType())
				{
					$metaboxes[]=$obj;
				}
			}
		}
		return $metaboxes;
	}

}
