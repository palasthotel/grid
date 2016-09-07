<?php
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid
 */
?>
<div class="grid-box<?php echo ($this->style)? " ".$this->style." ": " "; echo implode($this->classes," ")?>">
	<?php
	if ($this->title!=""){

		if ($this->titleurl !=""){
			?>
			<h2 class="grid-box-title"><a href="<?php echo $this->titleurl?>"><?php echo $this->title?></a></h2>
		<?php }else{?>
			<h2 class="grid-box-title"><?php echo $this->title?></h2>
		<?php }?>
	<?php }?>

	<?php if($this->prolog != "") { ?>
		<div class="grid-box-prolog">
			<?php echo $this->prolog?>
		</div>
	<?php } ?>

	<?php
	// START of WordPress Loop
	$query = new WP_Query( $content );
	while ( $query->have_posts() ) {
		$query->the_post();
		
		/**
		 * if avoid doublets plugin is activated
		 */
		if(function_exists('grid_avoid_doublets_add')){
			grid_avoid_doublets_add(get_the_ID(), $this->grid->gridid);
		}
		
		$found = false;
		// Checks if WordPress has a template for post content ...
		if ( $this->storage->templatesPath != null ) {
			$template_path = trailingslashit($this->storage->templatesPath);
			if ( file_exists( $template_path.'post_content.tpl.php' ) ) {
				$found = true;
				include $template_path.'post_content.tpl.php';
			}
		}
		// ... if not, uses Grid template for post content
		if ( ! $found ) {
			include dirname( __FILE__ ).'/post_content.tpl.php';
		}
	}
	wp_reset_postdata();
	// END of WordPress Loop
	?>

	<?php if($this->epilog != ""){ ?>
		<div class="grid-box-epilog">
			<?php echo $this->epilog?>
		</div>
	<?php } ?>

	<?php
	if ($this->readmore!=""){?>
		<a href="<?php echo $this->readmoreurl; ?>" class="grid-box-readmore-link"><?php echo $this->readmore; ?></a>
	<?php }?>

</div>
