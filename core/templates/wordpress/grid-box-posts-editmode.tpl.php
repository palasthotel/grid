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
				
				/**
				 * legacy support for single autocomplete
				 */
				if(!is_array($value)){
					$value = array($value);
				}
				
				if(count($value) > 0){
					echo "<br/><i>$taxonomy:</i> ";
					$terms = array();
					foreach ($value as $term_id){
						$term = get_term($term_id,$taxonomy);
						if(!is_wp_error($term) && '' != $term->name ){
							$terms[] = $term->name;
						}
					}
					echo implode(", ", $terms);
				}
				
				
			}
			else if(!empty($value) && is_string($value))
			{
				echo "<br/><i>".$field.":</i> ".$value;
			}
		}
	}

	?>
</div>
