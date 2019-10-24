<?php
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid-Wordpress
 *
 * @var $content object
 */

?>
<div class="grid-box-editmode">
	List of contents
	<?php
	if ( null != $this->grid ) {
		foreach ( $content as $field => $value ) {
			if ( ! empty( $value ) && strpos( $field, 'tax_' ) === 0 ) {
				$taxonomy = $this->getTaxonomyNameByKey( $field );

				/**
				 * legacy support for single autocomplete
				 */
				if ( ! is_array( $value ) ) {
					$value = array( $value );
				}

				if ( count( $value ) > 0 ) {
					$tax = get_taxonomy( $taxonomy );
					echo "<br><i>{$tax->label}:</i> ";
					$terms = array();
					foreach ( $value as $term_id ) {
						$term = get_term( $term_id, $taxonomy );
						if ( ! is_wp_error( $term ) && ! empty( $term->name ) ) {
							$terms[] = $term->name;
						}
					}
					echo implode( ', ', $terms );
				}
			} else if ( ! empty( $value ) && is_string( $value ) ) {
				if ( $field === 'post_format' ) {
					echo '<br><i>' . $field . ':</i> ' . get_post_format_string( $value );
				} else if ( $field === 'post_type' ) {
					if($value === "any"){
						echo "<br/><i>$field:</i> ".__('Any post type');
					} else {
						$post_type = get_post_type_object($value);
						if($post_type !== null) echo '<br><i>' . $field . ':</i> ' . $post_type->label;
					}
				} else {
					echo '<br><i>' . $field . ':</i> ' . $value;
				}
			} else if(! empty($value) && is_array($value)){
				if($field === "post_type"){
					$post_types = array_filter(array_map(function($slug){
						if($slug === "any"){
							return __('Any post type');
						}
						return get_post_type_object($slug);
					}, $value), function($post_type){ return null != $post_type; });
					$labels = array_map(function($post_type){
						if(is_string($post_type)) return $post_type;
						return $post_type->label;
					}, $post_types);
					echo '<br><i>' . $field . ':</i> ' . implode(", ", $labels);
				} else {
					echo '<br><i>' . $field . ':</i> ' . implode(", ", $value);
				}
			}
		}
	}
	?>
</div>
