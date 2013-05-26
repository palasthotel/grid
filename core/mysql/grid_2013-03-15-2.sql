# ************************************************************
# Sequel Pro SQL dump
# Version 3408
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Host: 127.0.0.1 (MySQL 5.5.18)
# Datenbank: grid
# Erstellungsdauer: 2013-03-15 22:20:33 +0100
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
  `type` int(11) DEFAULT NULL,
  `title` text,
  `title_url` text,
  `prolog` text,
  `epilog` text,
  `readmore` text,
  `readmore_url` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Export von Tabelle grid_box_type
# ------------------------------------------------------------

DROP TABLE IF EXISTS `grid_box_type`;

CREATE TABLE `grid_box_type` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `type` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Export von Tabelle grid_container
# ------------------------------------------------------------

DROP TABLE IF EXISTS `grid_container`;

CREATE TABLE `grid_container` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `type` int(11) DEFAULT NULL,
  `style` int(11) DEFAULT NULL,
  `title` text,
  `title_url` text,
  `prolog` text,
  `epilog` text,
  `readmore` text,
  `readmore_url` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Export von Tabelle grid_container_style
# ------------------------------------------------------------

DROP TABLE IF EXISTS `grid_container_style`;

CREATE TABLE `grid_container_style` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `style` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



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
  `container_id` int(11) DEFAULT NULL,
  `slot_id` int(11) DEFAULT NULL,
  `order` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Export von Tabelle grid_grid
# ------------------------------------------------------------

DROP TABLE IF EXISTS `grid_grid`;

CREATE TABLE `grid_grid` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Export von Tabelle grid_grid2container
# ------------------------------------------------------------

DROP TABLE IF EXISTS `grid_grid2container`;

CREATE TABLE `grid_grid2container` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `grid_id` int(11) DEFAULT NULL,
  `container_id` int(11) DEFAULT NULL,
  `order` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Export von Tabelle grid_slot
# ------------------------------------------------------------

DROP TABLE IF EXISTS `grid_slot`;

CREATE TABLE `grid_slot` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Export von Tabelle grid_slot2box
# ------------------------------------------------------------

DROP TABLE IF EXISTS `grid_slot2box`;

CREATE TABLE `grid_slot2box` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `slot_id` int(11) DEFAULT NULL,
  `box_id` int(11) DEFAULT NULL,
  `order` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
