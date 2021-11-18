<?php
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid
 */

/**
 * Grid-Box is parent to all Grid boxes.
 */

namespace Palasthotel\Grid\Model;

use Palasthotel\Grid\Core;
use stdClass;

class Box extends _Base {

	/**
	 * Contains id of boxes
	 * @var integer
	 */
	public $boxid;

	/**
	 * Reference to the Grid itself
	 * @var Grid
	 */
	public $grid;

	/**
	 * Defines the style of boxes
	 * @var string
	 */
	public $style;

	/**
	 * Contains all class names
	 * @var array
	 */
	public $classes = array();

	/**
	 * @var string
	 */
	public $reusetitle;

	/**
	 * Contains title of the box
	 * @var string
	 */
	public $title;

	/**
	 * Sets an optional link for box title
	 * @var string
	 */
	public $titleurl;

	/**
	 * @var string
	 */
	public $titleurltarget;

	/**
	 * Determines read more text
	 * @var string
	 */
	public $readmore;

	/**
	 * Sets an optional link for readmore
	 * @var string
	 */
	public $readmoreurl;

	/**
	 * @var string
	 */
	public $readmoreurltarget;

	/**
	 * Contains prolog content
	 * @var string
	 */
	public $prolog;

	/**
	 * Contains epilog content
	 * @var string
	 */
	public $epilog;

	/**
	 * Describes used box layout
	 * @var string
	 */
	public $layout;

	/**
	 * Sets used box language property
	 * @var string
	 */
	public $language;

	/**
	 * Represents all content determined by contentStructure
	 * @var string
	 */
	public $content;

	/**
	 * Class constructor
	 */
	public function __construct() {
		$this->content = new stdClass();
	}

	/**
	 * Sets box type.
	 *
	 * @return string
	 */
	public function type() {
		return 'box';
	}

	/**
	 * Checks if class is meta type
	 *
	 * Makes grid_box a MetaType.
	 *
	 * @return boolean
	 */
	public function isMetaType() {
		return false;
	}

	/**
	 * Sets name of MetaType that is shown in Grid menu.
	 *
	 * @return null|string
	 */
	public function metaTitle() {
		return null;
	}

	/**
	 * Determines criteria for meta search.
	 *
	 * @return array
	 */
	public function metaSearchCriteria() {
		return array();
	}

	/**
	 * Implements meta search.
	 *
	 * @return array
	 */
	public function metaSearch( $criteria, $query ) {
		return array();
	}

	/**
	 * Determines editor widgets used in backend.
	 *
	 * @return array
	 */
	public function contentStructure() {
		return array();
	}

	/**
	 * Persists function
	 *
	 * @return mixed
	 */
	public function persist() {
		return $this->storage->persistBox( $this );
	}

	/**
	 * Delete function.
	 *
	 * @return boolean
	 */
	public function delete() {
		$this->storage->fireHook( Core::FIRE_DELETE_BOX, $this );

		return $this->storage->deleteBox( $this );
	}

	/**
	 * Refreshes box content.
	 *
	 * @return boolean
	 */
	public function updateBox( $boxdata ) {
		$this->storage->fireHook( Core::FIRE_SAVE_BOX, (object) array( "box" => $this, "data" => $boxdata ) );
		$this->style          = $boxdata->style;
		$this->reusetitle     = $boxdata->reusetitle;
		$this->title          = $boxdata->title;
		$this->titleurl       = $boxdata->titleurl;
		$this->titleurltarget = $boxdata->titleurltarget;

		$this->readmore          = $boxdata->readmore;
		$this->readmoreurl       = $boxdata->readmoreurl;
		$this->readmoreurltarget = $boxdata->readmoreurltarget;
		$this->prolog            = $boxdata->prolog;
		$this->epilog            = $boxdata->epilog;
		$this->content           = $boxdata->content;

		return $this->persist();
	}

	/**
	 * Implements search for keys.
	 *
	 * @return array
	 */
	public function performElementSearch( $key, $query ) {
		return array( array( 'key' => - 1, 'value' => 'This box seems not to implement search' ) );
	}

	/**
	 * Gets values for element search.
	 *
	 * @return string
	 */
	public function getElementValue( $path, $id ) {
		return "BOX DOESNT SUPPORT THIS";
	}

	/**
	 * File upload function
	 *
	 * @return boolean
	 * @uses array array('result'=>FALSE,'error'=>'wrong box');
	 *
	 */
	public function performFileUpload( $key, $path, $original_file ) {
		return false;
	}

	/**
	 * @param $fid int file id
	 * @param $path string contentstructure
	 *
	 * @return boolean
	 */
	public function getFileInfo( $fid, $path ) {
		return false;
	}

	/**
	 * Initializes deletion of reuse box
	 *
	 * @return void
	 */
	public function prepareReuseDeletion() {

	}

}
