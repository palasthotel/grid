<?php
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid-Wordpress
 */


class grid_wordpress_update extends base_update
{
	public  $shemakey = "wordpress";

	public function update_1()
	{
		db_query("insert into {grid_schema} (propkey) values ('schema_version".$this->shemakey."') ON DUPLICATE KEY UPDATE propkey = 'schema_version".$this->shemakey."';");
		
		add_action('admin_notices', array($this, 'notice_1'));
	}
	public function notice_1(){
		global $pagenow;
		if ( $pagenow == 'plugins.php' ) 
		{
			echo '<div class="update-nag">
				<p>Grid Boxes sdffor Facebook and Twitter were moved to another Plugin. You can get it here</p>
			</div>';
		}

	}

}


?>