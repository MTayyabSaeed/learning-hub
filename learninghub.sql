-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 08, 2018 at 01:22 AM
-- Server version: 10.1.28-MariaDB
-- PHP Version: 7.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `learninghub`
--

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `user_id` varchar(30) NOT NULL,
  `question_id` int(11) NOT NULL,
  `comment` text NOT NULL,
  `votes` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `user_id`, `question_id`, `comment`, `votes`) VALUES
(27, 'wjb123', 11, 'wowww', 2),
(28, 'wjb123', 11, 'ffewwef', 2),
(29, 'wjb123', 11, 'fewef', 2),
(30, 'wjb123', 11, 'feewfwe', 2),
(31, 'wjb123', 15, 'wtf', 1),
(32, 'wjb123', 15, '33', 1),
(33, 'wjb1234', 11, 'dsffsdsfd', 1),
(34, 'wjb1234', 17, 'aAQ', 2);

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `id` int(11) NOT NULL,
  `user_id` varchar(20) NOT NULL,
  `question` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`id`, `user_id`, `question`) VALUES
(11, 'wjb123', 'first questuob'),
(12, 'wjb123', 'ffeewfefw'),
(13, 'wjb123', 'ffeewfefw'),
(14, 'wjb123', 'edwwe'),
(15, 'wjb123', 'dedeNFIOFWE EFHOEWI FEWOOE FFEWOEW FOFO WEFUFEWIUEFWIUWEIFUIFIEWI FWEF 7WEIFWEISIFKFIW FIISFIEKFEWFUWEIUFWEBEKHF'),
(16, 'wjb123', 'dewe'),
(17, 'wjb1234', 'dwsdadsa');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `usertype` enum('Student','Instructor') NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `usertype`) VALUES
(83, 'wjb123', 'wjbhatti@hotmail.com', '$2a$10$nx2wBgRkzHQSy65iCyD5DukZ5VZ5RrW8AEJ7dLMEfQ65v8ty2/beG', 'Student'),
(84, 'wjb1234', 'coolmint@gmail.com', '$2a$10$yjdX0lwPyhGFHzzTAFT.JOQ3TX7GhOfD.cBmG2QGNHp0FcqUGUwQS', 'Student');

-- --------------------------------------------------------

--
-- Table structure for table `votes`
--

CREATE TABLE `votes` (
  `id` int(11) NOT NULL,
  `user_id` varchar(20) NOT NULL,
  `comment_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `votes`
--

INSERT INTO `votes` (`id`, `user_id`, `comment_id`) VALUES
(25, 'wjb123', 27),
(26, 'wjb123', 28),
(27, 'wjb123', 29),
(28, 'wjb123', 30),
(29, 'wjb123', 31),
(30, 'wjb123', 32),
(31, 'wjb1234', 27),
(32, 'wjb1234', 28),
(33, 'wjb1234', 29),
(34, 'wjb1234', 30),
(35, 'wjb1234', 33),
(36, 'wjb1234', 34),
(37, 'wjb123', 34);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `votes`
--
ALTER TABLE `votes`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=85;

--
-- AUTO_INCREMENT for table `votes`
--
ALTER TABLE `votes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
