-- =======================================================
-- CineTrack Database Schema
-- Database: cinetrack_db
-- Table: watchlist
-- =======================================================

-- 1. Create the database if it doesn't already exist
CREATE DATABASE IF NOT EXISTS cinetrack_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- 2. Select the database
USE cinetrack_db;

-- 3. Create the watchlist table
CREATE TABLE IF NOT EXISTS watchlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tmdb_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  poster_path VARCHAR(255) DEFAULT NULL,
  release_date VARCHAR(50) DEFAULT NULL,
  rating DECIMAL(3, 1) DEFAULT NULL,
  status ENUM('Want to Watch', 'Watching', 'Watched') NOT NULL DEFAULT 'Want to Watch',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Constraint: A movie can only be added once to the watchlist
  CONSTRAINT unique_tmdb_movie UNIQUE (tmdb_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Sample Seed Data (optional testing)
-- INSERT IGNORE INTO watchlist (tmdb_id, title, poster_path, release_date, rating, status)
-- VALUES 
--   (550, 'Fight Club', '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', '1999-10-15', 8.4, 'Watched'),
--   (157336, 'Interstellar', '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', '2014-11-05', 8.4, 'Watching'),
--   (27205, 'Inception', '/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg', '2010-07-15', 8.4, 'Want to Watch');
