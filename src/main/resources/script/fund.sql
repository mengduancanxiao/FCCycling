drop table fund;

CREATE TABLE `fund` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `datetime` datetime DEFAULT NULL,
  `description` text,
  `price` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_id` (`id`) USING BTREE,
  FULLTEXT KEY `index_des` (`description`)
) ENGINE=InnoDB AUTO_INCREMENT=5000323 DEFAULT CHARSET=utf8;


