<h3><?php echo the_title();?></h3>
<?php 
if($this->content->viewmode=='full') 
{
	echo the_content();
}
else if($this->content->viewmode=='excerpt')
{
	echo the_excerpt();
}
?>


