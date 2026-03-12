-- ============================================================
-- ADD TO EXISTING schema.sql  (run after initial schema.sql)
-- Users table for authentication
-- ============================================================

USE task_manager_db;

DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(100)  NOT NULL                    COMMENT 'Display name',
  email        VARCHAR(150)  NOT NULL UNIQUE              COMMENT 'Login email',
  password     VARCHAR(255)  NOT NULL                    COMMENT 'Bcrypt hashed password',
  avatar_color VARCHAR(20)   NOT NULL DEFAULT '#14b8a6'  COMMENT 'Profile avatar accent colour',
  created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Application user accounts';

-- Sample user: password is "password123" (bcrypt hash)
INSERT INTO users (name, email, password, avatar_color) VALUES
  ('Alice Johnson', 'alice@example.com',
   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
   '#14b8a6'),
  ('Bob Smith', 'bob@example.com',
   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
   '#8b5cf6');
