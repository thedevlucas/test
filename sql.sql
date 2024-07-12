-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         11.3.2-MariaDB - mariadb.org binary distribution
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para trading
CREATE DATABASE IF NOT EXISTS `trading` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `trading`;

-- Volcando estructura para tabla trading.courses
CREATE TABLE IF NOT EXISTS `courses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla trading.courses: ~3 rows (aproximadamente)
REPLACE INTO `courses` (`id`, `name`) VALUES
	(1, 'Bronce'),
	(2, 'Plata'),
	(3, 'Oro');

-- Volcando estructura para tabla trading.purchases
CREATE TABLE IF NOT EXISTS `purchases` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `courseId` int(11) NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `FK__users` (`userId`),
  KEY `FK__courses` (`courseId`),
  CONSTRAINT `FK__courses` FOREIGN KEY (`courseId`) REFERENCES `courses` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK__users` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla trading.purchases: ~1 rows (aproximadamente)
REPLACE INTO `purchases` (`id`, `userId`, `courseId`, `date`) VALUES
	(1, 2, 3, '2024-07-12 00:38:41');

-- Volcando estructura para tabla trading.sessions
CREATE TABLE IF NOT EXISTS `sessions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `device` varchar(50) NOT NULL DEFAULT 'Unknown',
  `application` varchar(50) NOT NULL DEFAULT 'Unknown',
  `ip` varchar(50) NOT NULL DEFAULT 'Unknown',
  `logged` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `FK_session_users` (`userId`),
  CONSTRAINT `FK_session_users` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla trading.sessions: ~1 rows (aproximadamente)
REPLACE INTO `sessions` (`id`, `userId`, `device`, `application`, `ip`, `logged`) VALUES
	(4, 2, 'Microsoft Windows', 'Chrome', '127.0.0.1', '2024-07-12 00:35:56');

-- Volcando estructura para tabla trading.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group` enum('admin','user') NOT NULL DEFAULT 'user',
  `username` varchar(50) NOT NULL,
  `password` longtext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla trading.users: ~2 rows (aproximadamente)
REPLACE INTO `users` (`id`, `group`, `username`, `password`) VALUES
	(2, 'admin', 'admin', '$2b$10$OmEPBW3oVkurumKEfiin6OL4orH40vqWijSivRYvPsa4OzpCCCTcG'),
	(3, 'user', 'user', '$2b$10$Zq8etDb6eq8Fq.DuA5QWU.O3w6ZLCHQdIL8IbaKWjsxXok08/xCMW');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
