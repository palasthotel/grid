<?php
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license GPL-3.0-or-later https://www.gnu.org/licenses/gpl-3.0.html
 * @package Palasthotel\Grid
 */

class grid_rss_box extends grid_list_box {
	/**
	 * Where SimplePie caches feeds. Defaults to a directory below the system temp dir;
	 * integrations can point it somewhere else.
	 *
	 * @var string|null
	 */
	public static $CACHE_DIR = null;

	/**
	 * @var SimplePie|null the feed of the last build()
	 */
	public $feed = null;

	public static function cacheDir() {
		$dir = self::$CACHE_DIR ?: rtrim( sys_get_temp_dir(), "/" ) . "/grid-rss-cache";
		if ( ! is_dir( $dir ) ) {
			mkdir( $dir, 0700, true );
		}
		return $dir;
	}

	public function __construct() {
		parent::__construct();
		$this->content->url      = "";
		$this->content->numItems = 15;
		$this->content->offset   = 0;
	}

	public function type() {
		return 'rss';
	}

	public function build( $editmode ) {
		if ( isset( $this->content->url ) && $this->content->url != "" ) {
			$pie = new SimplePie();
			$pie->set_cache_location( self::cacheDir() );

			$pie->set_feed_url( $this->content->url );
			$pie->set_item_limit( $this->content->numItems );

			$pie->init();
			$this->feed = $pie;

			$start = ( ! empty( $this->content->offset ) ) ? $this->content->offset : 0;
			$end   = $this->content->numItems;

			$i     = $this->content->numItems;
			$items = array();

			foreach ( $pie->get_items( $start, $end ) as $item ) {

				$_item = new grid_rss_box_item( $item );

				if ( $i == 0 ) {
					$_item->addClass( "grid-rss-item-first" );
				}
				if ( $i == $this->content->numItems - 1 ) {
					$_item->addClass( "grid-rss-item-last" );
				}

				$items[] = $_item;

				/*
				 * stop it on max items
				 */
				$i --;
				if ( $i < 0 ) {
					break;
				}

			}

			return $items;
		}

		return (string)t( "RSS Feed" );

	}

	public function contentStructure() {
		return array(
			array(
				'key'   => 'url',
				'label' => t( 'RSS-URL' ),
				'type'  => 'text',
			),
			array(
				'key'   => 'numItems',
				'label' => t( 'Number of items to show' ),
				'type'  => 'number',
			),
			array(
				'key'   => 'offset',
				'label' => t( 'Offset' ),
				'type'  => 'number',
			),
		);
	}

}

class grid_rss_box_item {

	private $raw;
	private $classes;

	/**
	 * grid_rss_box_item constructor.
	 *
	 * @param SimplePie_Item $raw
	 */
	function __construct( $raw ) {
		$this->raw     = $raw;
		$this->classes = array(
			"grid-rss-item",
		);
	}

	/**
	 * @return SimplePie_Item
	 */
	public function getRaw(){
		return $this->raw;
	}

	public function addClass( $class ) {
		$this->classes[] = $class;
	}

	/**
	 * @return array
	 */
	public function getClasses() {
		return $this->classes;
	}

	public function getTitle() {
		return $this->raw->get_title();
	}

	public function getDescription() {
		return $this->raw->get_description();
	}

	public function getDate( $format ) {
		return $this->raw->get_date( $format );
	}

	public function getPermalink() {
		return $this->raw->get_permalink();
	}


}
