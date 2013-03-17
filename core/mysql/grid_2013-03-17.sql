# ************************************************************
# Sequel Pro SQL dump
# Version 4004
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Host: 127.0.0.1 (MySQL 5.1.49-3)
# Datenbank: grid
# Erstellungsdauer: 2013-03-17 17:02:40 +0000
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
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `type` int(11) unsigned DEFAULT NULL,
  `title` mediumtext,
  `title_url` mediumtext,
  `prolog` mediumtext,
  `epilog` mediumtext,
  `readmore` mediumtext,
  `readmore_url` mediumtext,
  PRIMARY KEY (`id`),
  KEY `type` (`type`),
  CONSTRAINT `grid_box_ibfk_1` FOREIGN KEY (`type`) REFERENCES `grid_box_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Export von Tabelle grid_box_type
# ------------------------------------------------------------

DROP TABLE IF EXISTS `grid_box_type`;

CREATE TABLE `grid_box_type` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `type` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Export von Tabelle grid_container
# ------------------------------------------------------------

DROP TABLE IF EXISTS `grid_container`;

CREATE TABLE `grid_container` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `type` int(11) unsigned DEFAULT NULL,
  `style` int(11) unsigned DEFAULT NULL,
  `title` mediumtext,
  `title_url` mediumtext,
  `prolog` mediumtext,
  `epilog` mediumtext,
  `readmore` mediumtext,
  `readmore_url` mediumtext,
  PRIMARY KEY (`id`),
  KEY `type` (`type`),
  KEY `style` (`style`),
  CONSTRAINT `grid_container_ibfk_2` FOREIGN KEY (`style`) REFERENCES `grid_container_style` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `grid_container_ibfk_1` FOREIGN KEY (`type`) REFERENCES `grid_container_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Export von Tabelle grid_container_style
# ------------------------------------------------------------

DROP TABLE IF EXISTS `grid_container_style`;

CREATE TABLE `grid_container_style` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `style` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Export von Tabelle grid_container_type
# ------------------------------------------------------------

DROP TABLE IF EXISTS `grid_container_type`;

CREATE TABLE `grid_container_type` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `type` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Export von Tabelle grid_container2slot
# ------------------------------------------------------------

DROP TABLE IF EXISTS `grid_container2slot`;

CREATE TABLE `grid_container2slot` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `container_id` int(11) unsigned DEFAULT NULL,
  `slot_id` int(11) unsigned DEFAULT NULL,
  `order` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `container_id` (`container_id`),
  KEY `slot_id` (`slot_id`),
  CONSTRAINT `grid_container2slot_ibfk_2` FOREIGN KEY (`slot_id`) REFERENCES `grid_slot` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `grid_container2slot_ibfk_1` FOREIGN KEY (`container_id`) REFERENCES `grid_container` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Export von Tabelle grid_grid
# ------------------------------------------------------------

DROP TABLE IF EXISTS `grid_grid`;

CREATE TABLE `grid_grid` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Export von Tabelle grid_grid2container
# ------------------------------------------------------------

DROP TABLE IF EXISTS `grid_grid2container`;

CREATE TABLE `grid_grid2container` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `grid_id` int(11) unsigned DEFAULT NULL,
  `container_id` int(11) unsigned DEFAULT NULL,
  `order` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `grid_id` (`grid_id`),
  KEY `container_id` (`container_id`),
  CONSTRAINT `grid_grid2container_ibfk_2` FOREIGN KEY (`container_id`) REFERENCES `grid_container` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `grid_grid2container_ibfk_1` FOREIGN KEY (`grid_id`) REFERENCES `grid_grid` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Export von Tabelle grid_slot
# ------------------------------------------------------------

DROP TABLE IF EXISTS `grid_slot`;

CREATE TABLE `grid_slot` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Export von Tabelle grid_slot2box
# ------------------------------------------------------------

DROP TABLE IF EXISTS `grid_slot2box`;

CREATE TABLE `grid_slot2box` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `slot_id` int(11) unsigned DEFAULT NULL,
  `box_id` int(11) unsigned DEFAULT NULL,
  `order` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `slot_id` (`slot_id`),
  KEY `box_id` (`box_id`),
  CONSTRAINT `grid_slot2box_ibfk_2` FOREIGN KEY (`box_id`) REFERENCES `grid_box` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `grid_slot2box_ibfk_1` FOREIGN KEY (`slot_id`) REFERENCES `grid_slot` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
