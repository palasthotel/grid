<?php

namespace Palasthotel\Grid;

use grid_box;
use grid_grid;

/**
 * Class API
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2020, Palasthotel
 * @license GPL-3.0-or-later https://www.gnu.org/licenses/gpl-3.0.html
 * @package Palasthotel\Grid
 *
 */
class API {

	const ALTER_BOX_CONTENT_STRUCTURE = "box_alter_content_structure";
	const FIRE_DID_RENDER_BOX = "did_render_box";
	const FIRE_DID_RENDER_CONTAINER = "did_render_container";
	const FIRE_DID_RENDER_GRID = "did_render_grid";
	const FIRE_WILL_RENDER_BOX = "will_render_box";
	const ALTER_CONFIGURATION_BOX_CONTENT_STRUCTURE = "configuration_box_alter_content_structure";
	const ALTER_SOUNDCLOUD_USER_AGENT = "soundcloud_user_agent";
	const FIRE_WILL_RENDER_CONTAINER = "will_render_container";
	const FIRE_WILL_RENDER_GRID = "will_render_grid";
	const FIRE_WILL_RENDER_SLOT = "will_render_slot";
	const FIRE_DID_RENDER_SLOT = "did_render_slot";
  const FIRE_WILL_PERFORM_FILE_UPLOAD = "will_perform_file_upload";
  const FIRE_DID_PERFORM_FILE_UPLOAD = "did_perform_file_upload";


  /**
	 * @var Core
	 */
	private $core;

	/**
	 * @var Endpoint
	 */
	private $endpoint;

	/**
	 * @var iTemplate
	 */
	private static $template;
	public static function template(): iTemplate {
		return self::$template;
	}

	/**
	 * API constructor.
	 *
	 * @param Core $core
	 * @param Endpoint $endpoint
	 * @param iTemplate $template
	 */
	public function __construct(Core $core, Endpoint $endpoint, iTemplate $template)
	{
		$this->core = $core;
		self::$template = $template;

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
		require_once dirname( __FILE__ ) . '/../components/grid_soundcloud_box.php';
		require_once dirname( __FILE__ ) . '/../components/grid_plaintext_box.php';

		require_once dirname( __FILE__ ) . '/../components/grid_list_box.php';
		require_once dirname( __FILE__ ) . '/../components/grid_rss_box.php';

		require_once dirname( __FILE__ ) . '/../components/grid_reference_box.php';

		require_once dirname( __FILE__ ) . '/../components/grid_structure_configuration_box.php';
		require_once dirname( __FILE__ ) . '/../components/grid_container_configuration_box.php';
		require_once dirname( __FILE__ ) . '/../components/grid_slot_configuration_box.php';
	}

	/**
	 * The editor always sends JSON.
	 */
	public static function isJsonRequest()
	{
		$type = $_SERVER['CONTENT_TYPE'] ?? ($_SERVER['HTTP_CONTENT_TYPE'] ?? '');
		return stripos(trim($type), 'application/json') === 0;
	}

	/**
	 * Endpoint methods that change a grid. They are checked against the version the
	 * editor last saw, so two people editing the same grid cannot silently overwrite
	 * or misplace each other's changes.
	 */
	const WRITE_METHODS = array(
		'addcontainer', 'addreusecontainer', 'movecontainer', 'deletecontainer', 'updatecontainer',
		'movebox', 'removebox', 'reusebox', 'reusecontainer', 'createbox', 'updatebox',
		'updateslotstyle', 'publishdraft', 'revertdraft', 'settorevision',
	);

	/**
	 * The grid a call refers to, if it is a regular one. Reusable boxes and containers
	 * ("box:<id>", "container:<id>") share one grid and are not version-checked.
	 *
	 * @param array $params
	 *
	 * @return int|null
	 */
	public static function versionedGridId( array $params ) {
		$gridId = $params[0] ?? null;
		if ( ( is_int( $gridId ) || is_string( $gridId ) ) && preg_match( '/^\d+$/', (string) $gridId ) === 1 ) {
			return intval( $gridId );
		}
		return null;
	}

	/**
	 * Only public endpoint methods are callable, never constructors, magic or static methods.
	 *
	 * @param mixed $method
	 *
	 * @return \ReflectionMethod|null
	 */
	public function resolveAjaxMethod($method)
	{
		if(!is_string($method) || $method === '' || strncmp($method, '__', 2) === 0)
		{
			return null;
		}
		if(!method_exists($this->endpoint, $method))
		{
			return null;
		}
		$reflectionMethod = new \ReflectionMethod($this->endpoint, $method);
		if(!$reflectionMethod->isPublic() || $reflectionMethod->isStatic() || $reflectionMethod->isConstructor())
		{
			return null;
		}
		return $reflectionMethod;
	}

	//manages ajax call routing
	public function handleAjaxCall()
	{
		header("Content-Type: application/json; charset=UTF-8");
		if($_SERVER['REQUEST_METHOD']!='POST')
		{
			echo json_encode(array('error'=>'only POSTing is allowed'));
			return;
		}
		if(!self::isJsonRequest())
		{
			http_response_code(415);
			echo json_encode(array('error'=>'only JSON requests are allowed'));
			return;
		}

		$json=json_decode(file_get_contents("php://input"));
		$response=$this->dispatch($json);
		http_response_code($response['status']);
		echo json_encode($response['body']);
	}

	/**
	 * Runs one editor request: resolves the method, checks the grid version for writes
	 * and calls the endpoint.
	 *
	 * @param mixed $json the decoded request body: method, params and optionally version
	 *
	 * @return array{status: int, body: array}
	 */
	public function dispatch($json)
	{
		$method=is_object($json) && isset($json->method) ? $json->method : null;
		$params=is_object($json) && isset($json->params) && is_array($json->params) ? array_values($json->params) : array();

		$reflectionMethod=$this->resolveAjaxMethod($method);
		if($reflectionMethod === null)
		{
			return array('status'=>400, 'body'=>array('error'=>'unknown method'));
		}

		$this->endpoint->storage=$this->core->storage;
		$storage=$this->core->storage;
		$gridId=self::versionedGridId($params);
		$isWrite=in_array(strtolower($reflectionMethod->getName()), self::WRITE_METHODS, true);

		// editors that send no version (older bundles, other clients) are not checked
		if($isWrite && $gridId !== null && isset($json->version) && intval($json->version) !== $storage->gridVersion($gridId))
		{
			return array('status'=>409, 'body'=>array(
				'error'=>'conflict',
				'message'=>t('This grid has been changed by someone else in the meantime.'),
				'version'=>$storage->gridVersion($gridId),
			));
		}

		try {
			$body=array('result'=>$reflectionMethod->invokeArgs($this->endpoint,$params));
			if($gridId !== null)
			{
				$body['version']=$isWrite ? $storage->touchGrid($gridId) : $storage->gridVersion($gridId);
			}
			return array('status'=>200, 'body'=>$body);
		} catch (\Throwable $e) {
			return array('status'=>200, 'body'=>array('error'=>$e->getMessage()));
		}
	}

	public function handleUpload()
	{
		$gridid=isset($_POST['gridid']) ? (string)$_POST['gridid'] : '';
		if(preg_match('/^(container:|box:)?\d+$/', $gridid)!==1) {
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
            $this->endpoint->storage->fireHook( API::FIRE_WILL_PERFORM_FILE_UPLOAD, (object) array( "box" => $box, "key" => $key, "file" => $file, "original_filename" => $original_filename, "grid_id" => $gridid) );
            $fileID = $box->performFileUpload($key,$file,$original_filename);
            $this->endpoint->storage->fireHook( API::FIRE_DID_PERFORM_FILE_UPLOAD, (object) array( "box" => $box, "file_id" => $fileID, "key" => $key, "file" => $file, "original_filename" => $original_filename, "grid_id" => $gridid) );

            return $fileID;
          }
				}
			}
		}
		return FALSE;//array('result'=>FALSE,'error'=>'box or slot or container or grid not found','gridid'=>$gridid,'container'=>$containerid,'slotid'=>$slotid,'box'=>$idx);
	}

	/**
	 * @param $grid_id
	 * @param bool $prefereDrafts
	 *
	 * @return grid_grid
	 */
	public function loadGrid($grid_id, $prefereDrafts = TRUE){
		return grid_grid::build($this->core->storage->loadGrid($grid_id, $prefereDrafts));
	}

	/**
	 * @param $grid_id
	 * @param $revision
	 *
	 * @return grid_grid
	 */
	public function loadGridByRevision( $grid_id, $revision ){
		return grid_grid::build($this->core->storage->loadGridByRevision( $grid_id, $revision ));
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
