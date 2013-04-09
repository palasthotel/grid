<?php

class grid_db {

	public $ajaxEndpoint;
	private $connection;

	public function __construct($host,$user,$password,$database) {
		$this->connection=mysql_connect($host,$user,$password,true);
		mysql_select_db($database,$this->connection);

		$this->ajaxEndpoint=new grid_ajaxendpoint();
	}

	//loads a complete grid with all regions and boxes belonging to it.
	public function loadGrid($gridId,$preferDrafts=TRUE)
	{
		//before we begin, we have to fetch the correct revision so we can fire off the right queries.
		$query="select max(revision) as revision from grid_grid where id=$gridId and published=1";
		$result=mysql_query($query,$this->connection);
		$row=mysql_fetch_assoc($result);
		if(isset($row['revision']))
			$publishedRevision=$row['revision'];
		else
			$publishedRevision=-1;

		$query="select max(revision) as revision from grid_grid where id=$gridId";
		$result=mysql_query($query,$this->connection);
		$row=mysql_fetch_assoc($result);
		if(isset($row['revision']))
			$maxRevision=$row['revision'];
		else
			$maxRevision=-1;

		$revision=$publishedRevision;
		if(($preferDrafts && $maxRevision>$revision) || $revision==-1)
		{
			$revision=$maxRevision;
		}
	}

	public function loadGridByRevision($gridId,$revision)
	{
		$query="select published from grid_grid where id=$gridId and revision=$revision";
		$result=mysql_query($query,$this->connection);
		$row=mysql_fetch_assoc($result);

		$grid=new grid_grid();
		$grid->gridid=$gridId;
		$grid->isPublished=$row['published'];
		$grid->isDraft=!$row['published'];
		$grid->gridrevision=$revision;
		$grid->storage=$this;
		$grid->container=array();

		$query="select 
grid_container.id as container_id,
grid_container_style.style as container_style,
grid_container.title as container_title,
grid_container.title_url as container_titleurl,
grid_container.prolog as container_prolog,
grid_container.epilog as container_epilog,
grid_container.readmore as container_readmore,
grid_container.readmore_url as container_readmoreurl,
grid_container_type.type as container_type,
grid_container2slot.slot_id as slot_id,
grid_box.id as box_id,
grid_box.title as box_title,
grid_box.title_url as box_titleurl,
grid_box.prolog as box_prolog,
grid_box.epilog as box_epilog,
grid_box.content as box_content,
grid_box.readmore as box_readmore,
grid_box.readmore_url as box_readmoreurl,
grid_box_type.type as box_type

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
left join grid_slot2box 
     on grid_container2slot.slot_id=grid_slot2box.slot_id
     and grid_container2slot.grid_id=grid_slot2box.grid_id
     and grid_container2slot.grid_revision=grid_slot2box.grid_revision
left join grid_box 
     on grid_slot2box.box_id=grid_box.id
     and grid_slot2box.grid_id=grid_box.grid_id
     and grid_slot2box.grid_revision=grid_box.grid_revision
left join grid_container_type on grid_container.type=grid_container_type.id
left join grid_box_type on grid_box.type=grid_box_type.id
where grid_grid2container.grid_id=$gridId and grid_grid2container.grid_revision=$revision
order by grid_grid2container.weight,grid_container2slot.weight,grid_slot2box.weight;";
		$result=mysql_query($query,$this->connection);
		$currentcontainer=NULL;
		$currentslot=NULL;

		while($row=mysql_fetch_assoc($result))
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
				//TODO: STYLE FEHLT!!!
				$currentcontainer->storage=$this;
				$grid->container[]=$currentcontainer;
				$currentslot=NULL;
			}
			if($currentslot==NULL || $currentslot->slotid!=$row['slot_id'])
			{
				$currentslot=new grid_slot();
				$currentslot->grid=$grid;
				$currentslot->slotid=$row['slot_id'];
				$currentslot->boxes=array();
				$currentslot->storage=$this;
				$currentcontainer->slots[]=$currentslot;
			}
			$boxtype=$row['box_type'];
			if($boxtype!=NULL)
			{
				$class="grid_".$boxtype."_box";
				$box=new $class();
				$box->grid=$grid;
				$box->storage=$this;
				$box->boxid=$row['box_id'];
				$box->title=$row['box_title'];
				$box->titleurl=$row['box_titleurl'];
				$box->prolog=$row['box_prolog'];
				$box->epilog=$row['box_epilog'];
				$box->readmore=$row['box_readmore'];
				$box->readmoreurl=$row['box_readmoreurl'];
				$box->content=json_decode($row['box_content']);
				$currentslot->boxes[]=$box;
			}
		}
		return $grid;
	}

	//manages ajax call routing
	public function handleAjaxCall()
	{
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
		$result=mysql_query($query,$this->connection) or die(mysql_error());
		$row=mysql_fetch_assoc($result);
		$type=$row['id'];
		$gridid=$grid->gridid;
		$gridrevision=$grid->gridrevision;
		//how to fetch the ID? well, how about max+1? know nothing better. but... that might generate sync problems.
		//OK, i need a container counter, slot counter and box counter on grid to do this.
		$query="select next_containerid from grid_grid where id=$gridid and revision=$gridrevision";
		$row=mysql_query($query,$this->connection);
		$id=$row['next_containerid'];
		$query="update grid_grid set next_containerid=next_containerid+1 where id=$gridid and revision=$gridrevision";
		mysql_query($query,$this->connection);
		$query="insert into grid_container (id,grid_id,grid_revision,type) values ($id,$gridid,$gridrevision,\"$type\")";
		mysql_query($query,$this->connection) or die(mysql_error());
		$container=new grid_container();
		$container->grid=$grid;
		$container->storage=$this;
		$container->containerid=$id;
		$container->type=$containertype;
		$container->slots=array();

		for($i=1;$i<=$row['numslots'];$i++)
		{
			$query="select next_slotid from grid_grid where id=$gridid and revision=$gridrevision";
			$result=mysql_query($query,$this->connection);
			$row=mysql_fetch_assoc($query);
			$slotid=$row['next_slotid'];
			mysql_query("update grid_grid set next_slotid=next_slotid+1 where id=$gridid and revision=$gridrevision",$this->connection);
			$query="insert into grid_slot (id,gridid,gridrevision) values ($slotid,$gridid,$gridrevision)";
			mysql_query($query,$this->connection) or die(mysql_error());
			$query="insert into grid_container2slot (container_id,grid_id,grid_revision,slot_id,weight) values (".$container->containerid.",$gridid,$gridrevision,$slotid,$i)";
			mysql_query($query,$this->connection) or die(mysql_error());

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
		mysql_query($query,$this->connection) or die(mysql_error());
		$i=1;
		foreach($grid->container as $cnt)
		{
			$query="insert into grid_grid2container (grid_id,grid_revision,container_id,weight) values (".$grid->gridid.",".$grid->gridrevision.",".$cnt->containerid.",".$i.")";
			mysql_query($query,$this->connection) or die(mysql_error());
			$i++;
		}
	}

	public function createRevision($grid)
	{
		$newrevision=$grid->gridrevision+1;
		$query="insert into grid_grid (id,revision,published,next_containerid,next_slotid,next_boxid) select id,$newrevision,0,next_containerid,next_slotid,next_boxid from grid_grid where id=".$grid->gridid." and revision=".$grid->gridrevision;
		mysql_query($query,$this->connection);
		$query="insert into grid_container (id,grid_id,grid_revision,type,style,title,title_url,prolog,epilog,readmore,readmore_url)
		select id,grid_id,$newrevision,type,style,title,title_url,prolog,epilog,readmore,readmore_url from grid_container
		where grid_id=".$grid->gridid." and grid_revision=".$grid->gridrevision;
		mysql_query($query,$this->connection);
		$query="insert into grid_grid2container (grid_id,grid_revision,container_id,weight)
		select grid_id,$newrevision,container_id,weight from grid_grid2container
		where grid_id=".$grid->gridid." and grid_revision=".$grid->gridrevision;
		mysql_query($query,$this->connection);
		$query="insert into grid_slot (id,grid_id,grid_revision) 
		select id,grid_id,$newrevision from grid_slot
		where grid_id=".$grid->gridid." and grid_revision=".$grid->gridrevision;
		mysql_query($query,$this->connection);
		$query="insert into grid_container2slot (container_id,grid_id,grid_revision,slot_id,weight)
		select container_id,grid_id,$newrevision,slot_id,weight from grid_container2slot
		where grid_id=".$grid->gridid." and grid_revision=".$grid->gridrevision;
		mysql_query($query,$this->connection);
		$query="insert into grid_box (id,grid_id,grid_revision,type,title,title_url,prolog,epilog,readmore,readmore_url,content)
		select id,grid_id,$newrevision,type,title,title_url,prolog,epilog,readmore,readmore_url,content from grid_box
		where grid_id=".$grid->gridid." and grid_revision=".$grid->gridrevision;
		mysql_query($query,$this->connection);
		$query="insert into grid_slot2box (slot_id,grid_id,grid_revision,box_id,weight) 
		select slot_id,grid_id,$newrevision,box_id,weight from grid_slot2box
		where grid_id=".$grid->gridid." and grid_revision=".$grid->gridrevision;
		mysql_query($query,$this->connection);
		return $this->loadGridByRevision($grid->gridid,$newrevision);
	}

	public function destroyContainer($container)
	{
		foreach($container->slots as $slot)
		{
			foreach($slot->boxes as $box)
			{
				$query="delete from grid_box where id=".$box->boxid." and grid_id=".$box->grid->gridid." and grid_revision=".$box->grid->gridrevision;
				mysql_query($query,$this->connection) or die(mysql_error());
			}
			$query="delete from grid_slot where id=".$slot->slotid." and grid_id=".$box->grid->gridid." and grid_revision=".$box->grid->gridrevision;
			mysql_query($query,$this->connection) or die(mysql_error());
		}
		$query="delete from grid_container where id=".$container->containerid." and grid_id=".$box->grid->gridid." and grid_revision=".$box->grid->gridrevision;
		mysql_query($query,$this->connection) or die(mysql_error());
	}
	
	public function persistContainer($container)
	{
		$query="select id from grid_container_style where style='".$container->style."'";
		$result=mysql_query($query,$this->connection);
		$row=mysql_fetch_assoc($result);
		if(!isset($row['id']))
			return false;
		$styleid=$row['id'];
		$query="update grid_container set style=".$styleid.", title='".$container->title."', title_url='".$container->titleurl."', prolog='".$container->prolog."', epilog='".$container->epilog."', readmore='".$container->readmore."', readmore_url='".$container->readmoreurl."' where id=".$container->containerid." and grid_id=".$box->grid->gridid." and grid_revision=".$box->grid->gridrevision;
		mysql_query($query,$this->connection) or die(mysql_error());
		return true;
	}
}