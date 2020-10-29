<?php


namespace Palasthotel\Grid;


use grid_box;
use grid_container;
use grid_grid;
use grid_slot;

class Template implements iTemplate {

	private static $templatesPaths = [];

	/**
	 * @return string[]
	 */
	public static function paths() {
		return self::$templatesPaths;
	}

	/**
	 * @param string $absolutePath
	 */
	public function addPath( string $absolutePath ) {
		self::$templatesPaths[] = $absolutePath;
	}

	/**
	 * @param string $filename for example post_content.tpl.php
	 *
	 * @return false|string
	 */
	public static function getPath( string $filename ) {
		foreach ( static::$templatesPaths as $path ) {
			$template_path = trailingslashit( $path );
			if ( file_exists( $template_path . $filename ) ) {
				return $template_path . $filename;
			}
		}

		return false;
	}

	/**
	 * @param grid_grid $grid
	 *
	 * @return string
	 */
	public static function grid( grid_grid $grid ): string {
		foreach ( self::$templatesPaths as $templatesPath ) {
			$template_path = rtrim( $templatesPath . '/grid.tpl.php', "/" );
			if ( file_exists( $template_path ) ) {
				return $template_path;
			}
		}

		return dirname( __FILE__ ) . '/../templates/components/grid.tpl.php';
	}

	/**
	 * @param grid_container $container
	 *
	 * @return string
	 */
	public static function container( grid_container $container ): string {

		foreach ( self::$templatesPaths as $templatesPath ) {
			$template_path = rtrim( $templatesPath . "/grid-container.tpl.php", "/" );
			if ( file_exists( $template_path ) ) {
				return $template_path;
			}
		}

		return dirname( __FILE__ ) . '/../templates/components/grid-container.tpl.php';
	}

	/**
	 * @param grid_slot $slot
	 *
	 * @return string
	 */
	public static function slot( grid_slot $slot ): string {

		foreach ( self::$templatesPaths as $templatesPath ) {
			$template_path = rtrim( $templatesPath . '/grid-slot.tpl.php', "/" );
			if ( file_exists( $template_path ) ) {
				return $template_path;
			}
		}

		return dirname( __FILE__ ) . '/../templates/components/grid-slot.tpl.php';
	}

	/**
	 * @param grid_box $box
	 * @param bool $editmode
	 *
	 * @return string
	 */
	public static function box( grid_box $box, bool $editmode ): string {
		$typechecks   = array();
		$class        = get_class( $box );
		$typechecks[] = preg_replace( "/(?:grid_(.*)_box|grid_(box))/u", "$1$2", $class );
		while ( $class != false ) {
			$class        = get_parent_class( $class );
			$typechecks[] = preg_replace( "/(?:grid_(.*)_box|grid_(box))/u", "$1$2", $class );
		}
		foreach ( $typechecks as $type ) {

			foreach ( self::$templatesPaths as $templatesPath ) {

				$templatesPath = rtrim( $templatesPath, "/" );
				if ( $templatesPath != null ) {
					$editmode_file = $templatesPath . '/grid-box-' . $type . '-editmode.tpl.php';
					$file          = $templatesPath . '/grid-box-' . $type . '.tpl.php';
					if ( $editmode && file_exists( $editmode_file ) ) {
						return $editmode_file;
					}
					if ( ! $editmode && file_exists( $file ) ) {
						return $file;
					}
				}
			}

			$editmode_file = dirname( __FILE__ ) . '/../templates/components/grid-box-' . $type . '-editmode.tpl.php';
			$file          = dirname( __FILE__ ) . '/../templates/components/grid-box-' . $type . '.tpl.php';
			if ( $editmode && file_exists( $editmode_file ) ) {
				return $editmode_file;
			}
			if ( ! $editmode && file_exists( $file ) ) {
				return $file;
			}
		}

		if ( $editmode ) {
			return dirname( __FILE__ ) . '/../templates/components/grid-box-editmode.tpl.php';
		}

		return dirname( __FILE__ ) . '/../templates/components/grid-box.tpl.php';
	}

}
