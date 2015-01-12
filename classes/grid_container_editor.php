<?php
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid
 */

class grid_container_editor
{
	public function getCSS($absolute=FALSE)
	{
		return array(
			'css/grid-container-editor.css'
		);
	}
	
	public function getJS($absolute=FALSE)
	{
		return array();
	}
	
	public function run($grid_db)
	{
		ob_start();
		$validationFailed=false;
		if(isset($_POST) && !empty($_POST))
		{
			//save the new container
			$support=$_POST['sidebar_support'];
			$new_denominator=doubleval($_POST['denominator']);
			$slots = str_replace(" ", "", $_POST['slots']);
			$slots=explode(",", $slots);
			//before saving: validate the sidebar rule
			$complete_slots=0;
			foreach($slots as $slot)
				$complete_slots+=doubleval($slot);
			$used=$complete_slots/$new_denominator;
			$free=1.0-$used;
			$needed=0;
			if($support=="left" || $support=="right")
				$needed=1.0/3.0;
			else if($support=="both")
				$needed=2.0/3.0;
			if($needed>$free)
			{
				$validationFailed=true;
			}
			else
			{
				$validationFailed=false;
				
				//ok, let's build the container.
				$type="c";
				$numslots=count($slots);
				$space_to_left=NULL;
				$space_to_right=NULL;
				if($support=="left" || $support=="both")
				{
					$type.="-0";
					$space_to_left="1d3";					
				}
				foreach($slots as $slot)
				{
					$type.="-".$slot."d".$new_denominator;
				}
				if($support=="right" || $support=="both")
				{
					$type.="-0";
					$space_to_right="1d3";					
				}
				$grid_db->createContainerType($type,$space_to_left,$space_to_right,$numslots);
			}
		}
		else
		{
			$support="none";
			$new_denominator="";
			$slots=array();
		}
?>
	<div class="notice">
		<p>For now, you can only add new container types. Deletion and editing is not supported as it might invalidate existing grids.</p>
		<p>The relative size of sidebars is baked to 1/3 for now. We're handling the calculation for you, however remember to have at least 1/3 free for each sidebar when constructing new containers.</p>
<?php
		if($validationFailed)
		{
?>
		<p>You didn't leave enough room for the sidebar(s).</p>

<?php
		}
?>
	</div>
	<p>For an overview we'll show you a list of existing containers here. Some of those are special containers which are needed by grid itself.</p>
	<table cellspacing="0" cellpadding="0" class="grid-container-editor-table">
		<tr>
			<th>Identifier</th>
			<th>Sidebar-Support</th>
			<th>Denominator</th>
			<th>Slots (Relative Sizes)</th>
		</tr>
<?php
	$containers=$grid_db->fetchContainerTypes();
	foreach($containers as $container)
	{
		$components=explode("-", $container['type']);
		array_splice($components, 0,1);
		$denominator=0;
		$places_sidebar=strpos($container['type'],"s-")===0;
		$placeholder=strpos($container['type'],"i-")===0;
		$sidebar=strpos($container['type'],"sc-")===0;
		foreach($components as $elem)
		{
			if(strpos($elem,"d")!==FALSE)
			{
				$split=explode("d", $elem);
				$denominator=$split[1];
			}
		}
?>
		<tr>
			<td><?php echo $container['type'];?></td>
			<td>
			<?php
				if($places_sidebar)echo "places sidebar";
				else if(isset($container['space_to_left']) && !isset($container['space_to_right']))echo "left";
				else if(!isset($container['space_to_left']) && isset($container['space_to_right']))echo "right";
				else if(isset($container['space_to_left']) && isset($container['space_to_right']))echo "both";
				else echo "none";
			?>
			</td>
			<td><?php echo $denominator;?></td>
			<td>
				<?php
				if($placeholder || $sidebar)
				{
					echo "N/A (internal use)";
				}
				else
				{
					echo $container['numslots']." (";
					$first=TRUE;
					foreach($components as $slot)
					{
						if(!$first)
							echo ",";
						$first=false;
						if($slot=="0")
						{
							if($places_sidebar)
								echo "Content";
							else
								echo "Sidebar";
						}
						else
						{
							$parts=explode("d", $slot);
							echo $parts[0];
						}
					}
					echo ")";
				}
				?>
			</td>
		</tr>
<?php
	}
?>
	</table>
	<form class="grid-container-editor-form" method="POST">
		<h3>Create a new container</h3>
		<div class="grid-new-container-values">
			<div>
				<label for="grid-container-editor-sidebar_support">Support for Sidebars:</label><br/>
				<select id="grid-container-editor-sidebar_support" name="sidebar_support">
					<option value="none" <?php if($support=="none")echo "selected";?>>None</option>
					<option value="left" <?php if($support=="left")echo "selected";?>>Left</option>
					<option value="right" <?php if($support=="right")echo "selected";?>>Right</option>
					<option value="both" <?php if($support=="both")echo "selected";?>>Both</option>
				</select>
			</div>
			<div>
				<label for="grid-container-editor-denominator">Denominator:</label><br/>
				<input id="grid-container-editor-denominator" required type="number" name="denominator" value="<?php echo $new_denominator;?>">
			</div>
			<div>
				<label for="grid-container-editor-slots">Slot Sizes (divided by a comma):</label><br/>
				<input id="grid-container-editor-slots" required type="text" name="slots" value="<?php echo implode(",", $slots);?>">
			</div>
		</div>
		<div>
			<button type="submit" >Create Container</button>
		</div>
	</form>
<?php
		

		$result=ob_get_contents();
		ob_end_clean();
		return $result;
	}
}