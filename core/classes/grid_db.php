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
		$grid=new grid_grid();
		$grid->gridid=$gridId;
		$grid->storage=$this;
		$grid->container=array();

		$query="select id,draft_grid from grid_grid where id=$gridId";
		$result=mysql_query($query,$this->connection);
		$row=mysql_fetch_assoc($result);
		$grid->isDraft=false;
		if($row['draft_grid']!=NULL && $preferDrafts==TRUE)
		{
			$gridId=$row['draft_grid'];
			$grid->gridid=$gridId;
			$grid->isDraft=true;
		}
		else
		{
			$query="select id,draft_grid from grid_grid where draft_grid=$gridId";
			$result=mysql_query($query,$this->connection);
			$row=mysql_fetch_assoc($result);
			if($row!==false)
			{
				$grid->isDraft=true;
			}
		}

		$query="select 
grid_container.id as container_id,
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
left join grid_container on container_id=grid_container.id 
left join grid_container2slot on grid_container.id=grid_container2slot.container_id
left join grid_slot2box on grid_container2slot.slot_id=grid_slot2box.slot_id
left join grid_box on grid_slot2box.box_id=grid_box.id
left join grid_container_type on grid_container.type=grid_container_type.id
left join grid_box_type on grid_box.type=grid_box_type.id
where grid_grid2container.grid_id=$gridId
order by grid_grid2container.weight,grid_container2slot.weight,grid_slot2box.weight;";
		$result=mysql_query($query,$this->connection);
		$currentcontainer=NULL;
		$currentslot=NULL;

		while($row=mysql_fetch_assoc($result))
		{
			if($currentcontainer==NULL || $currentcontainer->containerid!=$row['container_id'])
			{
				$currentcontainer=new grid_container();
				$currentcontainer->containerid=$row['container_id'];
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

	public function createContainer($containertype)
	{
		$query="select id,type,numslots from grid_container_type where type=\"$containertype\"";
		$result=mysql_query($query,$this->connection) or die(mysql_error());
		$row=mysql_fetch_assoc($result);
		$query="insert into grid_container (type) values (\"".$row['id']."\")";
		mysql_query($query,$this->connection) or die(mysql_error());
		$id=mysql_insert_id($this->connection);
		$container=new grid_container();
		$container->storage=$this;
		$container->containerid=$id;
		$container->type=$containertype;
		$container->slots=array();

		for($i=1;$i<=$row['numslots'];$i++)
		{
			$query="insert into grid_slot values ()";
			mysql_query($query,$this->connection) or die(mysql_error());
			$slotid=mysql_insert_id($this->connection);
			$query="insert into grid_container2slot (container_id,slot_id,weight) values (".$container->containerid.",".$slotid.",".$i.")";
			mysql_query($query,$this->connection) or die(mysql_error());

			$slot=new grid_slot();
			$slot->slotid=$slotid;
			$slot->storage=$this;
			$container->slots[]=$slot;
		}
		return $container;
	}

	public function storeContainerOrder($grid)
	{
		$query="delete from grid_grid2container where grid_id=".$grid->gridid;
		mysql_query($query,$this->connection) or die(mysql_error());
		$i=1;
		foreach($grid->container as $cnt)
		{
			$query="insert into grid_grid2container (grid_id,container_id,weight) values (".$grid->gridid.",".$cnt->containerid.",".$i.")";
			mysql_query($query,$this->connection) or die(mysql_error());
			$i++;
		}
	}

	public function cloneGrid($grid)
	{
		$query="insert into grid_grid values()";
		mysql_query($query,$this->connection);
		$gridid=mysql_insert_id($this->connection);
		$cntweight=1;
		foreach($grid->container as $container)
		{
			$query="insert into grid_container select type,style,title,title_url,prolog,epilog,readmore,readmore_url from grid_container where id=".$container->containerid;
			mysql_query($query,$this->connection) or die(mysql_error());
			$containerid=mysql_insert_id($this->connection);
			$query="insert into grid_grid2container (grid_id,container_id,weight) values (".$gridid.",".$containerid.",".$cntweight.")";
			mysql_query($query,$this->connection) or die(mysql_error());
			$slotweight=1;
			foreach($container->slots as $slot)
			{
				$query="insert into grid_slot values ()";
				mysql_query($query,$this->connection) or die(mysql_error());
				$slot_id=mysql_insert_id($this->connection);
				$query="insert into grid_container2slot (container_id,slot_id,weight) values (".$containerid.",".$slot_id.",".$slotweight.")";
				mysql_query($query,$this->connection) or die(mysql_error());
				$boxweight=1;
				foreach($slot->boxes as $box)
				{
					$query="insert into grid_box select type,title,title_url,prolog,epilog,readmore,readmore_url,content where id=".$box->boxid;
					mysql_query($query,$this->connection) or die(mysql_error());
					$box_id=mysql_insert_id($this->connection);
					$query="insert into grid_slot2box (slot_id,box_id,weight) values (".$slot_id.",".$box_id.",".$boxweight.")";
					mysql_query($query,$this->connection) or die(mysql_error());
					$boxweight++;
				}

				$slotweight++;
			}
			$cntweight++;
		}
		return $this->loadGrid($gridid);
	}

	public function setDraft($original,$draft)
	{
		$query="update grid_grid set draft_grid=".$draft->gridid." where id=".$original->gridid;
		mysql_query($query,$this->connection) or die(mysql_error());
	}

	public function destroyContainer($container)
	{
		foreach($container->slots as $slot)
		{
			foreach($slot->boxes as $box)
			{
				$query="delete from grid_box where id=".$box->boxid;
				mysql_query($query,$this->connection) or die(mysql_error());
			}
			$query="delete from grid_slot where id=".$slot->slotid;
			mysql_query($query,$this->connection) or die(mysql_error());
		}
		$query="delete from grid_container where id=".$container->containerid;
		mysql_query($query,$this->connection) or die(mysql_error());
	}
}