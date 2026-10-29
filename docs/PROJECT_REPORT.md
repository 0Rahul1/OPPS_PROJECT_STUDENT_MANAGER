# ACADEMIC MINI-PROJECT REPORT
# STUDENT MANAGEMENT SYSTEM (C++ OOP + MYSQL)

---

### **A Mini-Project Report Submitted in Partial Fulfillment of the Requirements for the Degree of**
### **[DEGREE_NAME_PLACEHOLDER - e.g., Bachelor of Technology / Bachelor of Science]**
### **in [DEPARTMENT_NAME_PLACEHOLDER - e.g., Computer Science & Engineering]**

**Submitted by:**  
**Student Name:** `[STUDENT_NAME_PLACEHOLDER]`  
**Roll / Registration Number:** `[ROLL_NUMBER_PLACEHOLDER]`  
**Semester / Section:** `[SEMESTER_SECTION_PLACEHOLDER]`  

**Under the Guidance of:**  
**Supervisor / Mentor Name:** `[FACULTY_NAME_PLACEHOLDER]`  
**Designation:** `[DESIGNATION_PLACEHOLDER]`  
**Department:** `[DEPARTMENT_NAME_PLACEHOLDER]`  

**Institution / University:**  
`[INSTITUTION_NAME_PLACEHOLDER]`  
`[UNIVERSITY_NAME_PLACEHOLDER]`  
**Academic Year:** `[ACADEMIC_YEAR_PLACEHOLDER - e.g., 2026–2027]`  
**Date of Submission:** `[SUBMISSION_DATE_PLACEHOLDER]`  

---

## 📋 TABLE OF CONTENTS
1. [Abstract](#1-abstract)
2. [Introduction & Problem Statement](#2-introduction--problem-statement)
3. [Project Objectives & Scope](#3-project-objectives--scope)
4. [System Requirements Specification (SRS)](#4-system-requirements-specification-srs)
5. [System Architecture & Design](#5-system-architecture--design)
6. [Database Design & Schema](#6-database-design--schema)
7. [Object-Oriented Programming (OOP) Concepts Demonstrated](#7-object-oriented-programming-oop-concepts-demonstrated)
8. [Module Description & Implementation](#8-module-description--implementation)
9. [Test Cases & Results](#9-test-cases--results)
10. [Limitations & Challenges Overcome](#10-limitations--challenges-overcome)
11. [Conclusion & Future Scope](#11-conclusion--future-scope)
12. [References](#12-references)

---

## 1. Abstract
The **Student Management System** is an intermediate-level console-based software application engineered to record, process, and maintain student academic profiles with persistence backed by an enterprise Relational Database Management System (RDBMS). Developed in **Modern C++ (C++17)** and integrated with **MySQL Server** via **MySQL Connector/C++ (Stable JDBC API)**, the application replaces volatile memory structures with real database transactions. The system demonstrates key Object-Oriented Programming principles: abstraction via an abstract `Person` base class, single and multilevel inheritance via `Student` and `UndergraduateStudent`, encapsulation with validated member access, and runtime polymorphism through dynamic dispatch. Prepared statements and parameter binding are enforced throughout to guarantee immunity against SQL injection vulnerabilities.

---

## 2. Introduction & Problem Statement

### 2.1 Background
Educational institutions handle large volumes of student records, including personal demographics, enrollment details, grades, and academic standing. Traditional academic projects often rely on static arrays, basic text files, or in-memory structures that lack concurrent integrity, transactional atomicity, and query scalability.

### 2.2 Problem Statement
Conventional student management academic assignments exhibit several critical flaws:
- **Volatile Storage**: Data stored in memory or unstructured flat files is prone to file corruption and lacks relational integrity.
- **Security Vulnerabilities**: String concatenation in database queries exposes applications to SQL injection attacks.
- **Shallow OOP Demonstration**: Many projects implement classes purely as passive data structs without genuine abstraction, inheritance, or runtime polymorphism.
- **Fragile Error Handling**: Poor input validation leads to infinite loops when invalid characters are typed into console streams.

### 2.3 Proposed Solution
The proposed Student Management System bridges the gap between foundational OOP theory and industry-standard database engineering. It implements a layered architecture separating console UI presentation, domain entities, and data access objects (DAO), persisting all records to an active MySQL Server database instance.

---

## 3. Project Objectives & Scope

### 3.1 Objectives
1. Design and develop a C++ console application utilizing object-oriented principles.
2. Establish a secure TCP/IP connection to a local MySQL Server instance on port 3306 using MySQL Connector/C++.
3. Implement complete CRUD (Create, Read, Update, Delete) database workflows.
4. Eliminate SQL injection vulnerabilities via parameterized prepared statements (`?` placeholders).
5. Automate grade calculation (A, B, C, D, F) and academic standing assignment (Dean's List, Good Standing, Academic Warning) based on aggregate marks.
6. Enforce bulletproof console stream validation to prevent application crashes upon malformed user input.
7. Manage configuration securely without hardcoding credentials in source code.

### 3.2 Scope
- **Target Users**: Academic advisors, department administrators, and course coordinators.
- **Operational Platform**: Cross-platform console interface with specialized build configuration for Windows environments.
- **Boundaries**: Focuses on core undergraduate student lifecycle management; excludes web-based graphic interfaces or complex financial accounting.

---

## 4. System Requirements Specification (SRS)

### 4.1 Hardware Requirements
- **Processor**: Intel Core i3 / AMD Ryzen 3 or higher (x64 architecture).
- **RAM**: Minimum 4 GB (8 GB recommended for running compiler and MySQL service concurrently).
- **Disk Space**: Minimum 2 GB free disk space (includes MySQL Server binaries and data directory).

### 4.2 Software Requirements
- **Operating System**: Windows 10 / 11 (64-bit) or compatible Linux distribution.
- **Compiler**: C++17 compliant compiler (MSVC v143 / Visual Studio 2022, or MinGW-w64 GCC 11+).
- **Build System**: CMake version 3.16 or higher.
- **Database Engine**: Oracle MySQL Community Server 8.0, 8.4 LTS, or 9.0.
- **Database Connector**: Oracle MySQL Connector/C++ (x64) supporting the JDBC API.
- **Protocol**: MySQL Classic Protocol on TCP/IP Port 3306.

---

## 5. System Architecture & Design

### 5.1 Layered Architecture
The application adheres to a clean 4-tier architectural separation utilizing the **Abstract Repository Pattern**:

```
+--------------------------------------------------------------------+
|                         Presentation Layer                         |
|      (Menu.h / Menu.cpp - Console UI, Input Validation, DB Switch) |
+--------------------------------------------------------------------+
                                 |
                                 v
+--------------------------------------------------------------------+
|                         Domain Entity Layer                        |
|   (Person.h/cpp -> Student.h/cpp -> UndergraduateStudent.h/cpp)     |
+--------------------------------------------------------------------+
                                 |
                                 v
+--------------------------------------------------------------------+
|                  Data Access Layer Interface (DAO)                 |
|            (IStudentRepository.h - Pure Abstract Interface)        |
+--------------------------------------------------------------------+
                   |                                   |
                   v (Implements)                      v (Implements)
+------------------------------------+   +------------------------------------+
| StudentRepository (MySQL Backend)  |   | MongoStudentRepository (MongoDB)   |
| Prepared Statements (Port 3306)    |   | BSON Document Collections (27017)  |
+------------------------------------+   +------------------------------------+
                   |                                   |
                   v                                   v
+------------------------------------+   +------------------------------------+
|       MySQL Server Database        |   |         MongoDB Database           |
|   (student_management.students)    |   |   (student_management.students)    |
+------------------------------------+   +------------------------------------+
```

---

## 6. Database Design & Schema

### 6.1 Relational Schema (MySQL)
- **Database Name**: `student_management`
- **Table Name**: `students`
- **Storage Engine**: `InnoDB` (ACID compliant)
- **Character Set**: `utf8mb4`

### 6.2 Relational Data Dictionary

| Column Name | Data Type | Nullable | Key / Constraint | Description |
|---|---|---|---|---|
| `student_id` | `INT` | No | `PRIMARY KEY` | Unique institutional identification number |
| `name` | `VARCHAR(100)` | No | `CHECK (name != '')` | Full legal name of student |
| `age` | `INT` | No | `CHECK (age >= 15 AND age <= 100)` | Student age in completed years |
| `course` | `VARCHAR(100)` | No | None | Enrolled academic program/degree |
| `email` | `VARCHAR(150)` | No | `UNIQUE` | Unique institutional email address |
| `marks` | `DECIMAL(5,2)` | No | `CHECK (marks >= 0.00 AND marks <= 100.00)` | Percentage aggregate score |
| `semester` | `INT` | No | `CHECK (semester >= 1 AND semester <= 8)` | Current academic semester (1–8) |
| `created_at` | `TIMESTAMP` | No | `DEFAULT CURRENT_TIMESTAMP` | System insertion timestamp |
| `updated_at` | `TIMESTAMP` | No | `ON UPDATE CURRENT_TIMESTAMP` | System modification timestamp |

### 6.3 Document NoSQL Schema (MongoDB)
- **Database Name**: `student_management`
- **Collection Name**: `students`
- **Validation**: Enforced via MongoDB `$jsonSchema` validator:
  ```json
  {
    "student_id": { "bsonType": "int", "description": "Unique student identifier" },
    "name": { "bsonType": "string", "description": "Student full legal name" },
    "email": { "bsonType": "string", "pattern": "^.+@.+\\..+$", "description": "Unique email" },
    "age": { "bsonType": "int", "minimum": 15, "maximum": 100 },
    "course": { "bsonType": "string" },
    "marks": { "bsonType": ["double", "int"], "minimum": 0.0, "maximum": 100.0 },
    "semester": { "bsonType": "int", "minimum": 1, "maximum": 8 },
    "grade": { "bsonType": "string" },
    "academic_standing": { "bsonType": "string" }
  }
  ```
- **Indexes**:
  * `db.students.createIndex({ student_id: 1 }, { unique: true })`
  * `db.students.createIndex({ email: 1 }, { unique: true })`

---

## 7. Object-Oriented Programming (OOP) Concepts Demonstrated

### 7.1 Classes and Objects
Every real-world entity and functional subsystem is modeled as an independent class:
- `Person`: Represents demographic entities.
- `Student`: Models institutional scholars with grades.
- `UndergraduateStudent`: Models degree-seeking undergraduates with semester and honor standing.
- `DatabaseConfig`: Encapsulates connection properties.
- `DatabaseConnection`: Factory for managing MySQL driver connections.
- `StudentRepository`: Manages SQL queries and parameter bindings.
- `Menu`: Orchestrates interactive user sessions.

### 7.2 Encapsulation
Member variables are private or protected (e.g. `m_id`, `m_name`, `m_marks`, `m_age`). Modification occurs exclusively through validated accessors and mutators (`setAge`, `setMarks`, `setEmail`). Invariant rules are enforced directly at the setter level, throwing `std::invalid_argument` or rejecting invalid input if out-of-range data is passed.

### 7.3 Abstraction
The abstract base class `Person` declares pure virtual methods:
```cpp
virtual void displayDetails() const = 0;
virtual std::string getRole() const = 0;
```
This hides internal implementation details while establishing a strict contract for all derived human entities. High-level callers interact solely with abstract interfaces without needing knowledge of underlying SQL statements.

### 7.4 Inheritance
The system showcases multilevel inheritance:
1. `Person` (Root abstract base class: id, name, email).
2. `Student` (Inherits from `Person`, introducing age, course, marks, grade calculation).
3. `UndergraduateStudent` (Inherits from `Student`, introducing semester progression and academic standing).

### 7.5 Runtime Polymorphism (Virtual Functions & Dynamic Dispatch)
Polymorphic behavior is achieved via virtual functions and overridden methods:
```cpp
std::vector<std::unique_ptr<Student>> list = repo.getAllStudents();
for (const auto& student : list) {
    student->displayDetails(); // Dynamic dispatch at runtime based on actual object type
}
```
Virtual destructors (`virtual ~Person() = default;`) ensure that deleting derived objects via base class pointers does not cause undefined behavior or memory leaks.

### 7.6 Constructors and Destructors
Constructors employ member initializer lists for performance and correctness. Parameterized constructors validate initial states before object instantiation. Destructors ensure deterministic RAII resource cleanup.

---

## 8. Module Description & Implementation

### 8.1 Module Breakdown
1. **Configuration Module (`DatabaseConfig`)**:
   - Parses configuration from environment variables and `.env` files.
   - Provides default fallback options without hardcoding passwords.
2. **Connection Factory (`DatabaseConnection`)**:
   - Acquires the MySQL Connector/C++ JDBC driver (`get_driver_instance()`).
   - Translates raw `sql::SQLException` error codes (2003, 1045, 1049, 1062) into plain-English diagnostics.
3. **Repository Module (`StudentRepository`)**:
   - Constructs prepared SQL statements (`PreparedStatement`).
   - Binds input parameters (`pstmt->setInt`, `pstmt->setString`, `pstmt->setDouble`).
   - Converts `ResultSet` rows into domain objects.
4. **Presentation & Menu Module (`Menu`)**:
   - Validates user input streams using `std::cin.fail()` clearing and buffer flushing.
   - Formats student records in an aligned console grid.
   - Manages workflow branching and confirmation dialogs.

---

## 9. Test Cases & Results

| Test ID | Test Description | Test Inputs | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| **TC-01** | Add Student (Valid) | ID: `106`, Name: `Kavya Rao`, Age: `20`, Marks: `92.5`, Sem: `4` | Row persisted in MySQL; Grade A; Status: Dean's List | Record persisted successfully | **PASS** |
| **TC-02** | Add Student (Duplicate ID) | ID: `101` (Existing ID) | System catches duplicate ID and rejects insertion | Rejected: ID already exists | **PASS** |
| **TC-03** | Add Student (Duplicate Email) | Email: `aarav.sharma@example.edu` | System catches duplicate email and rejects insertion | Rejected: Email already exists | **PASS** |
| **TC-04** | Input Validation (Invalid Age) | Age: `12` or `150` | Rejection prompt; user prompted to re-enter valid age (15–100) | Prompted to re-enter valid age | **PASS** |
| **TC-05** | Input Validation (Invalid Marks) | Marks: `-10` or `105.5` | Rejection prompt; bounds check enforces 0.00 to 100.00 | Prompted to re-enter valid marks | **PASS** |
| **TC-06** | Stream Error (Char for Integer) | Enter `"abc"` for Student ID | Stream clear and buffer flush; prevents infinite loop | Input rejected; no crash | **PASS** |
| **TC-07** | Display All Records | Select Option 2 | Tabular display of all active records from MySQL | Aligned table rendered | **PASS** |
| **TC-08** | Search Student (Found) | Search ID `101` | Displays details for Aarav Sharma | Record retrieved and formatted | **PASS** |
| **TC-09** | Search Student (Not Found) | Search ID `999` | Displays `[NOT FOUND] No student record matches ID 999` | Friendly not found message | **PASS** |
| **TC-10** | Update Student Details | Update marks of ID `105` to `82.0` | Marks updated; grade recalculated to `B`; persisted in MySQL | Row updated in MySQL | **PASS** |
| **TC-11** | Delete Student Record | Delete ID `105` with confirmation `'y'` | Row deleted from MySQL database table | Row deleted successfully | **PASS** |
| **TC-12** | Database Persistence Check | Add record `106`, exit app (`0`), relaunch | Record `106` remains visible upon relaunch | Data persisted across restarts | **PASS** |
| **TC-13** | Database Offline Handling | Stop MySQL service, launch app | Friendly error message explaining service status; no crash | Diagnostic alert displayed | **PASS** |

---

## 10. Limitations & Challenges Overcome

### 10.1 Technical Challenges Overcome
1. **Connector/C++ API Version Differences**:
   - MySQL Connector/C++ provides two distinct APIs: the X DevAPI (`mysqlx`) and the legacy JDBC API (`mysql`). Mixing header includes causes fatal compilation errors. The project cleanly isolated the stable JDBC API using an adaptable header cascade.
2. **Port Protocol Distinction**:
   - Port 3306 serves MySQL Classic Protocol, whereas port 33060 serves MySQL X Protocol. JDBC connections routed to port 33060 fail silently or report packet framing errors. Explicit documentation and default configurations guard against this.
3. **Windows DLL Resolution**:
   - On Windows, binaries require `mysqlcppconn-*.dll` at runtime. Configured automated CMake post-build scripts copy the required runtime DLL directly to the output executable directory.

### 10.2 Limitations
- Console interface without a graphical user interface (GUI).
- Single-institution deployment without multi-tenant role-based authentication.

---

## 11. Conclusion & Future Scope

### 11.1 Conclusion
The Student Management System successfully integrates Modern C++ OOP design patterns with an enterprise MySQL relational database. By moving beyond mock arrays or flat files to a real relational backend with prepared statements, the application provides persistent, robust, and secure student record management suitable for intermediate academic evaluation.

### 11.2 Future Scope
1. **Attendance & Fee Tracking**: Expand database schema to include fee payment schedules and course attendance logs.
2. **Multi-Role Authentication**: Add administrative and student login accounts with bcrypt password hashing.
3. **CSV/PDF Exporting**: Implement automated grade card generation and data export routines.

---

## 12. References
1. Stroustrup, B., *The C++ Programming Language (4th Edition)*, Addison-Wesley, 2013.
2. Oracle Corporation, *MySQL Connector/C++ 8.4 Developer Guide*, Oracle Documentation.
3. Silberschatz, A., Korth, H. F., & Sudarshan, S., *Database System Concepts (7th Edition)*, McGraw-Hill, 2019.
4. ISO/IEC 14882:2017, *Standard for Programming Language C++ (C++17)*.
