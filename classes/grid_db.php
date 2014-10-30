<?php
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid
 */

class grid_db {
	public $templatesPath=NULL;
	public $ajaxEndpoint;
	public $containerstyle=NULL;
	public $slotstyle=NULL;
	public $boxstyle=NULL;
	
	private $connection;
	private $author;
	private $prefix;

	public function __construct($host,$user,$password,$database,$author="UNKNOWN",$prefix="") {
		$port = 3306;
		if(strpos($host, ":")>=0){
			$parts = explode(":", $host);
			$host = $parts[0];
			if(isset($parts[1])){
				$port = $parts[1];
			}
		}

		$this->connection=new mysqli($host,$user,$password,$database, $port);
		$this->connection->set_charset("utf8");
		$this->author=$author;
		$this->ajaxEndpoint=new grid_ajaxendpoint();
		$this->prefix=$prefix;
	}
	
	public function __destruct() {
		$this->connection->close();
	}
	public function createGrid()
	{
		$query="select max(id) as id from ".$this->prefix."grid_grid";
		$result=$this->connection->query($query) or die($this->connection->error());
		$row=$result->fetch_assoc();
		$id=$row['id'];
		$id++;
		$query="insert into ".$this->prefix."grid_grid (id,revision,published,next_containerid,next_slotid,next_boxid,author,revision_date) values ($id,0,0,0,0,0,'".$this->author."',UNIX_TIMESTAMP())";
		$this->connection->query($query);
		return $id;
	}
	
	public function destroyGrid($grid_id)
	{
		$query="delete from ".$this->prefix."grid_box where grid_id=$grid_id";
		$this->connection->query($query);
		$query="delete from ".$this->prefix."grid_container where grid_id=$grid_id";
		$this->connection->query($query);
		$query="delete from ".$this->prefix."grid_container2slot where grid_id=$grid_id";
		$this->connection->query($query);
		$query="delete from ".$this->prefix."grid_grid where id=$grid_id";
		$this->connection->query($query);
		$query="delete from ".$this->prefix."grid_grid2container where grid_id=$grid_id";
		$this->connection->query($query);
		$query="delete from ".$this->prefix."grid_slot where grid_id=$grid_id";
		$this->connection->query($query);
		$query="delete from ".$this->prefix."grid_slot2box where grid_id=$grid_id";
		$this->connection->query($query);
	}
	
	public function cloneGrid($grid)
	{
		$gridid=$grid->gridid;
		
		$query="select max(id) as id from ".$this->prefix."grid_grid";
		$result=$this->connection->query($query);
		$row=$result->fetch_assoc();
		$cloneid=$row['id'];
		$cloneid++;
		
		$query="insert into ".$this->prefix."grid_grid (id,revision,published,next_containerid,next_slotid,next_boxid,author,revision_date) select $cloneid,revision,published,next_containerid,next_slotid,next_boxid,'".$this->author."',UNIX_TIMESTAMP() from ".$this->prefix."grid_grid where id=$gridid";
		$this->connection->query($query) or die($this->connection->error);
		$query="insert into ".$this->prefix."grid_container (id,grid_id,grid_revision,type,style,title,title_url,prolog,epilog,readmore,readmore_url,reuse_containerid) select id,$cloneid,grid_revision,type,style,title,title_url,prolog,epilog,readmore,readmore_url,reuse_containerid from ".$this->prefix."grid_container where grid_id=$gridid";
		$this->connection->query($query) or die($this->connection->error);
		$query="insert into ".$this->prefix."grid_grid2container (grid_id,grid_revision,container_id,weight) select $cloneid,grid_revision,container_id,weight from ".$this->prefix."grid_grid2container where grid_id=$gridid";
		$this->connection->query($query) or die($this->connection->error);
		$query="insert into ".$this->prefix."grid_slot (id,grid_id,grid_revision,style) select id,$cloneid,grid_revision,style from ".$this->prefix."grid_slot where grid_id=$gridid";
		$this->connection->query($query) or die($this->connection->error);
		$query="insert into ".$this->prefix."grid_container2slot (container_id,grid_id,grid_revision,slot_id,weight) select container_id,$cloneid,grid_revision,slot_id,weight from ".$this->prefix."grid_container2slot where grid_id=$gridid";
		$this->connection->query($query) or die($this->connection->error);
		$query="insert into ".$this->prefix."grid_box (id,grid_id,grid_revision,type,style,title,title_url,prolog,epilog,readmore,readmore_url,content) select id,$cloneid,grid_revision,type,style,title,title_url,prolog,epilog,readmore,readmore_url,content from ".$this->prefix."grid_box where grid_id=$gridid";
		$this->connection->query($query) or die($this->connection->error);
		$query="insert into ".$this->prefix."grid_slot2box (slot_id,grid_id,grid_revision,box_id,weight) select slot_id,$cloneid,grid_revision,box_id,weight from ".$this->prefix."grid_slot2box where grid_id=$gridid";
		$this->connection->query($query) or die($this->connection->error);
		return $this->loadGrid($cloneid);
	}

	//loads a complete grid with all regions and boxes belonging to it.
	public function loadGrid($gridId,$preferDrafts=TRUE)
	{
		if(strncmp("container:",$gridId,strlen("container:"))==0)
		{
			$grid=$this->getReuseGrid();
			$split=explode(":",$gridId);
			$id=$split[1];
			$container=$this->loadReuseContainer($id);
			$container->reused=FALSE;
			$grid->container=array();
			$grid->container[]=$container;
			$container->grid=$grid;
			foreach($container->slots as $slot)
			{
				$slot->grid=$grid;
				foreach($slot->boxes as $box)
				{
					$box->grid=$grid;
				}
			}
			return $grid;
		}
		if(strncmp("box:",$gridId,strlen("box:"))==0)
		{
			$grid=$this->getReuseGrid();
			$split=explode(":", $gridId);
			$id=$split[1];
			$box=$this->loadReuseBox($id);
			$grid->container=array();
			$grid->container[]=new grid_container();
			$grid->container[0]->grid=$grid;
			$grid->container[0]->storage=$this;
			$grid->container[0]->type="c";
			$grid->container[0]->dimension="1d1";
			$grid->container[0]->containerid=-1;
			$grid->container[0]->slots=array();
			$grid->container[0]->slots[]=new grid_slot();
			$grid->container[0]->slots[0]->storage=$this;
			$grid->container[0]->slots[0]->grid=$grid;
			$grid->container[0]->slots[0]->slotid=-1;
			$grid->container[0]->slots[0]->boxes=array();
			$grid->container[0]->slots[0]->boxes[]=$box;
			$box->grid=$grid;
			$box->storage=$this;
			return $grid;
		}
		//before we begin, we have to fetch the correct revision so we can fire off the right queries.
		$query="select max(revision) as revision from ".$this->prefix."grid_grid where id=$gridId and published=1";
		$result=$this->connection->query($query);
		$row=$result->fetch_assoc();
		if(isset($row['revision']))
			$publishedRevision=$row['revision'];
		else
			$publishedRevision=-1;

		$query="select max(revision) as revision from ".$this->prefix."grid_grid where id=$gridId";
		$result=$this->connection->query($query);
		$row=$result->fetch_assoc();
		if(isset($row['revision']))
			$maxRevision=$row['revision'];
		else
			$maxRevision=-1;

		$revision=$publishedRevision;
		if(($preferDrafts && $maxRevision>$revision) || $revision==-1)
		{
			$revision=$maxRevision;
		}
		return $this->loadGridByRevision($gridId,$revision);
	}
	
	private function parseBox($row)
	{
		$boxtype=$row['box_type'];
		$class="grid_".$boxtype."_box";
		$box=new $class();
		$box->storage=$this;
		$box->boxid=$row['box_id'];
		$box->style=$row['box_style'];
		$box->style_label=$row['box_style_label'];
		$box->title=$row['box_title'];
		$box->titleurl=$row['box_titleurl'];
		$box->prolog=$row['box_prolog'];
		$box->epilog=$row['box_epilog'];
		$box->readmore=$row['box_readmore'];
		$box->readmoreurl=$row['box_readmoreurl'];
		$box->content=json_decode($row['box_content']);
		return $box;
	}
	
	public function getReuseGrid()
	{
		$query="select id,revision from ".$this->prefix."grid_grid where id=-1 and revision=0";
		$result=$this->connection->query($query);
		while($row=$result->fetch_assoc())
		{
			$grid=new grid_grid();
			$grid->gridid=-1;
			$grid->isPublished=FALSE;
			$grid->isDraft=TRUE;
			$grid->gridrevision=0;
			$grid->storage=$this;
			$grid->container=array();
			return $grid;
		}
		//if we end up here there is no reuse grid yet.
		$query="insert into ".$this->prefix."grid_grid (id,revision,published,next_containerid,next_slotid,next_boxid,author,revision_date) values (-1,0,0,0,0,0,'',0)";
		$this->connection->query($query) or die($this->connection->error);
		$grid=new grid_grid();
		$grid->gridid=-1;
		$grid->isPublished=FALSE;
		$grid->isDraft=TRUE;
		$grid->gridrevision=0;
		$grid->storage=$this;
		$grid->container=array();
		return $grid;
	}
	
	public function loadReuseBox($boxid)
	{
		$query="select 
		grid_box.id box_id,
		title box_title, 
		title_url box_titleurl,
		prolog box_prolog,
		epilog box_epilog,
		readmore box_readmore,
		readmore_url box_readmoreurl,
		content box_content,
		grid_box_style.slug box_style,
		grid_box_style.style box_style_label,
		grid_box_type.type box_type
		
		from ".$this->prefix."grid_box grid_box
		left join ".$this->prefix."grid_box_style grid_box_style on grid_box_style.id=grid_box.style
		left join ".$this->prefix."grid_box_type grid_box_type on grid_box_type.id=grid_box.type
		where grid_id=-1 and grid_revision=0 and grid_box.id=$boxid";
		$result=$this->connection->query($query) or die($query."\n".$this->connection->error);
		$row=$result->fetch_assoc();
		return $this->parseBox($row);
	}
	
	public function getReuseableBoxIds()
	{
		$query="select id from ".$this->prefix."grid_box where grid_id=-1 and grid_revision=0 and id not in (select box_id from ".$this->prefix."grid_slot2box where grid_id=-1 and grid_revision=0)";
		$result=$this->connection->query($query);
		$results=array();
		while($row=$result->fetch_assoc())
		{
			$results[]=$row['id'];
		}
		return $results;
	}
	
	public function deleteReusableBox($id)
	{
		$query="delete from ".$this->prefix."grid_box where grid_id=-1 and grid_revision=0 and id=$id";
		$this->connection->query($query) or die($this->connection->error);
	}
	
	public function getReusedBoxIds()
	{
		$query="select content from ".$this->prefix."grid_box left join ".$this->prefix."grid_box_type grid_box_type on ".$this->prefix."grid_box.type=grid_box_type.id where grid_box_type.type='reference'";
		$result=$this->connection->query($query);
		$usedIds=array();
		while($row=$result->fetch_assoc())
		{
			$data=$row['content'];
			$data=json_decode($data);
			if(!in_array($data->boxid, $usedIds))
				$usedIds[]=$data->boxid;
		}
		return $usedIds;
	}
	
	public function getReuseContainerIds()
	{
		$query="select id from ".$this->prefix."grid_container where grid_id=-1 and grid_revision=0";
		$result=$this->connection->query($query) or die($this->connection->error);
		$ids=array();
		while($row=$result->fetch_assoc())
		{
			$ids[]=$row['id'];
		}
		return $ids;
	}
	
	public function getReusedContainerIds()
	{
		$query="select id from ".$this->prefix."grid_container where grid_id=-1 and grid_revision=0 and id in (select reuse_containerid from ".$this->prefix."grid_container)";
		$result=$this->connection->query($query) or die($this->connection->error);
		$ids=array();
		while($row=$result->fetch_assoc())
		{
			$ids[]=$row['id'];
		}
		return $ids;
	}

	public function deleteReusableContainer($containerid)
	{
		$container=$this->loadReuseContainer($containerid);
		$container->grid=new grid_grid;
		$container->grid->gridid=-1;
		$container->grid->gridrevision=0;
		$container->grid->storage=$this;
		foreach($container->slots as $slot)
		{
			$slot->grid=$container->grid;
			foreach($slot->boxes as $box)
			{
				$box->grid=$container->grid;
			}
		}
		$this->destroyContainer($container);
	}

	public function loadReuseContainer($container)
	{
		$query="select grid_container.id as container_id,
grid_container.reuse_title as container_reuse_title,
grid_container_style.slug as container_style,
grid_container.title as container_title,
grid_container.title_url as container_titleurl,
grid_container.prolog as container_prolog,
grid_container.epilog as container_epilog,
grid_container.readmore as container_readmore,
grid_container.readmore_url as container_readmoreurl,
grid_container.reuse_containerid as container_reuseid,
grid_container_style.style as container_style_label,
grid_container.type as container_type_id,
grid_container_type.type as container_type,
grid_container_type.space_to_right as container_space_to_right,
grid_container_type.space_to_left as container_space_to_left,
grid_container2slot.slot_id as slot_id,
grid_slot_style.slug as slot_style,
grid_box.id as box_id,
grid_box.title as box_title,
grid_box.title_url as box_titleurl,
grid_box.prolog as box_prolog,
grid_box.epilog as box_epilog,
grid_box.content as box_content,
grid_box.readmore as box_readmore,
grid_box.readmore_url as box_readmoreurl,
grid_box_type.type as box_type,
grid_box_style.slug as box_style,
grid_box_style.style as box_style_label
from ".$this->prefix."grid_container grid_container
left join ".$this->prefix."grid_container_style grid_container_style
     on grid_container.style=grid_container_style.id
left join ".$this->prefix."grid_container2slot grid_container2slot
     on grid_container.id=grid_container2slot.container_id
     and grid_container.grid_id=grid_container2slot.grid_id
     and grid_container.grid_revision=grid_container2slot.grid_revision
left join ".$this->prefix."grid_slot grid_slot
     on grid_container2slot.slot_id=grid_slot.id
     and grid_slot.grid_id=grid_container.grid_id
     and grid_slot.grid_revision=grid_container.grid_revision
left join ".$this->prefix."grid_slot_style grid_slot_style
     on grid_slot.style=grid_slot_style.id
left join ".$this->prefix."grid_slot2box grid_slot2box
     on grid_container2slot.slot_id=grid_slot2box.slot_id
     and grid_container2slot.grid_id=grid_slot2box.grid_id
     and grid_container2slot.grid_revision=grid_slot2box.grid_revision
left join ".$this->prefix."grid_box grid_box
     on grid_slot2box.box_id=grid_box.id
     and grid_slot2box.grid_id=grid_box.grid_id
     and grid_slot2box.grid_revision=grid_box.grid_revision
left join ".$this->prefix."grid_container_type grid_container_type
	 on grid_container.type=grid_container_type.id
left join ".$this->prefix."grid_box_type grid_box_type
	 on grid_box.type=grid_box_type.id
left join ".$this->prefix."grid_box_style grid_box_style
	 on grid_box.style=grid_box_style.id
where grid_container.grid_id=-1 and grid_container.grid_revision=0 and grid_container.id=$container
";
		$result=$this->connection->query($query);
		$currentcontainer=NULL;
		while($row=$result->fetch_assoc())
		{
			if($currentcontainer==NULL || $currentcontainer->containerid!=$row['container_id'])
			{
				$currentcontainer=new grid_container();
				$currentcontainer->reused=TRUE;
				$currentcontainer->grid=NULL;
				$currentcontainer->containerid=$row['container_id'];
				$currentcontainer->reusetitle=$row['container_reuse_title'];
				$currentcontainer->style=$row['container_style'];
				$currentcontainer->style_label=$row['container_style_label'];
				$currentcontainer->type=$row['container_type'];
				$currentcontainer->type_id=$row['container_type_id'];
				$currentcontainer->space_to_left=$row['container_space_to_left'];
				$currentcontainer->space_to_right=$row['container_space_to_right'];

				$currentcontainer->title=$row['container_title'];
				$currentcontainer->titleurl=$row['container_titleurl'];
				$currentcontainer->prolog=$row['container_prolog'];
				$currentcontainer->epilog=$row['container_epilog'];
				$currentcontainer->readmore=$row['container_readmore'];
				$currentcontainer->readmoreurl=$row['container_readmoreurl'];
				$currentcontainer->slots=array();
				$currentcontainer->storage=$this;
				$grid->container[]=$currentcontainer;
				$currentslot=NULL;
			}
			if($currentslot==NULL || $currentslot->slotid!=$row['slot_id'])
			{
				$currentslot=new grid_slot();
				$currentslot->grid=$grid;
				$currentslot->slotid=$row['slot_id'];
				$currentslot->style=$row['slot_style'];
				$currentslot->boxes=array();
				$currentslot->storage=$this;
				$currentcontainer->slots[]=$currentslot;
			}
			$boxtype=$row['box_type'];
			if($boxtype!=NULL)
			{
				$box=$this->parseBox($row);
				$box->grid=$grid;
				$currentslot->boxes[]=$box;
			}
		}
		
		return $currentcontainer;
	}
	
	public function loadGridByRevision($gridId,$revision)
	{
		$query="select published from ".$this->prefix."grid_grid where id=$gridId and revision=$revision";
		$result=$this->connection->query($query);
		$row=$result->fetch_assoc();

		$grid=new grid_grid();
		$grid->gridid=$gridId;
		$grid->isPublished=$row['published'];
		$grid->isDraft=!$row['published'];
		$grid->gridrevision=$revision;
		$grid->storage=$this;
		$grid->container=array();

		$query="select 
grid_container.id as container_id,
grid_container_style.slug as container_style,
grid_container.title as container_title,
grid_container.title_url as container_titleurl,
grid_container.prolog as container_prolog,
grid_container.epilog as container_epilog,
grid_container.readmore as container_readmore,
grid_container.readmore_url as container_readmoreurl,
grid_container.reuse_containerid as container_reuseid,
grid_container_style.style as container_style_label,
grid_container.type as container_type_id,
grid_container_type.type as container_type,
grid_container_type.space_to_right as container_space_to_right,
grid_container_type.space_to_left as container_space_to_left,
grid_container2slot.slot_id as slot_id,
grid_slot_style.slug as slot_style,
grid_box.id as box_id,
grid_box.title as box_title,
grid_box.title_url as box_titleurl,
grid_box.prolog as box_prolog,
grid_box.epilog as box_epilog,
grid_box.content as box_content,
grid_box.readmore as box_readmore,
grid_box.readmore_url as box_readmoreurl,
grid_box_type.type as box_type,
grid_box_style.slug as box_style,
grid_box_style.style as box_style_label
from ".$this->prefix."grid_grid2container grid_grid2container
left join ".$this->prefix."grid_container grid_container
     on container_id=grid_container.id 
     and grid_container.grid_id=grid_grid2container.grid_id 
     and grid_container.grid_revision=grid_grid2container.grid_revision
left join ".$this->prefix."grid_container_style grid_container_style
     on grid_container.style=grid_container_style.id
left join ".$this->prefix."grid_container2slot grid_container2slot
     on grid_container.id=grid_container2slot.container_id
     and grid_container.grid_id=grid_container2slot.grid_id
     and grid_container.grid_revision=grid_container2slot.grid_revision
left join ".$this->prefix."grid_slot grid_slot
     on grid_container2slot.slot_id=grid_slot.id
     and grid_slot.grid_id=grid_grid2container.grid_id
     and grid_slot.grid_revision=grid_grid2container.grid_revision
left join ".$this->prefix."grid_slot_style grid_slot_style
     on grid_slot.style=grid_slot_style.id
left join ".$this->prefix."grid_slot2box grid_slot2box
     on grid_container2slot.slot_id=grid_slot2box.slot_id
     and grid_container2slot.grid_id=grid_slot2box.grid_id
     and grid_container2slot.grid_revision=grid_slot2box.grid_revision
left join ".$this->prefix."grid_box grid_box
     on grid_slot2box.box_id=grid_box.id
     and grid_slot2box.grid_id=grid_box.grid_id
     and grid_slot2box.grid_revision=grid_box.grid_revision
left join ".$this->prefix."grid_container_type  grid_container_type
	 on grid_container.type=grid_container_type.id
left join ".$this->prefix."grid_box_type grid_box_type
	 on grid_box.type=grid_box_type.id
left join ".$this->prefix."grid_box_style grid_box_style
	 on grid_box.style=grid_box_style.id
where grid_grid2container.grid_id=$gridId and grid_grid2container.grid_revision=$revision
order by grid_grid2container.weight,grid_container2slot.weight,grid_slot2box.weight;";
		$result=$this->connection->query($query) or die($query);
		$currentcontainer=NULL;
		$currentslot=NULL;

		while($row=$result->fetch_assoc())
		{
			if($currentcontainer==NULL || $currentcontainer->containerid!=$row['container_id'])
			{
				if($row['container_reuseid']!='')
				{
					//TODO: we should load the referenced container instead
					$currentcontainer=$this->loadReuseContainer($row['container_reuseid']);
					$currentcontainer->grid=$grid;
					foreach($currentcontainer->slots as $slot)
					{
						$slot->grid=$grid;
						foreach($slot->boxes as $box)
						{
							$box->grid=$grid;
						}
					}
					$currentcontainer->containerid=$row['container_id'];
					$grid->container[]=$currentcontainer;
				}
				else
				{
					$currentcontainer=new grid_container();
					$currentcontainer->reused=FALSE;
					$currentcontainer->grid=$grid;
					$currentcontainer->containerid=$row['container_id'];
					$currentcontainer->style=$row['container_style'];
					$currentcontainer->style_label=$row['container_style_label'];
					$currentcontainer->type=$row['container_type'];
					$currentcontainer->type_id=$row['container_type_id'];
					$currentcontainer->space_to_left=$row['container_space_to_left'];
					$currentcontainer->space_to_right=$row['container_space_to_right'];
					$currentcontainer->title=$row['container_title'];
					$currentcontainer->titleurl=$row['container_titleurl'];
					$currentcontainer->prolog=$row['container_prolog'];
					$currentcontainer->epilog=$row['container_epilog'];
					$currentcontainer->readmore=$row['container_readmore'];
					$currentcontainer->readmoreurl=$row['container_readmoreurl'];
					$currentcontainer->slots=array();
					$currentcontainer->storage=$this;
					$grid->container[]=$currentcontainer;
					$currentslot=NULL;
				}
			}
			if(!$currentcontainer->reused)
			{
				if($currentslot==NULL || $currentslot->slotid!=$row['slot_id'])
				{
					$currentslot=new grid_slot();
					$currentslot->grid=$grid;
					$currentslot->slotid=$row['slot_id'];
					$currentslot->style=$row['slot_style'];
					$currentslot->boxes=array();
					$currentslot->storage=$this;
					$currentcontainer->slots[]=$currentslot;
				}
				$boxtype=$row['box_type'];
				if($boxtype!=NULL)
				{
					$box=$this->parseBox($row);
					$box->grid=$grid;
					$currentslot->boxes[]=$box;
				}
			}
		}
		return $grid;
	}

	//manages ajax call routing
	public function handleAjaxCall()
	{
		header("Content-Type: application/json; charset=UTF-8");
		if($_SERVER['REQUEST_METHOD']!='POST')
		{
			echo json_encode(array('error'=>'only POSTing is allowed'));
		}
		else
		{
			$input=file_get_contents("php://input");
			$json=json_decode($input);
			$method=$json->method;
			$params=$json->params;

			$this->ajaxEndpoint->storage=$this;
			try {
				$reflectionMethod=new reflectionMethod($this->ajaxEndpoint,$method);
				$retval=$reflectionMethod->invokeArgs($this->ajaxEndpoint,$params);
				echo json_encode(array('result'=>$retval));
			} catch (Exception $e) {
				echo json_encode(array('error'=>$e->getMessage()));
			}
		}
	}
	
	public function handleUpload()
	{
		$gridid=$_POST['gridid'];
		$containerid=$_POST['container'];
		$slotid=$_POST['slot'];
		$idx=$_POST['box'];
		$file=$_FILES['file']['tmp_name'];
		$original_filename=$_FILES['file']['name'];
		$key=$_POST['key'];
		$grid=$this->loadGrid($gridid);
		foreach($grid->container as $container)
		{
			if($container->containerid==$containerid)
			{
				foreach($container->slots as $slot)
				{
					if($slot->slotid==$slotid)
					{
						$box=$slot->boxes[$idx];
						return $box->performFileUpload($key,$file,$original_filename);
					}
				}
			}
		}
		return FALSE;//array('result'=>FALSE,'error'=>'box or slot or container or grid not found','gridid'=>$gridid,'container'=>$containerid,'slotid'=>$slotid,'box'=>$idx);
	}

	public function reuseContainer($grid,$container,$title)
	{
		//it's a lot easier to create a complete copy. so...
		
		$reuse=$this->getReuseGrid();
		$copy=$this->createContainer($reuse,$container->type);
		if($copy===FALSE)die("copy failed");
		$copy->update($container);
		for($i=0;$i<count($container->slots);$i++)
		{
			$newslot=$copy->slots[$i];
			if($newslot->boxes==NULL)
				$newslot->boxes=array();
			$oldslot=$container->slots[$i];
			foreach($oldslot->boxes as $box)
			{
				$type=$box->type();
				$classname="grid_".$type."_box";
				$boxcopy=new $classname();
				$boxcopy->storage=$this;
				$boxcopy->grid=$reuse;
				$boxcopy->updateBox($box);
				$ret=$boxcopy->persist();
				$result=$newslot->addBox(count($newslot->boxes),$boxcopy);
			}
		}
		$query="update ".$this->prefix."grid_container set reuse_title=\"".$this->saveStr($title)."\" where id=".$copy->containerid." and grid_id=-1 and grid_revision=0";
		$this->connection->query($query) or die($this->connection->error);
		$idx=array_search($container, $grid->container);
		if($idx===FALSE)die("index not found");
		$grid->removeContainer($container->containerid);
		$replacement=$grid->insertContainer("I-0",$idx);
		if($replacement===FALSE)die("replacement not created");
		$query="update ".$this->prefix."grid_container set reuse_containerid=".$copy->containerid." where id=".$replacement->containerid." and grid_id=".$grid->gridid." and grid_revision=".$grid->gridrevision;
		$this->connection->query($query) or die($this->connection->error);
		return $replacement;
	}
	
	public function convertToReferenceContainer($container,$reuseid)
	{
		$query="update ".$this->prefix."grid_container set reuse_containerid=$reuseid where id=".$container->containerid." and grid_id=".$container->grid->gridid." and grid_revision=".$container->grid->gridrevision;
		$this->connection->query($query) or die($this->connection->error);
	}

	public function createContainer($grid,$containertype)
	{
		$query="select id,type,space_to_left,space_to_right,numslots from ".$this->prefix."grid_container_type where type=\"$containertype\"";
		$result=$this->connection->query($query) or die($this->connection->error. ": ".$query);
		$row=$result->fetch_assoc();
		$type=$row['id'];
		$type_space_to_left = $row['space_to_left'];
		$type_space_to_right = $row['space_to_right'];
		$gridid=$grid->gridid;
		$gridrevision=$grid->gridrevision;
		//how to fetch the ID? well, how about max+1? know nothing better. but... that might generate sync problems.
		//OK, i need a container counter, slot counter and box counter on grid to do this.
		$query="select next_containerid from ".$this->prefix."grid_grid where id=$gridid and revision=$gridrevision";
		$nextid=$this->connection->query($query)->fetch_assoc();
		$id=$nextid['next_containerid'];
		$query="update ".$this->prefix."grid_grid set next_containerid=next_containerid+1 where id=$gridid and revision=$gridrevision";
		$this->connection->query($query);
		$query="insert into ".$this->prefix."grid_container (id,grid_id,grid_revision,type) values ($id,$gridid,$gridrevision,$type)";
		$this->connection->query($query) or die($this->connection->error.": ".$query);
		$container=new grid_container();
		$container->grid=$grid;
		$container->storage=$this;
		$container->containerid=$id;
		$container->type=$containertype;
		$container->type_id=$type;
		$container->style=$this->containerstyle;
		$container->slots=array();
		$container->space_to_left = $type_space_to_left;
		$container->space_to_right = $type_space_to_right;
		$numslots=$row['numslots'];
		for($i=1;$i<=$numslots;$i++)
		{
			$query="select next_slotid from ".$this->prefix."grid_grid where id=$gridid and revision=$gridrevision";
			$result=$this->connection->query($query);
			$row=$result->fetch_assoc();
			$slotid=$row['next_slotid'];
			$this->connection->query("update ".$this->prefix."grid_grid set next_slotid=next_slotid+1 where id=$gridid and revision=$gridrevision");
			$query="insert into ".$this->prefix."grid_slot (id,grid_id,grid_revision) values ($slotid,$gridid,$gridrevision)";
			$this->connection->query($query) or die($query."\n".$this->connection->error);
			$query="insert into ".$this->prefix."grid_container2slot (container_id,grid_id,grid_revision,slot_id,weight) values (".$container->containerid.",$gridid,$gridrevision,$slotid,$i)";
			$this->connection->query($query) or die($query."\n".$this->connection->error);

			$slot=new grid_slot();
			$slot->grid=$grid;
			$slot->slotid=$slotid;
			$slot->storage=$this;
			$slot->style=$this->slotstyle;
			$container->slots[]=$slot;
			$this->persistSlot($slot);
			if(strpos($containertype, "s-")===0)
			{
				$box=new grid_sidebar_box();
				$box->storage=$this;
				$box->grid=$grid;
				$box->persist();
				$slot->addBox(0,$box);
			}
		}
		$this->persistContainer($container);
		return $container;
	}

	public function storeContainerOrder($grid)
	{
		$query="delete from ".$this->prefix."grid_grid2container where grid_id=".$grid->gridid." and grid_revision=".$grid->gridrevision;
		$this->connection->query($query) or die($this->connection->error);
		$i=1;
		foreach($grid->container as $cnt)
		{
			$query="insert into ".$this->prefix."grid_grid2container (grid_id,grid_revision,container_id,weight) values (".$grid->gridid.",".$grid->gridrevision.",".$cnt->containerid.",".$i.")";
			$this->connection->query($query) or die($this->connection->error);
			$i++;
		}
	}
	
	public function storeSlotOrder($slot)
	{
		$grid=$slot->grid;
		$query="delete from ".$this->prefix."grid_slot2box where grid_id=".$grid->gridid." and grid_revision=".$grid->gridrevision." and slot_id=".$slot->slotid;
		$this->connection->query($query) or die($this->connection->error);
		$i=1;
		foreach($slot->boxes as $box)
		{
			$query="insert into ".$this->prefix."grid_slot2box (slot_id,grid_id,grid_revision,box_id,weight) values (".$slot->slotid.",".$grid->gridid.",".$grid->gridrevision.",".$box->boxid.",$i)";
			$this->connection->query($query) or die($this->connection->error);
			$i++;
		}
	}

	public function createRevision($grid)
	{
		$query="select max(revision) as revision from ".$this->prefix."grid_grid where id=".$grid->gridid;
		$result=$this->connection->query($query) or die($this->connection->error);
		$row=$result->fetch_assoc();
		$newrevision=$row['revision'];
		$newrevision=$newrevision+1;
		$query="insert into ".$this->prefix."grid_grid (id,revision,published,next_containerid,next_slotid,next_boxid,author,revision_date) select id,$newrevision,0,next_containerid,next_slotid,next_boxid,'".$this->author."',UNIX_TIMESTAMP() from ".$this->prefix."grid_grid where id=".$grid->gridid." and revision=".$grid->gridrevision;
		$this->connection->query($query);
		$query="insert into ".$this->prefix."grid_container (id,grid_id,grid_revision,type,style,title,title_url,prolog,epilog,readmore,readmore_url,reuse_containerid)
		select id,grid_id,$newrevision,type,style,title,title_url,prolog,epilog,readmore,readmore_url, reuse_containerid from ".$this->prefix."grid_container
		where grid_id=".$grid->gridid." and grid_revision=".$grid->gridrevision;
		$this->connection->query($query);
		$query="insert into ".$this->prefix."grid_grid2container (grid_id,grid_revision,container_id,weight)
		select grid_id,$newrevision,container_id,weight from ".$this->prefix."grid_grid2container
		where grid_id=".$grid->gridid." and grid_revision=".$grid->gridrevision;
		$this->connection->query($query);
		$query="insert into ".$this->prefix."grid_slot (id,grid_id,grid_revision,style) 
		select id,grid_id,$newrevision,style from ".$this->prefix."grid_slot
		where grid_id=".$grid->gridid." and grid_revision=".$grid->gridrevision;
		$this->connection->query($query);
		$query="insert into ".$this->prefix."grid_container2slot (container_id,grid_id,grid_revision,slot_id,weight)
		select container_id,grid_id,$newrevision,slot_id,weight from ".$this->prefix."grid_container2slot
		where grid_id=".$grid->gridid." and grid_revision=".$grid->gridrevision;
		$this->connection->query($query);
		$query="insert into ".$this->prefix."grid_box (id,grid_id,grid_revision,type,style,title,title_url,prolog,epilog,readmore,readmore_url,content)
		select id,grid_id,$newrevision,type,style,title,title_url,prolog,epilog,readmore,readmore_url,content from ".$this->prefix."grid_box
		where grid_id=".$grid->gridid." and grid_revision=".$grid->gridrevision;
		$this->connection->query($query);
		$query="insert into ".$this->prefix."grid_slot2box (slot_id,grid_id,grid_revision,box_id,weight) 
		select slot_id,grid_id,$newrevision,box_id,weight from ".$this->prefix."grid_slot2box
		where grid_id=".$grid->gridid." and grid_revision=".$grid->gridrevision;
		$this->connection->query($query);
		return $this->loadGridByRevision($grid->gridid,$newrevision);
	}

	public function publishGrid($grid)
	{
		$id=$grid->gridid;
		$revision=$grid->gridrevision;
		$query="update ".$this->prefix."grid_grid set published=0 where id=$id";
		$this->connection->query($query) or die($this->connection->error);
		$query="update ".$this->prefix."grid_grid set published=1 where id=$id and revision=$revision";
		$this->connection->query($query) or die($this->connection->error);
		return true;
	}
	
	public function gridRevisions($grid)
	{
		$id=$grid->gridid;
		$query="select revision,author,revision_date from ".$this->prefix."grid_grid where id=$id";
		$result=$this->connection->query($query);
		$return=array();
		while($row=$result->fetch_assoc())
		{
			$return[]=$row['revision'];
		}
		return $return;
	}

	public function revokeGrid($grid)
	{
		$id=$grid->gridid;
		$revision=$grid->gridrevision;
		$query="delete from ".$this->prefix."grid_box where grid_id=$id and grid_revision=$revision";
		$this->connection->query($query) or die($this->connection->error);
		$query="delete from ".$this->prefix."grid_slot2box where grid_id=$id and grid_revision=$revision";
		$this->connection->query($query) or die($this->connection->error);
		$query="delete from ".$this->prefix."grid_slot where grid_id=$id and grid_revision=$revision";
		$this->connection->query($query) or die($this->connection->error);
		$query="delete from ".$this->prefix."grid_container2slot where grid_id=$id and grid_revision=$revision";
		$this->connection->query($query) or die($this->connection->error);
		$query="delete from ".$this->prefix."grid_container where grid_id=$id and grid_revision=$revision";
		$this->connection->query($query) or die($this->connection->error);
		$query="delete from ".$this->prefix."grid_grid2container where grid_id=$id and grid_revision=$revision";
		$this->connection->query($query) or die($this->connection->error);
		$query="delete from ".$this->prefix."grid_grid where id=$id and revision=$revision";
		$this->connection->query($query) or die($this->connection->error);
		return true;
	}

	public function destroyContainer($container)
	{
		if(!$container->reused)
		{
			foreach($container->slots as $slot)
			{
				foreach($slot->boxes as $box)
				{
					$query="delete from ".$this->prefix."grid_box where id=".$box->boxid." and grid_id=".$box->grid->gridid." and grid_revision=".$box->grid->gridrevision;
					$this->connection->query($query) or die("Box deletion: ".$this->connection->error);
				}
				$query="delete from ".$this->prefix."grid_slot where id=".$slot->slotid." and grid_id=".$slot->grid->gridid." and grid_revision=".$slot->grid->gridrevision;
				$this->connection->query($query) or die("Slot deletion: ".$this->connection->error);
			}
			
		}
		$query="delete from ".$this->prefix."grid_container where id=".$container->containerid." and grid_id=".$container->grid->gridid." and grid_revision=".$container->grid->gridrevision;
		$this->connection->query($query) or die("Container deletion: ".$this->connection->error);
	}
	
	public function deleteBox($box)
	{
		$query="delete from ".$this->prefix."grid_box where id=".$box->boxid." and grid_id=".$box->grid->gridid." and grid_revision=".$box->grid->gridrevision;
		$this->connection->query($query) or die($this->connection->error);
	}
	
	public function persistContainer($container)
	{
		if($container->style==NULL)
		{
			$styleid="NULL";			
		}
		else
		{
			$query="select id from ".$this->prefix."grid_container_style where slug='".$container->style."'";
			$result=$this->connection->query($query);
			$row=$result->fetch_assoc();
			if(!isset($row['id']))
				return false;
			$styleid=$row['id'];
		}
		$query="update ".$this->prefix."grid_container set 
		 style=".$styleid.", 
		 title='".$this->saveStr($container->title)."',
		 title_url='".$this->saveStr($container->titleurl)."', 
		 prolog='".$this->saveStr($container->prolog)."', 
		 epilog='".$this->saveStr($container->epilog)."', 
		 readmore='".$this->saveStr($container->readmore)."', 
		 readmore_url='".$this->saveStr($container->readmoreurl)."' 
		 where id=".$container->containerid." and grid_id=".$container->grid->gridid." and grid_revision=".$container->grid->gridrevision;
		$this->connection->query($query) or die($this->connection->error);
		return true;
	}
	
	public function persistSlot($slot)
	{
		if($slot->style==NULL)
		{
			$styleid="NULL";
		}
		else
		{
			$query="select id from ".$this->prefix."grid_slot_style where slug='".$slot->style."'";
			$result=$this->connection->query($query);
			$row=$result->fetch_assoc();
			if(!isset($row['id']))
				return false;
			$styleid=$row['id'];
		}
		$query="update ".$this->prefix."grid_slot set style=".$styleid." where id=".$slot->slotid." and grid_id=".$slot->grid->gridid." and grid_revision=".$slot->grid->gridrevision;
		$this->connection->query($query) or die($this->connection->error);
		return true;
	}
	
	private function saveStr($str)
	{
		if($str==NULL)
			return "";
		return $this->connection->real_escape_string($str);
	}
	
	public function persistBox($box)
	{
		//no matter what we have to resolve the style
		$styleid="NULL";
		if($box->style!=NULL)
		{
			$query="select id from ".$this->prefix."grid_box_style where slug='".$box->style."'";
			$result=$this->connection->query($query) or die($this->connection->error);
			$row=$result->fetch_assoc();
			$styleid=$row['id'];
		}
		//no matter what we have to resolve the type
		$query="select id from ".$this->prefix."grid_box_type where type='".$box->type()."'";
		$result=$this->connection->query($query) or die($this->connection->error);
		$row=$result->fetch_assoc();
		if(!isset($row['id']))
		{
			$insertquery="insert into ".$this->prefix."grid_box_type (type) values ('".$box->type()."')";
			$this->connection->query($insertquery);
			$result=$this->connection->query($query);
			$row=$result->fetch_assoc();
//			return FALSE;
		}
		$type=$row['id'];
		if($box->boxid==NULL)
		{
			$query="select next_boxid from ".$this->prefix."grid_grid where id=".$box->grid->gridid." and revision=".$box->grid->gridrevision;
			$result=$this->connection->query($query) or die($query."\n".$this->connection->error);
			$row=$result->fetch_assoc();
			$query="update ".$this->prefix."grid_grid set next_boxid=next_boxid+1 where id=".$box->grid->gridid." and revision=".$box->grid->gridrevision;
			$this->connection->query($query) or die($this->connection->error);
			
			$query="insert into ".$this->prefix."grid_box (id,grid_id,grid_revision,type,title,title_url,prolog,epilog,readmore,readmore_url,content,style) values 
			(".$row['next_boxid'].",".$box->grid->gridid.",".$box->grid->gridrevision.",".$type."
			,'".$this->saveStr($box->title)."','".$this->saveStr($box->titleurl)."','".$this->saveStr($box->prolog)."','".$this->saveStr($box->epilog)."'
			,'".$this->saveStr($box->readmore)."','".$this->saveStr($box->readmoreurl)."','".$this->saveStr(json_encode($box->content))."',".$styleid.")";
			$this->connection->query($query) or die($query."\n".$this->connection->error);
			$box->boxid=$row['next_boxid'];
		}
		else
		{
			$query="update ".$this->prefix."grid_box set title='".$this->saveStr($box->title)."',
			 type=".$type.",
			 title_url='".$this->saveStr($box->titleurl)."',
			 prolog='".$this->saveStr($box->prolog)."',
			 epilog='".$this->saveStr($box->epilog)."',
			 readmore='".$this->saveStr($box->readmore)."',
			 readmore_url='".$this->saveStr($box->readmoreurl)."',
			 content='".$this->saveStr(json_encode($box->content))."',
			 style=".$styleid." where id=".$box->boxid." and grid_id=".$box->grid->gridid." and grid_revision=".$box->grid->gridrevision;
			$this->connection->query($query) or die($this->connection->error);
		}
		return TRUE;
	}
	
	public function fetchContainerTypes()
	{
		$query="select type,space_to_right,space_to_left,numslots from ".$this->prefix."grid_container_type";
		$result=$this->connection->query($query) or die($this->connection->error);
		$return=array();
		while($row=$result->fetch_assoc())
		{
			$return[]=array(
				'type'=>$row['type'],
				'space_to_left'=>$row['space_to_left'],
				'space_to_right'=>$row['space_to_right'],
				'numslots'=>$row['numslots']);
		}
		return $return;
	}
	
	public function createContainerType($type,$space_to_left,$space_to_right,$numslots)
	{
		$query="insert into ".$this->prefix."grid_container_type (type,space_to_left,space_to_right,numslots) values ('$type',";
		if($space_to_left==NULL)
			$query.="NULL,";
		else
			$query.="'$space_to_left',";
		if($space_to_right==NULL)
			$query.="NULL,";
		else
			$query.="'$space_to_right',";
		$query.="$numslots)";
		$this->connection->query($query) or die($this->connection->error).": ".$query;
	}
	
	public function fetchContainerStyles()
	{
		$query="select style,slug from ".$this->prefix."grid_container_style order by style asc";
		$result=$this->connection->query($query) or die($this->connection->error);
		$return=array();
		while($row=$result->fetch_assoc())
		{
			$return[]=array('title'=>$row['style'],'slug'=>$row['slug']);
		}
		return $return;
	}
	
	public function containerStyles()
	{
		$query="select id,style,slug from ".$this->prefix."grid_container_style order by id asc";
		$result=$this->connection->query($query) or die($this->connection->error);
		$return=array();
		while($row=$result->fetch_object())
		{
			$return[]=$row;
		}
		return $return;
	}
	
	public function createContainerStyle($slug,$style)
	{
		$query="insert into ".$this->prefix."grid_container_style (slug,style) values ('".$slug."','".$style."')";
		$this->connection->query($query) or die($this->connection->error);
	}
	
	public function deleteContainerStyle($id)
	{
		$query="delete from ".$this->prefix."grid_container_style where id=".$id;
		$this->connection->query($query) or die($this->connection->error);
	}
	
	public function updateContainerStyle($id,$slug,$style)
	{
		$query="update ".$this->prefix."grid_container_style set slug='".$slug."', style='".$style."' where id=".$id;
		$this->connection->query($query) or die($this->connection->error);
	}

	public function fetchSlotStyles()
	{
		$query="select style,slug from ".$this->prefix."grid_slot_style order by style asc";
		$result=$this->connection->query($query) or die($this->connection->error);
		$return=array();
		while($row=$result->fetch_assoc())
		{
			$return[]=array('title'=>$row['style'],'slug'=>$row['slug']);
		}
		return $return;
	}
	
	public function slotStyles()
	{
		$query="select id,style,slug from ".$this->prefix."grid_slot_style order by id asc";
		$result=$this->connection->query($query) or die($this->connection->error);
		$return=array();
		while($row=$result->fetch_object())
		{
			$return[]=$row;
		}
		return $return;
	}
	
	public function createSlotStyle($slug,$style)
	{
		$query="insert into ".$this->prefix."grid_slot_style (slug,style) values ('".$slug."','".$style."')";
		$this->connection->query($query) or die($this->connection->error);
	}
	
	public function deleteSlotStyle($id)
	{
		$query="delete from ".$this->prefix."grid_slot_style where id=".$id;
		$this->connection->query($query) or die($this->connection->error);
	}
	
	public function updateSlotStyle($id,$slug,$style)
	{
		$query="update ".$this->prefix."grid_slot_style set slug='".$slug."', style='".$style."' where id=".$id;
		$this->connection->query($query) or die($this->connection->error);
	}
	
	public function fetchBoxStyles()
	{
		$query="select style,slug from ".$this->prefix."grid_box_style order by style asc";
		$result=$this->connection->query($query) or die($this->connection->error);
		$return=array();
		while($row=$result->fetch_assoc())
		{
			$return[]=array('title'=>$row['style'],'slug'=>$row['slug']);
		}
		return $return;
	}
	
	public function boxStyles()
	{
		$query="select id,style,slug from ".$this->prefix."grid_box_style order by id asc";
		$result=$this->connection->query($query) or die($this->connection->error);
		$return=array();
		while($row=$result->fetch_object())
		{
			$return[]=$row;
		}
		return $return;
	}
	
	public function createBoxStyle($slug,$style)
	{
		$query="insert into ".$this->prefix."grid_box_style (slug,style) values ('".$slug."','".$style."')";
		$this->connection->query($query) or die($this->connection->error);
	}
	
	public function deleteBoxStyle($id)
	{
		$query="delete from ".$this->prefix."grid_box_style where id=".$id;
		$this->connection->query($query) or die($this->connection->error);
	}
	
	public function updateBoxStyle($id,$slug,$style)
	{
		$query="update ".$this->prefix."grid_box_style set slug='".$slug."', style='".$style."' where id=".$id;
		$this->connection->query($query) or die($this->connection->error);
	}
	
	
	public function loadBox($boxId)
	{
		$query="select 
		grid_box.id as box_id,
		grid_box_type.type as box_type,
		grid_box_style.slug as box_style,
		title as box_title,
		title_url as box_titleurl,
		prolog as box_prolog,
		epilog as box_epilog,
		readmore as box_readmore,
		readmore_url as box_readmoreurl,
		content as box_content
		from ".$this->prefix."grid_box
		left join ".$this->prefix."grid_box_type grid_box_type on grid_box.type=grid_box_type.id
		left join ".$this->prefix."grid_box_style grid_box_style on grid_box.style=grid_box_style.id ";
		$query.="where grid_box.id=$boxId";
		$result=$this->connection->query($query) or die($this->connection->error);
		$row=$result->fetch_assoc();
		return $this->parseBox($row);
	}

	public function fetchGridRevisions($gridid) {
		if(strncmp("box:",$gridid,strlen("box:"))!=0 && strncmp("container:",$gridid,strlen("container:"))!=0)
		{
			$query = "SELECT revision,author,revision_date,published FROM ".$this->prefix."grid_grid WHERE id = $gridid ORDER BY revision DESC LIMIT 20";
			$result=$this->connection->query($query) or die($this->connection->error);
			$revisions = array();
			$was_draft = false;
			// state=0 => depreciated
			// state=1 => published
			// state=2 => draft
			while($row=$result->fetch_assoc()) {
				$state = "deprecated";
				if(!$was_draft){
					$state="draft";
					$was_draft = true;
				}
				if($row["published"] == 1){
					$state = "published";
					$next_draft = true;
				}
				$revisions[] = array( 
								"revision" => $row["revision"], 
								"published"=> $row["published"],
								"state"=> $state,
								"editor"=> $row['author'],
								"date"=> $row['revision_date'],
								);
			}
			return $revisions;			
		}
		return array();
	}
	
	public function getMetaTypes() {
		$classes=get_declared_classes();
		$metaboxes=array();
		foreach($classes as $class)
		{
			if(is_subclass_of($class,"grid_box"))
			{
				$obj=new $class();
				if($obj->isMetaType())
				{
					$metaboxes[]=$obj;
				}
			}
		}
		return $metaboxes;		
	}
}