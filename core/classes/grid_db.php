<?php

class grid_db {

	public $ajaxEndpoint;
	private $connection;

	public function __construct($host,$user,$password,$database) {
		$this->connection=new mysqli($host,$user,$password,$database);
		$this->connection->set_charset("utf8");

		$this->ajaxEndpoint=new grid_ajaxendpoint();
	}

	//loads a complete grid with all regions and boxes belonging to it.
	public function loadGrid($gridId,$preferDrafts=TRUE)
	{
		//before we begin, we have to fetch the correct revision so we can fire off the right queries.
		$query="select max(revision) as revision from grid_grid where id=$gridId and published=1";
		$result=$this->connection->query($query);
		$row=$result->fetch_assoc();
		if(isset($row['revision']))
			$publishedRevision=$row['revision'];
		else
			$publishedRevision=-1;

		$query="select max(revision) as revision from grid_grid where id=$gridId";
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
		$box->title=$row['box_title'];
		$box->titleurl=$row['box_titleurl'];
		$box->prolog=$row['box_prolog'];
		$box->epilog=$row['box_epilog'];
		$box->readmore=$row['box_readmore'];
		$box->readmoreurl=$row['box_readmoreurl'];
		$box->content=json_decode($row['box_content']);
		return $box;
	}

	public function loadGridByRevision($gridId,$revision)
	{
		$query="select published from grid_grid where id=$gridId and revision=$revision";
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
grid_container_type.type as container_type,
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
grid_box_style.slug as box_style
from grid_grid2container 
left join grid_container 
     on container_id=grid_container.id 
     and grid_container.grid_id=grid_grid2container.grid_id 
     and grid_container.grid_revision=grid_grid2container.grid_revision
left join grid_container_style 
     on grid_container.style=grid_container_style.id
left join grid_container2slot 
     on grid_container.id=grid_container2slot.container_id
     and grid_container.grid_id=grid_container2slot.grid_id
     and grid_container.grid_revision=grid_container2slot.grid_revision
left join grid_slot
     on grid_container2slot.slot_id=grid_slot.id
     and grid_slot.grid_id=grid_grid2container.grid_id
     and grid_slot.grid_revision=grid_grid2container.grid_revision
left join grid_slot_style
     on grid_slot.style=grid_slot_style.id
left join grid_slot2box 
     on grid_container2slot.slot_id=grid_slot2box.slot_id
     and grid_container2slot.grid_id=grid_slot2box.grid_id
     and grid_container2slot.grid_revision=grid_slot2box.grid_revision
left join grid_box 
     on grid_slot2box.box_id=grid_box.id
     and grid_slot2box.grid_id=grid_box.grid_id
     and grid_slot2box.grid_revision=grid_box.grid_revision
left join grid_container_type 
	 on grid_container.type=grid_container_type.id
left join grid_box_type 
	 on grid_box.type=grid_box_type.id
left join grid_box_style
	 on grid_box.style=grid_box_style.id
where grid_grid2container.grid_id=$gridId and grid_grid2container.grid_revision=$revision
order by grid_grid2container.weight,grid_container2slot.weight,grid_slot2box.weight;";
		$result=$this->connection->query($query);
		$currentcontainer=NULL;
		$currentslot=NULL;

		while($row=$result->fetch_assoc())
		{
			if($currentcontainer==NULL || $currentcontainer->containerid!=$row['container_id'])
			{
				$currentcontainer=new grid_container();
				$currentcontainer->grid=$grid;
				$currentcontainer->containerid=$row['container_id'];
				$currentcontainer->style=$row['container_style'];
				$currentcontainer->type=$row['container_type'];
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

	public function createContainer($grid,$containertype)
	{
		$query="select id,type,numslots from grid_container_type where type=\"$containertype\"";
		$result=$this->connection->query($query) or die($this->connection->error);
		$row=$result->fetch_assoc();
		$type=$row['id'];
		$gridid=$grid->gridid;
		$gridrevision=$grid->gridrevision;
		//how to fetch the ID? well, how about max+1? know nothing better. but... that might generate sync problems.
		//OK, i need a container counter, slot counter and box counter on grid to do this.
		$query="select next_containerid from grid_grid where id=$gridid and revision=$gridrevision";
		$nextid=$this->connection->query($query)->fetch_assoc();
		$id=$nextid['next_containerid'];
		$query="update grid_grid set next_containerid=next_containerid+1 where id=$gridid and revision=$gridrevision";
		$this->connection->query($query);
		$query="insert into grid_container (id,grid_id,grid_revision,type) values ($id,$gridid,$gridrevision,$type)";
		$this->connection->query($query) or die($this->connection->error);
		$container=new grid_container();
		$container->grid=$grid;
		$container->storage=$this;
		$container->containerid=$id;
		$container->type=$containertype;
		$container->slots=array();
		$numslots=$row['numslots'];
		for($i=1;$i<=$numslots;$i++)
		{
			$query="select next_slotid from grid_grid where id=$gridid and revision=$gridrevision";
			$result=$this->connection->query($query);
			$row=$result->fetch_assoc();
			$slotid=$row['next_slotid'];
			$this->connection->query("update grid_grid set next_slotid=next_slotid+1 where id=$gridid and revision=$gridrevision");
			$query="insert into grid_slot (id,grid_id,grid_revision) values ($slotid,$gridid,$gridrevision)";
			$this->connection->query($query) or die($this->connection->error);
			$query="insert into grid_container2slot (container_id,grid_id,grid_revision,slot_id,weight) values (".$container->containerid.",$gridid,$gridrevision,$slotid,$i)";
			$this->connection->query($query) or die($this->connection->error);

			$slot=new grid_slot();
			$slot->grid=$grid;
			$slot->slotid=$slotid;
			$slot->storage=$this;
			$container->slots[]=$slot;
		}
		return $container;
	}

	public function storeContainerOrder($grid)
	{
		$query="delete from grid_grid2container where grid_id=".$grid->gridid." and grid_revision=".$grid->gridrevision;
		$this->connection->query($query) or die($this->connection->error);
		$i=1;
		foreach($grid->container as $cnt)
		{
			$query="insert into grid_grid2container (grid_id,grid_revision,container_id,weight) values (".$grid->gridid.",".$grid->gridrevision.",".$cnt->containerid.",".$i.")";
			$this->connection->query($query) or die($this->connection->error);
			$i++;
		}
	}
	
	public function storeSlotOrder($slot)
	{
		$grid=$slot->grid;
		$query="delete from grid_slot2box where grid_id=".$grid->gridid." and grid_revision=".$grid->gridrevision." and slot_id=".$slot->slotid;
		$this->connection->query($query) or die($this->connection->error);
		$i=1;
		foreach($slot->boxes as $box)
		{
			$query="insert into grid_slot2box (slot_id,grid_id,grid_revision,box_id,weight) values (".$slot->slotid.",".$grid->gridid.",".$grid->gridrevision.",".$box->boxid.",$i)";
			$this->connection->query($query) or die($this->connection->error);
			$i++;
		}
	}

	public function createRevision($grid)
	{
		$newrevision=$grid->gridrevision+1;
		$query="insert into grid_grid (id,revision,published,next_containerid,next_slotid,next_boxid) select id,$newrevision,0,next_containerid,next_slotid,next_boxid from grid_grid where id=".$grid->gridid." and revision=".$grid->gridrevision;
		$this->connection->query($query);
		$query="insert into grid_container (id,grid_id,grid_revision,type,style,title,title_url,prolog,epilog,readmore,readmore_url)
		select id,grid_id,$newrevision,type,style,title,title_url,prolog,epilog,readmore,readmore_url from grid_container
		where grid_id=".$grid->gridid." and grid_revision=".$grid->gridrevision;
		$this->connection->query($query);
		$query="insert into grid_grid2container (grid_id,grid_revision,container_id,weight)
		select grid_id,$newrevision,container_id,weight from grid_grid2container
		where grid_id=".$grid->gridid." and grid_revision=".$grid->gridrevision;
		$this->connection->query($query);
		$query="insert into grid_slot (id,grid_id,grid_revision) 
		select id,grid_id,$newrevision from grid_slot
		where grid_id=".$grid->gridid." and grid_revision=".$grid->gridrevision;
		$this->connection->query($query);
		$query="insert into grid_container2slot (container_id,grid_id,grid_revision,slot_id,weight)
		select container_id,grid_id,$newrevision,slot_id,weight from grid_container2slot
		where grid_id=".$grid->gridid." and grid_revision=".$grid->gridrevision;
		$this->connection->query($query);
		$query="insert into grid_box (id,grid_id,grid_revision,type,title,title_url,prolog,epilog,readmore,readmore_url,content)
		select id,grid_id,$newrevision,type,title,title_url,prolog,epilog,readmore,readmore_url,content from grid_box
		where grid_id=".$grid->gridid." and grid_revision=".$grid->gridrevision;
		$this->connection->query($query);
		$query="insert into grid_slot2box (slot_id,grid_id,grid_revision,box_id,weight) 
		select slot_id,grid_id,$newrevision,box_id,weight from grid_slot2box
		where grid_id=".$grid->gridid." and grid_revision=".$grid->gridrevision;
		$this->connection->query($query);
		return $this->loadGridByRevision($grid->gridid,$newrevision);
	}

	public function publishGrid($grid)
	{
		$id=$grid->gridid;
		$revision=$grid->gridrevision;
		$query="update grid_grid set published=0 where id=$id";
		$this->connection->query($query) or die($this->connection->error);
		$query="update grid_grid set published=1 where id=$id and revision=$revision";
		$this->connection->query($query) or die($this->connection->error);
		return true;
	}

	public function revokeGrid($grid)
	{
		$id=$grid->gridid;
		$revision=$grid->gridrevision;
		$query="delete from grid_box where grid_id=$id and grid_revision=$revision";
		$this->connection->query($query) or die($this->connection->error);
		$query="delete from grid_slot2box where grid_id=$id and grid_revision=$revision";
		$this->connection->query($query) or die($this->connection->error);
		$query="delete from grid_slot where grid_id=$id and grid_revision=$revision";
		$this->connection->query($query) or die($this->connection->error);
		$query="delete from grid_container2slot where grid_id=$id and grid_revision=$revision";
		$this->connection->query($query) or die($this->connection->error);
		$query="delete from grid_container where grid_id=$id and grid_revision=$revision";
		$this->connection->query($query) or die($this->connection->error);
		$query="delete from grid_grid2container where grid_id=$id and grid_revision=$revision";
		$this->connection->query($query) or die($this->connection->error);
		$query="delete from grid_grid where id=$id and revision=$revision";
		$this->connection->query($query) or die($this->connection->error);
		return true;
	}

	public function destroyContainer($container)
	{
		foreach($container->slots as $slot)
		{
			foreach($slot->boxes as $box)
			{
				$query="delete from grid_box where id=".$box->boxid." and grid_id=".$box->grid->gridid." and grid_revision=".$box->grid->gridrevision;
				$this->connection->query($query) or die("Box deletion: ".$this->connection->error);
			}
			$query="delete from grid_slot where id=".$slot->slotid." and grid_id=".$slot->grid->gridid." and grid_revision=".$slot->grid->gridrevision;
			$this->connection->query($query) or die("Slot deletion: ".$this->connection->error);
		}
		$query="delete from grid_container where id=".$container->containerid." and grid_id=".$container->grid->gridid." and grid_revision=".$container->grid->gridrevision;
		$this->connection->query($query) or die("Container deletion: ".$this->connection->error);
	}
	
	public function deleteBox($box)
	{
		$query="delete from grid_box where id=".$box->boxid." and grid_id=".$box->grid->gridid." and grid_revision=".$box->grid->gridrevision;
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
			$query="select id from grid_container_style where slug='".$container->style."'";
			$result=$this->connection->query($query);
			$row=$result->fetch_assoc();
			if(!isset($row['id']))
				return false;
			$styleid=$row['id'];
		}
		$query="update grid_container set 
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
			$query="select id from grid_slot_style where slug='".$slot->style."'";
			$result=$this->connection->query($query);
			$row=$result->fetch_assoc();
			if(!isset($row['id']))
				return false;
			$styleid=$row['id'];
		}
		$query="update grid_slot set style=".$styleid." where id=".$slot->slotid." and grid_id=".$slot->grid->gridid." and grid_revision=".$slot->grid->gridrevision;
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
			$query="select id from grid_box_style where slug='".$box->style."'";
			$result=$this->connection->query($query) or die($this->connection->error);
			$row=$result->fetch_assoc();
			$styleid=$row['id'];
		}
		//no matter what we have to resolve the type
		$query="select id from grid_box_type where type='".$box->type()."'";
		$result=$this->connection->query($query) or die($this->connection->error);
		$row=$result->fetch_assoc();
		if(!isset($row['id']))
			return FALSE;
		$type=$row['id'];
		if($box->boxid==NULL)
		{
			$query="select next_boxid from grid_grid where id=".$box->grid->gridid." and revision=".$box->grid->gridrevision;
			$result=$this->connection->query($query) or die($this->connection->error);
			$row=$result->fetch_assoc();
			$query="update grid_grid set next_boxid=next_boxid+1 where id=".$box->grid->gridid." and revision=".$box->grid->gridrevision;
			$this->connection->query($query) or die($this->connection->error);
			
			$query="insert into grid_box (id,grid_id,grid_revision,type,title,title_url,prolog,epilog,readmore,readmore_url,content,style) values 
			(".$row['next_boxid'].",".$box->grid->gridid.",".$box->grid->gridrevision.",".$type."
			,'".$this->saveStr($box->title)."','".$this->saveStr($box->titleurl)."','".$this->saveStr($box->prolog)."','".$this->saveStr($box->epilog)."'
			,'".$this->saveStr($box->readmore)."','".$this->saveStr($box->readmoreurl)."','".$this->saveStr(json_encode($box->content))."',".$styleid.")";
			$this->connection->query($query) or die($this->connection->error);
			$box->boxid=$row['next_boxid'];
		}
		else
		{
			$query="update grid_box set title='".$this->saveStr($box->title)."',
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
	
	public function fetchContainerStyles()
	{
		$query="select style,slug from grid_container_style order by style asc";
		$result=$this->connection->query($query) or die($this->connection->error);
		$return=array();
		while($row=$result->fetch_assoc())
		{
			$return[]=array('title'=>$row['style'],'slug'=>$row['slug']);
		}
		return $return;
	}

	public function fetchSlotStyles()
	{
		$query="select style,slug from grid_slot_style order by style asc";
		$result=$this->connection->query($query) or die($this->connection->error);
		$return=array();
		while($row=$result->fetch_assoc())
		{
			$return[]=array('title'=>$row['style'],'slug'=>$row['slug']);
		}
		return $return;
	}
	
	public function fetchBoxStyles()
	{
		$query="select style,slug from grid_box_style order by style asc";
		$result=$this->connection->query($query) or die($this->connection->error);
		$return=array();
		while($row=$result->fetch_assoc())
		{
			$return[]=array('title'=>$row['style'],'slug'=>$row['slug']);
		}
		return $return;
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
		from grid_box
		left join grid_box_type on grid_box.type=grid_box_type.id
		left join grid_box_style on grid_box.style=grid_box_style.id ";
		$query.="where grid_box.id=$boxId";
		$result=$this->connection->query($query) or die($this->connection->error);
		$row=$result->fetch_assoc();
		return $this->parseBox($row);
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