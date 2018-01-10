CREATE DATABASE  IF NOT EXISTS `learninghub` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `learninghub`;
-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: learninghub
-- ------------------------------------------------------
-- Server version	5.7.19

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `answers`
--

DROP TABLE IF EXISTS `answers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `answers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `quiz_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `answer` varchar(200) NOT NULL,
  `correct` varchar(200) NOT NULL,
  `created` varchar(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `answers`
--

LOCK TABLES `answers` WRITE;
/*!40000 ALTER TABLE `answers` DISABLE KEYS */;
/*!40000 ALTER TABLE `answers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chapters`
--

DROP TABLE IF EXISTS `chapters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chapters` (
  `chapter_id` int(11) NOT NULL AUTO_INCREMENT,
  `course_id` int(11) NOT NULL,
  `chapter_title` varchar(200) NOT NULL,
  `chapter_sub` varchar(200) NOT NULL,
  `chapter_link` varchar(200) NOT NULL,
  `chapter_des` text NOT NULL,
  `chapter_created` varchar(200) NOT NULL,
  PRIMARY KEY (`chapter_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chapters`
--

LOCK TABLES `chapters` WRITE;
/*!40000 ALTER TABLE `chapters` DISABLE KEYS */;
/*!40000 ALTER TABLE `chapters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(30) NOT NULL,
  `question_id` int(11) NOT NULL,
  `comment` text NOT NULL,
  `votes` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (27,'wjb123',11,'wowww',2),(28,'wjb123',11,'ffewwef',2),(29,'wjb123',11,'fewef',2),(30,'wjb123',11,'feewfwe',2),(31,'wjb123',15,'wtf',1),(32,'wjb123',15,'33',1),(33,'wjb1234',11,'dsffsdsfd',1),(34,'wjb1234',17,'aAQ',2);
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `courses` (
  `course_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `course_title` varchar(200) NOT NULL,
  `course_image` blob NOT NULL,
  `course_des` text NOT NULL,
  `chapter_id` int(11) NOT NULL,
  `course_created` varchar(200) NOT NULL,
  `course_status` int(11) NOT NULL,
  PRIMARY KEY (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questions`
--

DROP TABLE IF EXISTS `questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `questions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(20) NOT NULL,
  `question` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questions`
--

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;
INSERT INTO `questions` VALUES (11,'wjb123','first questuob'),(12,'wjb123','ffeewfefw'),(13,'wjb123','ffeewfefw'),(14,'wjb123','edwwe'),(15,'wjb123','dedeNFIOFWE EFHOEWI FEWOOE FFEWOEW FOFO WEFUFEWIUEFWIUWEIFUIFIEWI FWEF 7WEIFWEISIFKFIW FIISFIEKFEWFUWEIUFWEBEKHF'),(16,'wjb123','dewe'),(17,'wjb1234','dwsdadsa');
/*!40000 ALTER TABLE `questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questionsquiz`
--

DROP TABLE IF EXISTS `questionsquiz`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `questionsquiz` (
  `question_id` int(11) NOT NULL AUTO_INCREMENT,
  `quiz_id` int(11) NOT NULL,
  `question` varchar(200) NOT NULL,
  `answer` varchar(200) NOT NULL,
  `option1` varchar(200) NOT NULL,
  `option2` varchar(200) NOT NULL,
  `option3` varchar(200) NOT NULL,
  `option4` varchar(200) NOT NULL,
  `created` varchar(200) NOT NULL,
  PRIMARY KEY (`question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questionsquiz`
--

LOCK TABLES `questionsquiz` WRITE;
/*!40000 ALTER TABLE `questionsquiz` DISABLE KEYS */;
/*!40000 ALTER TABLE `questionsquiz` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quiz`
--

DROP TABLE IF EXISTS `quiz`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `quiz` (
  `quiz_id` int(11) NOT NULL AUTO_INCREMENT,
  `que` varchar(200) NOT NULL,
  `ans_1` varchar(200) NOT NULL,
  `ans_2` varchar(200) NOT NULL,
  `ans_3` varchar(200) NOT NULL,
  `ans_4` varchar(200) NOT NULL,
  `correct_ans` varchar(200) NOT NULL,
  PRIMARY KEY (`quiz_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quiz`
--

LOCK TABLES `quiz` WRITE;
/*!40000 ALTER TABLE `quiz` DISABLE KEYS */;
/*!40000 ALTER TABLE `quiz` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quizzes`
--

DROP TABLE IF EXISTS `quizzes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `quizzes` (
  `quiz_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `quiz_title` varchar(200) NOT NULL,
  `quiz_des` text NOT NULL,
  `created` varchar(200) NOT NULL,
  PRIMARY KEY (`quiz_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quizzes`
--

LOCK TABLES `quizzes` WRITE;
/*!40000 ALTER TABLE `quizzes` DISABLE KEYS */;
/*!40000 ALTER TABLE `quizzes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('42N9CR7jMiLiO5zgjpXrzAcRywm5HhHS',1515636416,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"username\":\"tarun\",\"userID\":\"85\",\"passport\":{\"user\":{\"usertype\":\"Instructor\",\"userID\":\"85\"}}}'),('HFG8VK5-wCgEA3g3AEWHJhwQJpYRFFlO',1515635393,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"username\":\"tarun\",\"userID\":\"85\",\"passport\":{\"user\":{\"usertype\":\"Instructor\",\"userID\":\"85\"}}}'),('fsgGSWAStSBCTCReo05bCv4LfXiBf7ux',1515633640,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"username\":\"tarun\",\"userID\":\"85\",\"passport\":{\"user\":{\"usertype\":\"Instructor\",\"userID\":\"85\"}}}');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_answers`
--

DROP TABLE IF EXISTS `tbl_answers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_answers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `quiz_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `answer` varchar(200) NOT NULL,
  `correct` varchar(200) NOT NULL,
  `created` varchar(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_answers`
--

LOCK TABLES `tbl_answers` WRITE;
/*!40000 ALTER TABLE `tbl_answers` DISABLE KEYS */;
INSERT INTO `tbl_answers` VALUES (1,8,0,1,'option3','','Fri Jan 05 2018 17:01:38 GMT+0530 (India Standard Time)'),(2,8,0,6,'option1','','Fri Jan 05 2018 17:02:41 GMT+0530 (India Standard Time)'),(3,8,0,7,'option2','','Fri Jan 05 2018 17:02:48 GMT+0530 (India Standard Time)'),(4,8,0,8,'option1','','Fri Jan 05 2018 17:02:54 GMT+0530 (India Standard Time)'),(5,8,0,9,'option1','','Fri Jan 05 2018 17:02:58 GMT+0530 (India Standard Time)'),(6,8,0,1,'undefined','','Fri Jan 05 2018 17:42:10 GMT+0530 (India Standard Time)'),(7,8,0,6,'option1','','Fri Jan 05 2018 17:42:24 GMT+0530 (India Standard Time)'),(8,8,0,7,'option1','','Fri Jan 05 2018 17:42:31 GMT+0530 (India Standard Time)'),(9,8,0,8,'undefined','','Fri Jan 05 2018 17:50:32 GMT+0530 (India Standard Time)'),(10,8,0,1,'option1','','Fri Jan 05 2018 18:01:01 GMT+0530 (India Standard Time)'),(11,8,0,6,'option1','','Fri Jan 05 2018 18:01:06 GMT+0530 (India Standard Time)'),(12,8,0,7,'option2','','Fri Jan 05 2018 18:01:12 GMT+0530 (India Standard Time)'),(13,8,0,8,'option2','','Fri Jan 05 2018 18:01:18 GMT+0530 (India Standard Time)'),(14,8,0,1,'option1','','Fri Jan 05 2018 18:03:55 GMT+0530 (India Standard Time)'),(15,8,0,6,'option1','','Fri Jan 05 2018 18:04:02 GMT+0530 (India Standard Time)'),(16,8,0,7,'option2','','Fri Jan 05 2018 18:04:06 GMT+0530 (India Standard Time)'),(17,8,0,8,'option1','','Fri Jan 05 2018 18:04:13 GMT+0530 (India Standard Time)'),(18,8,0,9,'option1','','Fri Jan 05 2018 18:04:21 GMT+0530 (India Standard Time)'),(19,8,0,1,'option1','','Fri Jan 05 2018 18:06:12 GMT+0530 (India Standard Time)'),(20,8,0,6,'option1','','Fri Jan 05 2018 18:06:15 GMT+0530 (India Standard Time)'),(21,8,0,7,'option1','','Fri Jan 05 2018 18:06:19 GMT+0530 (India Standard Time)'),(22,8,0,8,'option3','','Fri Jan 05 2018 18:06:25 GMT+0530 (India Standard Time)'),(23,8,0,9,'option1','','Fri Jan 05 2018 18:06:30 GMT+0530 (India Standard Time)'),(24,8,0,1,'option2','','Fri Jan 05 2018 18:08:57 GMT+0530 (India Standard Time)'),(25,8,0,6,'option1','','Fri Jan 05 2018 18:09:00 GMT+0530 (India Standard Time)'),(26,8,0,7,'option1','','Fri Jan 05 2018 18:09:03 GMT+0530 (India Standard Time)'),(27,8,0,8,'option2','','Fri Jan 05 2018 18:10:04 GMT+0530 (India Standard Time)'),(28,8,0,9,'option1','','Fri Jan 05 2018 18:10:10 GMT+0530 (India Standard Time)'),(29,8,0,1,'option3','','Fri Jan 05 2018 18:11:01 GMT+0530 (India Standard Time)'),(30,8,0,6,'option1','','Fri Jan 05 2018 18:11:04 GMT+0530 (India Standard Time)'),(31,8,0,7,'option1','','Fri Jan 05 2018 18:11:08 GMT+0530 (India Standard Time)'),(32,8,0,8,'option3','','Fri Jan 05 2018 18:11:10 GMT+0530 (India Standard Time)'),(33,8,0,1,'option3','','Fri Jan 05 2018 18:13:01 GMT+0530 (India Standard Time)'),(34,8,0,9,'undefined','','Fri Jan 05 2018 18:15:21 GMT+0530 (India Standard Time)'),(35,8,0,1,'undefined','','Fri Jan 05 2018 18:53:37 GMT+0530 (India Standard Time)'),(36,8,0,6,'undefined','','Fri Jan 05 2018 18:53:38 GMT+0530 (India Standard Time)'),(37,8,0,7,'undefined','','Fri Jan 05 2018 18:53:40 GMT+0530 (India Standard Time)'),(38,8,0,8,'undefined','','Fri Jan 05 2018 18:53:41 GMT+0530 (India Standard Time)'),(39,8,0,9,'undefined','','Fri Jan 05 2018 18:53:42 GMT+0530 (India Standard Time)'),(40,8,0,1,'option1','','Fri Jan 05 2018 18:54:06 GMT+0530 (India Standard Time)'),(41,8,0,6,'option1','','Fri Jan 05 2018 18:54:08 GMT+0530 (India Standard Time)'),(42,8,0,7,'option1','','Fri Jan 05 2018 18:54:11 GMT+0530 (India Standard Time)'),(43,8,0,8,'option1','','Fri Jan 05 2018 18:54:20 GMT+0530 (India Standard Time)'),(44,8,0,9,'option1','','Fri Jan 05 2018 18:54:24 GMT+0530 (India Standard Time)'),(45,8,0,1,'option1','','Fri Jan 05 2018 18:57:55 GMT+0530 (India Standard Time)'),(46,8,0,6,'option1','','Fri Jan 05 2018 18:57:57 GMT+0530 (India Standard Time)'),(47,8,0,7,'option1','','Fri Jan 05 2018 18:58:00 GMT+0530 (India Standard Time)'),(48,8,0,8,'option1','','Fri Jan 05 2018 18:58:03 GMT+0530 (India Standard Time)'),(49,8,0,9,'option1','','Fri Jan 05 2018 18:58:06 GMT+0530 (India Standard Time)'),(50,8,0,1,'undefined','','Fri Jan 05 2018 18:59:13 GMT+0530 (India Standard Time)'),(51,8,0,6,'option1','','Fri Jan 05 2018 18:59:17 GMT+0530 (India Standard Time)'),(52,8,0,7,'option1','','Fri Jan 05 2018 18:59:21 GMT+0530 (India Standard Time)'),(53,8,0,8,'option1','','Fri Jan 05 2018 18:59:24 GMT+0530 (India Standard Time)'),(54,8,0,9,'option1','','Fri Jan 05 2018 18:59:29 GMT+0530 (India Standard Time)'),(55,8,0,1,'option1','','Fri Jan 05 2018 19:00:47 GMT+0530 (India Standard Time)'),(56,8,0,6,'option1','','Fri Jan 05 2018 19:00:50 GMT+0530 (India Standard Time)'),(57,8,0,7,'option1','','Fri Jan 05 2018 19:00:54 GMT+0530 (India Standard Time)'),(58,8,0,8,'option1','','Fri Jan 05 2018 19:00:58 GMT+0530 (India Standard Time)'),(59,8,0,9,'option1','','Fri Jan 05 2018 19:01:03 GMT+0530 (India Standard Time)');
/*!40000 ALTER TABLE `tbl_answers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_chapters`
--

DROP TABLE IF EXISTS `tbl_chapters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_chapters` (
  `chapter_id` int(11) NOT NULL AUTO_INCREMENT,
  `course_id` int(11) NOT NULL,
  `chapter_title` varchar(200) NOT NULL,
  `chapter_sub` varchar(200) NOT NULL,
  `chapter_link` varchar(200) NOT NULL,
  `chapter_des` text NOT NULL,
  `chapter_created` varchar(200) NOT NULL,
  PRIMARY KEY (`chapter_id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_chapters`
--

LOCK TABLES `tbl_chapters` WRITE;
/*!40000 ALTER TABLE `tbl_chapters` DISABLE KEYS */;
INSERT INTO `tbl_chapters` VALUES (1,1,'Chapter 1','sssss 111','http://google.com','Chapter 1 Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc.','Wed Nov 22 2017 17:52:44 GMT+0530 (India Standard Time)'),(2,1,'Chapter 2','','','Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. ','Wed Nov 22 2017 17:58:21 GMT+0530 (India Standard Time)'),(3,1,'Chapter 3','','','Chapter 3 : Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, ','Wed Nov 22 2017 17:59:05 GMT+0530 (India Standard Time)'),(4,1,'chapter 4','','','chapter 4 : Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, ','Thu Nov 23 2017 12:18:55 GMT+0530 (India Standard Time)'),(5,1,'chapter 5','','','chapter 5: Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, ','Thu Nov 23 2017 12:19:08 GMT+0530 (India Standard Time)'),(6,3,'hello','','','Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, ','Thu Nov 23 2017 12:24:51 GMT+0530 (India Standard Time)'),(7,3,'Hi','','','Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. ','Thu Nov 23 2017 12:48:46 GMT+0530 (India Standard Time)'),(8,6,'Kanchi 1','','','qwertyui','Thu Nov 23 2017 21:02:13 GMT+0530 (India Standard Time)'),(9,7,'t','','','t','Thu Nov 23 2017 22:24:15 GMT+0530 (India Standard Time)'),(10,4,'Sample title','subtitle xxxxxxx','https://www.youtube.com/watch?v=aatr_2MstrI','kkkkxxxxxxxxx','Fri Nov 24 2017 13:00:08 GMT+0530 (India Standard Time)'),(23,4,'uuuuuuuuuukkk','yyyyyyyyykkk','http://google.com/sss','ddddddd  eweetyrxxxx','Mon Nov 27 2017 17:11:10 GMT+0530 (India Standard Time)'),(25,12,'p1','p','http://google.com','test','Mon Nov 27 2017 18:38:31 GMT+0530 (India Standard Time)'),(26,4,'dsf','sdfsf','sdfsf','','Fri Dec 29 2017 17:20:42 GMT+0530 (India Standard Time)'),(27,4,'sd','dfg','gdhfgj','fdghfgm','Fri Dec 29 2017 17:34:00 GMT+0530 (India Standard Time)'),(29,31,'1','1','1','1','Sat Jan 06 2018 22:37:54 GMT+0530 (Sri Lanka Standard Time)'),(31,33,'a','a','aaanadjdakjdfafsdf','ffaf','Sat Jan 06 2018 23:38:50 GMT+0530 (Sri Lanka Standard Time)'),(32,34,'1','1','1','1','Sun Jan 07 2018 17:50:00 GMT+0530 (Sri Lanka Standard Time)'),(33,40,'Javascript 101','This chapter covers','google.com','In  this chapter you will learn','Mon Jan 08 2018 04:08:21 GMT+0530 (Sri Lanka Standard Time)'),(34,40,'Javascript 102','This chapter covers','youtube.com','in this chaopter','Mon Jan 08 2018 04:09:12 GMT+0530 (Sri Lanka Standard Time)'),(35,42,'1 2','12','12111111111111111','desc','Mon Jan 08 2018 19:08:43 GMT+0530 (Sri Lanka Standard Time)'),(36,42,'2','2','2','2','Mon Jan 08 2018 19:11:27 GMT+0530 (Sri Lanka Standard Time)'),(37,45,'1 ','11','1','1','Mon Jan 08 2018 20:00:02 GMT+0530 (Sri Lanka Standard Time)'),(38,45,'21','21','21','21','Mon Jan 08 2018 20:16:29 GMT+0530 (Sri Lanka Standard Time)'),(39,45,'31','31','31','31','Mon Jan 08 2018 20:16:42 GMT+0530 (Sri Lanka Standard Time)'),(40,45,'4','4','4','4','Mon Jan 08 2018 20:17:12 GMT+0530 (Sri Lanka Standard Time)'),(41,45,'4','4','4','4','Mon Jan 08 2018 20:21:49 GMT+0530 (Sri Lanka Standard Time)'),(42,45,'4','4','4','4','Mon Jan 08 2018 20:22:14 GMT+0530 (Sri Lanka Standard Time)'),(43,50,'bla bla ','1','1','1','Mon Jan 08 2018 20:56:28 GMT+0530 (Sri Lanka Standard Time)'),(44,51,'1 bla','hakjsajk','jkaskjjk','kjlsdlkjflsakj','Wed Jan 10 2018 07:08:14 GMT+0530 (Sri Lanka Standard Time)'),(45,51,'sdds','dsds','dsds','cdscdd','Wed Jan 10 2018 07:11:32 GMT+0530 (Sri Lanka Standard Time)');
/*!40000 ALTER TABLE `tbl_chapters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_courses`
--

DROP TABLE IF EXISTS `tbl_courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_courses` (
  `course_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `course_title` varchar(200) NOT NULL,
  `course_image` blob,
  `course_des` text NOT NULL,
  `chapter_id` int(11) DEFAULT NULL,
  `course_created` varchar(200) DEFAULT NULL,
  `course_status` int(11) DEFAULT NULL,
  PRIMARY KEY (`course_id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_courses`
--

LOCK TABLES `tbl_courses` WRITE;
/*!40000 ALTER TABLE `tbl_courses` DISABLE KEYS */;
INSERT INTO `tbl_courses` VALUES (2,2,'Test course 2','','This is content for testing',0,'',0),(44,4,'first course',NULL,'bla bla bla ',NULL,'Mon Jan 08 2018 19:49:24 GMT+0530 (Sri Lanka Standard Time)',NULL),(50,3,'one ',NULL,'one ',NULL,'Mon Jan 08 2018 20:24:47 GMT+0530 (Sri Lanka Standard Time)',NULL),(51,85,'mycourse',NULL,'mycourse',NULL,'Wed Jan 10 2018 06:43:46 GMT+0530 (Sri Lanka Standard Time)',NULL),(52,85,'Course 2',NULL,'bla bla',NULL,'Wed Jan 10 2018 07:07:18 GMT+0530 (Sri Lanka Standard Time)',NULL);
/*!40000 ALTER TABLE `tbl_courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_questions`
--

DROP TABLE IF EXISTS `tbl_questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_questions` (
  `question_id` int(11) NOT NULL AUTO_INCREMENT,
  `quiz_id` int(11) NOT NULL,
  `question` varchar(200) NOT NULL,
  `answer` varchar(200) NOT NULL,
  `option1` varchar(200) NOT NULL,
  `option2` varchar(200) NOT NULL,
  `option3` varchar(200) NOT NULL,
  `option4` varchar(200) NOT NULL,
  `created` varchar(200) NOT NULL,
  PRIMARY KEY (`question_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_questions`
--

LOCK TABLES `tbl_questions` WRITE;
/*!40000 ALTER TABLE `tbl_questions` DISABLE KEYS */;
INSERT INTO `tbl_questions` VALUES (1,1,'Which tags are most commonly used by search engines?','option1','Heading','Title2342','Paragrah','All of above','Tue Jan 02 2018 13:04:01 GMT+0530 (India Standard Time)'),(2,2,'What does PHP stand for?','option3','Personal Hypertext Processor','Private Home Page','PHP: Hypertext Preprocessor','','Tue Jan 02 2018 16:53:14 GMT+0530 (India Standard Time)'),(3,2,'What does PHP stand for?','option3','Personal Hypertext Processor','Private Home Page','PHP: Hypertext Preprocessor','','Tue Jan 02 2018 16:54:38 GMT+0530 (India Standard Time)'),(6,1,'Can a data cell contain images?','option1','Yes','No','','','Thu Jan 04 2018 16:36:09 GMT+0530 (India Standard Time)'),(7,1,'Which of the following tags are used for a multi-line text input control?','option3','textml tag','text tag','textarea tag','Both b and c','Thu Jan 04 2018 16:37:57 GMT+0530 (India Standard Time)'),(8,1,'What are meta tags used for?','option1','To store information usually relevant to browsers and search engines.','To only store information usually relevant to browsers','To only store information about search engines.','To store information about external links','Thu Jan 04 2018 16:39:10 GMT+0530 (India Standard Time)'),(9,1,'Each list item in an ordered or unordered list has which tag?','option3','list tag','ls tag','li tag','ol tag','Thu Jan 04 2018 16:40:17 GMT+0530 (India Standard Time)'),(11,7,'gsdfgsd1','option1','gsdf','gsd','gsfd','sgdf','Sun Jan 07 2018 22:14:26 GMT+0530 (Sri Lanka Standard Time)'),(12,6,'adad','option3','ad','adada','aa','dda','Mon Jan 08 2018 20:38:56 GMT+0530 (Sri Lanka Standard Time)'),(13,6,'sdasad','option3','adasd','aasadadad','adadad','dada','Mon Jan 08 2018 20:39:04 GMT+0530 (Sri Lanka Standard Time)');
/*!40000 ALTER TABLE `tbl_questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_quiz`
--

DROP TABLE IF EXISTS `tbl_quiz`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_quiz` (
  `quiz_id` int(11) NOT NULL AUTO_INCREMENT,
  `que` varchar(200) NOT NULL,
  `ans_1` varchar(200) NOT NULL,
  `ans_2` varchar(200) NOT NULL,
  `ans_3` varchar(200) NOT NULL,
  `ans_4` varchar(200) NOT NULL,
  `correct_ans` varchar(200) NOT NULL,
  PRIMARY KEY (`quiz_id`)
) ENGINE=MyISAM AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_quiz`
--

LOCK TABLES `tbl_quiz` WRITE;
/*!40000 ALTER TABLE `tbl_quiz` DISABLE KEYS */;
INSERT INTO `tbl_quiz` VALUES (15,'sd','ds','h','bn','bn','ans_4');
/*!40000 ALTER TABLE `tbl_quiz` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_quizzes`
--

DROP TABLE IF EXISTS `tbl_quizzes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_quizzes` (
  `quiz_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `quiz_title` varchar(200) NOT NULL,
  `quiz_des` text NOT NULL,
  `created` varchar(200) NOT NULL,
  PRIMARY KEY (`quiz_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_quizzes`
--

LOCK TABLES `tbl_quizzes` WRITE;
/*!40000 ALTER TABLE `tbl_quizzes` DISABLE KEYS */;
INSERT INTO `tbl_quizzes` VALUES (1,1,'Html Quiz','Html Quiz Des','Tue Jan 02 2018 11:14:57 GMT+0530 (India Standard Time)'),(2,1,'PHP Quiz','The test contains 25 questions and there is no time limit.','Tue Jan 02 2018 11:33:16 GMT+0530 (India Standard Time)'),(4,1,'sdfgdhf','fdghjh','Tue Jan 02 2018 18:42:03 GMT+0530 (India Standard Time)'),(6,3,'Python Final quiz','bla bla bla','Mon Jan 08 2018 20:12:07 GMT+0530 (Sri Lanka Standard Time)');
/*!40000 ALTER TABLE `tbl_quizzes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `usertype` enum('Student','Instructor') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (85,'tarun','tarunsharma0211@gmail.com','$2a$10$gMafS/AJumFAdWGlPbTEeuHhudUEnZPXDRExQ/ob5jE4I3CRIG06K','Instructor'),(86,'shiv','shivashishbasu@redifmail.com','$2a$10$zTo9Ctr7YQ0fj74UixzC7.z.3jCt3Jen5x1nltXWhpNXaWcQiCZfi','Student'),(87,'shivashish','tarunsharma0211@gmail.com','$2a$10$8OVE/CV.WwTMpzsBR1MPJu/8P8LyOatxgxvQvuyM0Lkd4wKJJ/Au.','Student');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `votes`
--

DROP TABLE IF EXISTS `votes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `votes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(20) NOT NULL,
  `comment_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `votes`
--

LOCK TABLES `votes` WRITE;
/*!40000 ALTER TABLE `votes` DISABLE KEYS */;
INSERT INTO `votes` VALUES (25,'wjb123',27),(26,'wjb123',28),(27,'wjb123',29),(28,'wjb123',30),(29,'wjb123',31),(30,'wjb123',32),(31,'wjb1234',27),(32,'wjb1234',28),(33,'wjb1234',29),(34,'wjb1234',30),(35,'wjb1234',33),(36,'wjb1234',34),(37,'wjb123',34);
/*!40000 ALTER TABLE `votes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'learninghub'
--

--
-- Dumping routines for database 'learninghub'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-01-10  9:00:22
