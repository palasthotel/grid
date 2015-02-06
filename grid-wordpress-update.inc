<?php
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid-Wordpress
 */


class grid_wordpress_update extends base_update
{
	public  $shemakey = "_wordpress";

	public function update_1()
	{
		db_query("insert into {grid_schema} (propkey) values ('schema_version".$this->shemakey."') ON DUPLICATE KEY UPDATE propkey = 'schema_version".$this->shemakey."';");
		
		add_action('admin_notices', array($this, 'notice_1'));
	}

	public function notice_1(){
		global $pagenow;
		if ( $pagenow == 'plugins.php' ) 
		{
			/**
			 * install button for plugin
			 */
			$action = 'install-plugin';
			$slug = 'buddypress';
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
				<p>Grid Facebook Box and Twitter Box were moved to separate plugin <a href="#">Grid Social Boxes</a>.</p>
				<p>'.$button.'</p>
			</div>';
		}

	}

}


?>