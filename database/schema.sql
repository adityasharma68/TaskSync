-- ============================================================
-- Task Management Application - MySQL Database Schema
-- ============================================================

-- Create the database (if not exists)
CREATE DATABASE IF NOT EXISTS task_manager_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE task_manager_db;

-- Drop table if it exists (for fresh setup)
DROP TABLE IF EXISTS tasks;

-- ============================================================
-- Tasks Table
-- ============================================================
CREATE TABLE tasks (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title         VARCHAR(255)  NOT NULL                   COMMENT 'Task title',
  description   TEXT                                     COMMENT 'Task description',
  due_date      DATE                                     COMMENT 'Task due date',
  status        ENUM('Pending', 'Completed')
                NOT NULL DEFAULT 'Pending'               COMMENT 'Task status',
  remarks       TEXT                                     COMMENT 'Additional remarks',
  created_by    VARCHAR(100)  NOT NULL DEFAULT 'System'  COMMENT 'User who created the task',
  updated_by    VARCHAR(100)  NOT NULL DEFAULT 'System'  COMMENT 'User who last updated the task',
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
                                                         COMMENT 'Record creation timestamp',
  updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
                ON UPDATE CURRENT_TIMESTAMP              COMMENT 'Record last update timestamp',

  -- Indexes for performance
  INDEX idx_status    (status),
  INDEX idx_due_date  (due_date),
  INDEX idx_created_at(created_at),
  FULLTEXT INDEX ft_search (title, description)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Stores all task records for the Task Management Application';

-- ============================================================
-- Seed Data - Example Tasks
-- ============================================================
INSERT INTO tasks (title, description, due_date, status, remarks, created_by, updated_by) VALUES
  ('Design System Architecture',
   'Create the overall system architecture diagram for the new microservices platform.',
   '2025-03-20', 'Completed',
   'Architecture approved by tech lead.',
   'Alice Johnson', 'Alice Johnson'),

  ('Set Up CI/CD Pipeline',
   'Configure GitHub Actions workflows for automated testing and deployment.',
   '2025-03-25', 'Pending',
   'Waiting for DevOps team credentials.',
   'Bob Smith', 'Bob Smith'),

  ('Write Unit Tests for Auth Module',
   'Achieve at least 85% code coverage for the authentication module.',
   '2025-03-28', 'Pending',
   'Need to cover edge cases for OAuth flows.',
   'Carol White', 'Carol White'),

  ('Database Performance Audit',
   'Analyze slow query logs and add appropriate indexes to optimize query performance.',
   '2025-04-01', 'Pending',
   NULL,
   'David Lee', 'David Lee'),

  ('Update API Documentation',
   'Refresh Swagger/OpenAPI docs to reflect the latest endpoint changes.',
   '2025-03-22', 'Completed',
   'Docs published to developer portal.',
   'Eve Martinez', 'Alice Johnson'),

  ('Mobile Responsive Fixes',
   'Fix layout issues on screens smaller than 375px as reported in QA.',
   '2025-03-30', 'Pending',
   'Affects iOS Safari primarily.',
   'Frank Brown', 'Frank Brown'),

  ('Security Vulnerability Patching',
   'Apply patches for CVE-2024-XXXX found in the dependency audit report.',
   '2025-03-18', 'Completed',
   'All critical vulnerabilities resolved.',
   'Grace Kim', 'Grace Kim');

-- ============================================================
-- Verify seed data
-- ============================================================
SELECT id, title, status, due_date, created_by FROM tasks ORDER BY created_at;
