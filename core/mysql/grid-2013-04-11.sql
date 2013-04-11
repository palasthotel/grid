# ************************************************************
# Sequel Pro SQL dump
# Version 4004
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Host: 127.0.0.1 (MySQL 5.1.66-0+squeeze1)
# Datenbank: grid
# Erstellungsdauer: 2013-04-11 14:07:13 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Export von Tabelle grid_box
# ------------------------------------------------------------

DROP TABLE IF EXISTS `grid_box`;

CREATE TABLE `grid_box` (
  `id` int(11) unsigned NOT NULL,
  `type` int(11) unsigned DEFAULT NULL,
  `title` mediumtext,
  `title_url` mediumtext,
  `prolog` mediumtext,
  `epilog` mediumtext,
  `readmore` mediumtext,
  `readmore_url` mediumtext,
  `content` text,
  PRIMARY KEY (`id`),
  KEY `type` (`type`),
  CONSTRAINT `grid_box_ibfk_1` FOREIGN KEY (`type`) REFERENCES `grid_box_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `grid_box` WRITE;
/*!40000 ALTER TABLE `grid_box` DISABLE KEYS */;

INSERT INTO `grid_box` (`id`, `type`, `title`, `title_url`, `prolog`, `epilog`, `readmore`, `readmore_url`, `content`)
VALUES
	(0,1,'Textbox','http://www.google.com/','<p>Dies ist ein Prolog</p>','<p>dies ist ein epilog</p>','','','{\"html\":\"Dies ist der Content\"}'),
	(1,1,'Twitter','http://www.google.com/','<p>Dies ist ein Prolog</p>','<p>dies ist ein epilog</p>','','','{\"html\":\"Dies ist der Content\"}'),
	(2,1,'Abbonieren','http://www.google.com/','<p>Dies ist ein Prolog</p>','<p>dies ist ein epilog</p>','','','{\"html\":\"Dies ist der Content\"}'),
	(3,1,'Fubar','http://www.google.com/','<p>Dies ist ein Prolog</p>','<p>dies ist ein epilog</p>','','','{\"html\":\"Dies ist der Content\"}'),
	(4,1,'Facebook','http://www.google.com/','<p>Dies ist ein Prolog</p>','<p>dies ist ein epilog</p>','','','{\"html\":\"Dies ist der Content\"}'),
	(5,1,'Amazon','http://www.google.com/','<p>Dies ist ein Prolog</p>','<p>dies ist ein epilog</p>','','','{\"html\":\"Dies ist der Content\"}'),
	(6,1,'LinkedIn','http://www.google.com/','<p>Dies ist ein Prolog</p>','<p>dies ist ein epilog</p>','','','{\"html\":\"Dies ist der Content\"}'),
	(7,1,'Teckel','http://www.google.com/','<p>Dies ist ein Prolog</p>','<p>dies ist ein epilog</p>','','','{\"html\":\"Dies ist der Content\"}'),
	(8,1,'Yorkshire','http://www.google.com/','<p>Dies ist ein Prolog</p>','<p>dies ist ein epilog</p>','','','{\"html\":\"Dies ist der Content\"}'),
	(9,1,'Norwegische Waldkatze','http://www.google.com/','<p>Dies ist ein Prolog</p>','<p>dies ist ein epilog</p>','','','{\"html\":\"Dies ist der Content\"}'),
	(10,1,'West highland white terrier','http://www.google.com/','<p>Dies ist ein Prolog</p>','<p>dies ist ein epilog</p>','','','{\"html\":\"Dies ist der Content\"}'),
	(11,1,'Schäferhund','http://www.google.com/','<p>Dies ist ein Prolog</p>','<p>dies ist ein epilog</p>','','','{\"html\":\"Dies ist der Content\"}'),
	(12,1,'Huskie','http://www.google.com/','<p>Dies ist ein Prolog</p>','<p>dies ist ein epilog</p>','','','{\"html\":\"Dies ist der Content\"}'),
	(13,1,'StudiVZ','http://www.google.com/','<p>Dies ist ein Prolog</p>','<p>dies ist ein epilog</p>','','','{\"html\":\"Dies ist der Content\"}'),
	(14,1,'MySpace','http://www.google.com/','<p>Dies ist ein Prolog</p>','<p>dies ist ein epilog</p>','','','{\"html\":\"Dies ist der Content\"}'),
	(15,1,'LongHorn','http://www.google.com/','<p>Dies ist ein Prolog</p>','<p>dies ist ein epilog</p>','','','{\"html\":\"Dies ist der Content\"}');

/*!40000 ALTER TABLE `grid_box` ENABLE KEYS */;
UNLOCK TABLES;


# Export von Tabelle grid_box_type
# ------------------------------------------------------------

DROP TABLE IF EXISTS `grid_box_type`;

CREATE TABLE `grid_box_type` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `grid_box_type` WRITE;
/*!40000 ALTER TABLE `grid_box_type` DISABLE KEYS */;

INSERT INTO `grid_box_type` (`id`, `type`)
VALUES
	(1,'html');

/*!40000 ALTER TABLE `grid_box_type` ENABLE KEYS */;
UNLOCK TABLES;


# Export von Tabelle grid_container
# ------------------------------------------------------------

DROP TABLE IF EXISTS `grid_container`;

CREATE TABLE `grid_container` (
  `id` int(11) unsigned NOT NULL,
  `grid_id` int(11) unsigned NOT NULL DEFAULT '0',
  `grid_revision` int(11) NOT NULL DEFAULT '0',
  `type` int(11) unsigned DEFAULT NULL,
  `style` int(11) unsigned DEFAULT NULL,
  `title` mediumtext,
  `title_url` mediumtext,
  `prolog` mediumtext,
  `epilog` mediumtext,
  `readmore` mediumtext,
  `readmore_url` mediumtext,
  PRIMARY KEY (`id`,`grid_id`,`grid_revision`),
  KEY `type` (`type`),
  KEY `style` (`style`),
  CONSTRAINT `grid_container_ibfk_1` FOREIGN KEY (`type`) REFERENCES `grid_container_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `grid_container_ibfk_2` FOREIGN KEY (`style`) REFERENCES `grid_container_style` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `grid_container` WRITE;
/*!40000 ALTER TABLE `grid_container` DISABLE KEYS */;

INSERT INTO `grid_container` (`id`, `grid_id`, `grid_revision`, `type`, `style`, `title`, `title_url`, `prolog`, `epilog`, `readmore`, `readmore_url`)
VALUES
	(24,42,1,5,NULL,'C-2-2-2-2-2- asdf','asdf asdf','test','test','url asdf','url'),
	(29,42,1,2,NULL,'C-4-4-4 asdf','url','test','test','readmore','url'),
	(30,42,1,1,NULL,'C-12','url','test','test','readmore','url');

/*!40000 ALTER TABLE `grid_container` ENABLE KEYS */;
UNLOCK TABLES;


# Export von Tabelle grid_container_style
# ------------------------------------------------------------

DROP TABLE IF EXISTS `grid_container_style`;

CREATE TABLE `grid_container_style` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `style` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `grid_container_style` WRITE;
/*!40000 ALTER TABLE `grid_container_style` DISABLE KEYS */;

INSERT INTO `grid_container_style` (`id`, `style`)
VALUES
	(1,'freeform');

/*!40000 ALTER TABLE `grid_container_style` ENABLE KEYS */;
UNLOCK TABLES;


# Export von Tabelle grid_container_type
# ------------------------------------------------------------

DROP TABLE IF EXISTS `grid_container_type`;

CREATE TABLE `grid_container_type` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(255) DEFAULT NULL,
  `numslots` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `grid_container_type` WRITE;
/*!40000 ALTER TABLE `grid_container_type` DISABLE KEYS */;

INSERT INTO `grid_container_type` (`id`, `type`, `numslots`)
VALUES
	(1,'C-12',1),
	(2,'C-4-4-4',3),
	(3,'C-8-4',2),
	(4,'C-4-8',2),
	(5,'C-2-2-2-2-2-2',6);

/*!40000 ALTER TABLE `grid_container_type` ENABLE KEYS */;
UNLOCK TABLES;


# Export von Tabelle grid_container2slot
# ------------------------------------------------------------

DROP TABLE IF EXISTS `grid_container2slot`;

CREATE TABLE `grid_container2slot` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `container_id` int(11) unsigned DEFAULT NULL,
  `grid_id` int(11) unsigned DEFAULT NULL,
  `grid_revision` int(11) DEFAULT NULL,
  `slot_id` int(11) unsigned DEFAULT NULL,
  `weight` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `container_id` (`container_id`),
  KEY `slot_id` (`slot_id`),
  KEY `grid_container2slot_container` (`container_id`,`grid_id`,`grid_revision`),
  KEY `grid_container2slot_slot` (`slot_id`,`grid_id`,`grid_revision`),
  CONSTRAINT `grid_container2slot_container` FOREIGN KEY (`container_id`, `grid_id`, `grid_revision`) REFERENCES `grid_container` (`id`, `grid_id`, `grid_revision`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `grid_container2slot_slot` FOREIGN KEY (`slot_id`, `grid_id`, `grid_revision`) REFERENCES `grid_slot` (`id`, `grid_id`, `grid_revision`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `grid_container2slot` WRITE;
/*!40000 ALTER TABLE `grid_container2slot` DISABLE KEYS */;

INSERT INTO `grid_container2slot` (`id`, `container_id`, `grid_id`, `grid_revision`, `slot_id`, `weight`)
VALUES
	(18,24,42,1,25,1),
	(19,24,42,1,26,2),
	(20,24,42,1,27,3),
	(21,24,42,1,28,4),
	(22,24,42,1,29,5),
	(23,24,42,1,30,6),
	(31,29,42,1,38,1),
	(32,29,42,1,39,2),
	(33,29,42,1,40,3),
	(34,30,42,1,41,1);

/*!40000 ALTER TABLE `grid_container2slot` ENABLE KEYS */;
UNLOCK TABLES;


# Export von Tabelle grid_grid
# ------------------------------------------------------------

DROP TABLE IF EXISTS `grid_grid`;

CREATE TABLE `grid_grid` (
  `id` int(11) unsigned NOT NULL,
  `revision` int(11) NOT NULL DEFAULT '0',
  `published` tinyint(1) DEFAULT '0',
  `next_containerid` int(11) DEFAULT '1',
  `next_slotid` int(11) DEFAULT '1',
  `next_boxid` int(11) DEFAULT '1',
  PRIMARY KEY (`id`,`revision`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `grid_grid` WRITE;
/*!40000 ALTER TABLE `grid_grid` DISABLE KEYS */;

INSERT INTO `grid_grid` (`id`, `revision`, `published`, `next_containerid`, `next_slotid`, `next_boxid`)
VALUES
	(42,0,1,2,2,1),
	(42,1,0,35,42,1);

/*!40000 ALTER TABLE `grid_grid` ENABLE KEYS */;
UNLOCK TABLES;


# Export von Tabelle grid_grid2container
# ------------------------------------------------------------

DROP TABLE IF EXISTS `grid_grid2container`;

CREATE TABLE `grid_grid2container` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `grid_id` int(11) unsigned DEFAULT NULL,
  `grid_revision` int(11) DEFAULT NULL,
  `container_id` int(11) unsigned DEFAULT NULL,
  `weight` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `grid_id` (`grid_id`),
  KEY `container_id` (`container_id`),
  KEY `grid2container_to_grid` (`grid_id`,`grid_revision`),
  KEY `grid2container_to_container` (`container_id`,`grid_id`,`grid_revision`),
  CONSTRAINT `grid2container_to_container` FOREIGN KEY (`container_id`, `grid_id`, `grid_revision`) REFERENCES `grid_container` (`id`, `grid_id`, `grid_revision`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `grid2container_to_grid` FOREIGN KEY (`grid_id`, `grid_revision`) REFERENCES `grid_grid` (`id`, `revision`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `grid_grid2container` WRITE;
/*!40000 ALTER TABLE `grid_grid2container` DISABLE KEYS */;

INSERT INTO `grid_grid2container` (`id`, `grid_id`, `grid_revision`, `container_id`, `weight`)
VALUES
	(96,42,1,24,1),
	(97,42,1,29,2),
	(98,42,1,30,3);

/*!40000 ALTER TABLE `grid_grid2container` ENABLE KEYS */;
UNLOCK TABLES;


# Export von Tabelle grid_slot
# ------------------------------------------------------------

DROP TABLE IF EXISTS `grid_slot`;

CREATE TABLE `grid_slot` (
  `id` int(11) unsigned NOT NULL,
  `grid_id` int(10) unsigned NOT NULL DEFAULT '0',
  `grid_revision` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`,`grid_id`,`grid_revision`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `grid_slot` WRITE;
/*!40000 ALTER TABLE `grid_slot` DISABLE KEYS */;

INSERT INTO `grid_slot` (`id`, `grid_id`, `grid_revision`)
VALUES
	(25,42,1),
	(26,42,1),
	(27,42,1),
	(28,42,1),
	(29,42,1),
	(30,42,1),
	(38,42,1),
	(39,42,1),
	(40,42,1),
	(41,42,1);

/*!40000 ALTER TABLE `grid_slot` ENABLE KEYS */;
UNLOCK TABLES;


# Export von Tabelle grid_slot2box
# ------------------------------------------------------------

DROP TABLE IF EXISTS `grid_slot2box`;

CREATE TABLE `grid_slot2box` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `slot_id` int(11) unsigned DEFAULT NULL,
  `grid_id` int(10) unsigned DEFAULT NULL,
  `grid_revision` int(11) DEFAULT NULL,
  `box_id` int(11) unsigned DEFAULT NULL,
  `weight` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `slot_id` (`slot_id`),
  KEY `box_id` (`box_id`),
  KEY `slot2box_slot` (`slot_id`,`grid_id`,`grid_revision`),
  KEY `slot2box_box` (`box_id`,`grid_id`,`grid_revision`),
  CONSTRAINT `grid_slot2box_ibfk_1` FOREIGN KEY (`box_id`) REFERENCES `grid_box` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `slot2box_slot` FOREIGN KEY (`slot_id`, `grid_id`, `grid_revision`) REFERENCES `grid_slot` (`id`, `grid_id`, `grid_revision`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `grid_slot2box` WRITE;
/*!40000 ALTER TABLE `grid_slot2box` DISABLE KEYS */;

INSERT INTO `grid_slot2box` (`id`, `slot_id`, `grid_id`, `grid_revision`, `box_id`, `weight`)
VALUES
	(3,26,42,1,5,1),
	(4,28,42,1,11,1),
	(5,29,42,1,14,1),
	(6,27,42,1,1,1);

/*!40000 ALTER TABLE `grid_slot2box` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
