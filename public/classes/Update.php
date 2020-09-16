<?php

namespace Palasthotel\Grid\WordPress;

use Palasthotel\Grid\AbstractQuery;
use Palasthotel\Grid\UpdateBase;
use const Grid\Constants\GRID_CSS_VARIANT_TABLE;

/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid-Wordpress
 */


class Update extends UpdateBase
{
	public function __construct( AbstractQuery $query ) {
		parent::__construct( $query, "_wordpress" );
	}

	// ------------------------------------------------
	// updates
	// ------------------------------------------------
	public function update_1()
	{
		$this->query->prefixAndExecute("insert into {grid_schema} (propkey) values ('schema_version".$this->schemaKey."') ON DUPLICATE KEY UPDATE propkey = 'schema_version".$this->schemaKey."';");
		
		add_action('admin_notices', array($this, 'notice_1'));

	}

	public function update_2(){
		// default variant before update
		update_option(Plugin::OPTION_FRONTEND_CSS_VARIANT, GRID_CSS_VARIANT_TABLE);
	}

	// ------------------------------------------------
	// update notices
	// ------------------------------------------------
	public function notice_1(){
		/**
		 * install button for plugin
		 */
		$action = 'install-plugin';
		$slug = 'grid-social-boxes';
		$url = wp_nonce_url(
			add_query_arg(
				array(
					'action' => $action,
					'plugin' => $slug
				),
				admin_url( 'update.php' )
			),
			$action.'_'.$slug
		);

		$button = "<a href='$url' class='install-now button'>Install</a>";
		echo '<div class="update-nag">
			<p>Grid Facebook Box and Twitter Box were moved to a separate plugin <a href="https://wordpress.org/plugins/grid-social-boxes">Grid Social Boxes</a>.</p>
			<p>'.$button.'</p>
		</div>';
	}
}


?>