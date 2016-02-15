<?php 
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid-Wordpress
 */
?>

<div class="grid-box-editmode">
	List of contents
	<?php
	if(null != $this->grid){
		foreach($content as $field => $value){
			if( '' != $value && strpos($field,"tax_") === 0 )
			{
				$taxonomy = $this->getTaxonomyNameByKey($field);
				$term = get_term($value,$taxonomy);
				if(!is_wp_error($term) && '' != $term->name ){
					echo "<br/>$taxonomy: ".$term->name;
				}
			}
			else if(!empty($value) && is_string($value))
			{
				echo "<br/>".$field.": ".$value;
			}
		}
	}

	?>
</div>
