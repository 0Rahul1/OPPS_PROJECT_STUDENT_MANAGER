-- ============================================================================
-- Student Management System - Database Schema
-- Database: student_management
-- Engine: InnoDB, Charset: utf8mb4
-- ============================================================================

-- Step 1: Create Database if not exists
CREATE DATABASE IF NOT EXISTS student_management
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE student_management;

-- Step 2: Create Students Table
-- Includes primary key, unique constraints, and check constraints
DROP TABLE IF EXISTS students;

CREATE TABLE students (
    student_id  INT NOT NULL,
    name        VARCHAR(100) NOT NULL,
    age         INT NOT NULL,
    course      VARCHAR(100) NOT NULL,
    email       VARCHAR(150) NOT NULL,
    marks       DECIMAL(5, 2) NOT NULL,
    semester    INT NOT NULL DEFAULT 1,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Primary Key Constraint
    CONSTRAINT pk_students PRIMARY KEY (student_id),
    
    -- Unique Email Constraint
    CONSTRAINT uq_student_email UNIQUE (email),
    
    -- Check Constraints (MySQL 8.0.16+ enforces CHECK constraints)
    CONSTRAINT chk_student_age CHECK (age >= 15 AND age <= 100),
    CONSTRAINT chk_student_marks CHECK (marks >= 0.00 AND marks <= 100.00),
    CONSTRAINT chk_student_semester CHECK (semester >= 1 AND semester <= 8)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Step 3: Insert Demo Data (Clearly labeled for testing)
-- Demonstrates diverse grade thresholds: A (>=90), B (>=80), C (>=70), D (>=60), F (<60)
INSERT INTO students (student_id, name, age, course, email, marks, semester) VALUES
(101, 'Aarav Sharma',     20, 'Computer Science',       'aarav.sharma@example.edu',     94.50, 4),
(102, 'Diya Patel',        19, 'Information Technology', 'diya.patel@example.edu',       86.00, 2),
(103, 'Rohan Verma',       21, 'Electronics Engineering','rohan.verma@example.edu',      74.25, 6),
(104, 'Sneha Mukherjee',   20, 'Computer Science',       'sneha.m@example.edu',          65.50, 4),
(105, 'Vikram Malhotra',   22, 'Mechanical Engineering', 'vikram.m@example.edu',         52.00, 8);

-- Step 4: Verification Queries
-- Verify all rows are properly inserted
SELECT 
    student_id,
    name,
    age,
    course,
    email,
    marks,
    semester,
    CASE 
        WHEN marks >= 90.00 THEN 'A'
        WHEN marks >= 80.00 THEN 'B'
        WHEN marks >= 70.00 THEN 'C'
        WHEN marks >= 60.00 THEN 'D'
        ELSE 'F'
    END AS computed_grade,
    created_at
FROM students
ORDER BY student_id ASC;

-- Step 5: Dedicated Application User (Recommended Least-Privileged Access)
-- Uncomment and execute the lines below if you wish to create a dedicated user
-- rather than using the root administrative account:
--
-- CREATE USER IF NOT EXISTS 'student_user'@'localhost' IDENTIFIED BY 'StudentPass@123';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON student_management.* TO 'student_user'@'localhost';
-- FLUSH PRIVILEGES;
