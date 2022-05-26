DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(200) NOT NULL UNIQUE,
  `name` varchar(200) NOT NULL,
  `email` varchar(200) NOT NULL UNIQUE,
  `password` text NOT NULL,
  `salt` varchar(200) NOT NULL,
  `profile` varchar(200) NOT NULL DEFAULT '/defaultProfile.jpg',
  `createAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=`utf8mb4` COLLATE=`utf8mb4_0900_ai_ci`;

DROP TABLE IF EXISTS `questions`;
CREATE TABLE `questions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(200) NOT NULL UNIQUE,
  `status` varchar(200) NOT NULL,
  `author` int NOT NULL UNIQUE,
  `receiver` int NOT NULL UNIQUE,
  `question` varchar(3000) NOT NULL,
  `answer` varchar(3000) NOT NULL,
  `createAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=`utf8mb4` COLLATE=`utf8mb4_0900_ai_ci`;