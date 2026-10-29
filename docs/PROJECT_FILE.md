# STUDENT MANAGEMENT SYSTEM (C++ OOP + MYSQL & MONGODB)
## COMPREHENSIVE MINI-PROJECT FILE & PRACTICAL RECORD

---
<!-- PAGE BREAK: PAGE 1 (COVER PAGE) -->
<div align="center">

# [INSTITUTION_NAME_PLACEHOLDER]
### [DEPARTMENT_OF_COMPUTER_SCIENCE_AND_ENGINEERING]
*(Approved by AICTE, Affiliated to [UNIVERSITY_NAME_PLACEHOLDER])*

<br/><br/>

### **A MINI-PROJECT REPORT / PRACTICAL RECORD FILE ON**
# **STUDENT MANAGEMENT SYSTEM**
### **(Implementation in Modern C++17 with Polyglot MySQL & MongoDB Persistence)**

<br/>

**Course**: Object-Oriented Programming & Database Management Systems Lab  
**Course Code**: `[COURSE_CODE_PLACEHOLDER - e.g., CS-402 / CS-301]`  
**Academic Session**: `2026 – 2027`

<br/><br/>

| **SUBMITTED BY:** | **UNDER THE SUPERVISION OF:** |
| :--- | :--- |
| **Student Name**: `[STUDENT_NAME_PLACEHOLDER]` | **Faculty Mentor**: `[FACULTY_NAME_PLACEHOLDER]` |
| **University Roll No**: `[ROLL_NO_PLACEHOLDER]` | **Designation**: `[DESIGNATION_PLACEHOLDER]` |
| **Registration No**: `[REG_NO_PLACEHOLDER]` | **Department**: Computer Science & Engineering |
| **Semester & Branch**: `[SEMESTER_BRANCH_PLACEHOLDER]` | **Institution**: `[INSTITUTION_NAME_PLACEHOLDER]` |

<br/><br/>

**Month & Year of Submission**: `October 2026`

</div>

---
<!-- PAGE BREAK: PAGE 2 (CERTIFICATES & ACKNOWLEDGEMENT) -->
<br/>

## CERTIFICATE OF ORIGINALITY

This is to certify that the mini-project entitled **"Student Management System (C++ OOP + MySQL & MongoDB)"** submitted by **`[STUDENT_NAME_PLACEHOLDER]`**, bearing University Roll Number **`[ROLL_NO_PLACEHOLDER]`**, is a bonafide record of academic project work carried out under my supervision in partial fulfillment of the requirements for the award of the degree of **[DEGREE_NAME_PLACEHOLDER]** in **[DEPARTMENT_NAME_PLACEHOLDER]** during the academic year 2026–2027.

To the best of my knowledge, the project work has achieved the requisite standard and has not been submitted elsewhere for the award of any other degree or diploma.

<br/><br/>

------------------------------------------- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; -------------------------------------------  
**Project Guide / Supervisor** &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **Head of Department (HOD)**  
[FACULTY_NAME_PLACEHOLDER] &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Dept. of Computer Science & Eng.  

<br/><br/>

-------------------------------------------  
**External Examiner (Viva Voce)**  
Date: `____ / ____ / 2026`

---

## ACKNOWLEDGEMENT

I express my deepest gratitude to my project supervisor, **`[FACULTY_NAME_PLACEHOLDER]`**, for their invaluable guidance, constant motivation, and constructive suggestions throughout the conceptualization and development of this project.

I am deeply indebted to **`[HOD_NAME_PLACEHOLDER]`**, Head of the Department of Computer Science & Engineering, and our respected Principal, **`[PRINCIPAL_NAME_PLACEHOLDER]`**, for providing state-of-the-art laboratory facilities and academic encouragement.

Finally, I extend my heartfelt thanks to my parents and peers who provided the continuous encouragement and support needed to bring this project to fruition.

<br/>

**`[STUDENT_NAME_PLACEHOLDER]`**  
Roll No: `[ROLL_NO_PLACEHOLDER]`

---
<!-- PAGE BREAK: PAGE 3 (ABSTRACT, PROBLEM STATEMENT & OBJECTIVES) -->
<br/>

## 1. ABSTRACT & PROJECT OVERVIEW

### 1.1 Abstract
The **Student Management System** is an intermediate-level academic enterprise application engineered in **Modern C++ (C++17)** that maintains, evaluates, and persists student academic records using an industry-standard **Relational Database Management System (MySQL Server)** and a **Document-Oriented NoSQL Store (MongoDB)**. The system eliminates the vulnerabilities of conventional volatile arrays and unstructured text files by enforcing transactional ACID properties, relational constraints, prepared statements, and the **Abstract Repository Pattern (`IStudentRepository`)**. Core Object-Oriented Programming (OOP) paradigms—including abstraction, multilevel inheritance, encapsulation, and runtime polymorphism—are leveraged to provide robust business logic, automated grade calculation, and interactive terminal and graphical management.

### 1.2 Problem Statement
Traditional student record systems built for academic coursework frequently exhibit critical shortcomings:
1. **Volatile Memory Storage**: Arrays or vectors lose all modified student records upon program exit.
2. **Lack of Relational Constraints**: Unstructured text files allow duplicate student IDs, corrupt email strings, and out-of-range marks.
3. **Security Risks**: Direct SQL concatenation exposes applications to SQL injection attacks.
4. **Fragile Stream Handling**: Entering non-numeric characters into standard console streams (`std::cin`) leads to fatal buffer crashes and infinite execution loops.

### 1.3 Project Objectives
* **Architecture**: Build a decoupled 4-tier layered architecture separating Presentation, Business Logic, and Data Access.
* **Database Integration**: Connect to an official MySQL Server instance via MySQL Connector/C++ (port 3306) and MongoDB (port 27017).
* **Prepared Statements**: Implement bound parameter placeholders (`?`) for 100% protection against SQL injection.
* **Automated Evaluation**: Compute letter grades (A, B, C, D, F) and academic standings (Dean's List, Good Standing, Probation) dynamically from aggregate marks (0–100).
* **Input Integrity**: Enforce bulletproof validation for integer ranges (age 15–100), decimal marks, and RFC-compliant email formats.
* **Polyglot Persistence**: Enable dynamic switching between Relational (MySQL) and NoSQL (MongoDB) databases at runtime without altering UI code.

---
<!-- PAGE BREAK: PAGE 4 (SYSTEM REQUIREMENTS & ARCHITECTURE) -->
<br/>

## 2. SYSTEM REQUIREMENTS SPECIFICATION (SRS) & ARCHITECTURE

### 2.1 Hardware Requirements
* **Processor**: 64-bit Intel Core i3 / AMD Ryzen 3 or higher.
* **RAM**: Minimum 4 GB RAM (8 GB recommended for concurrent database service execution).
* **Storage**: Minimum 2 GB free disk space.

### 2.2 Software Specifications
* **Operating System**: Windows 10 / 11 (64-bit) or Linux (Ubuntu 22.04 LTS+).
* **Language & Standard**: C++17 (ISO/IEC 14882:2017).
* **Compiler**: MinGW-w64 GCC 16.2 / MSVC v143 (Visual Studio 2022).
* **Build System**: CMake 3.16+ / Make / Ninja.
* **Database Backends**:
  * Oracle MySQL Community Server 8.0 / 8.4 LTS (TCP Port 3306).
  * MongoDB Community Server 7.0+ (TCP Port 27017).
* **Connectors**: Oracle MySQL Connector/C++ (Stable JDBC API) & MongoDB C++ Driver.

### 2.3 Layered System Architecture
The application employs the **Dependency Inversion Principle (DIP)** through an Abstract Repository Pattern:

```
+---------------------------------------------------------------------------------------+
|                                  Presentation Layer                                   |
|       (Menu.cpp - Terminal UI & server.js - Interactive Web Dashboard on Port 3000)   |
+---------------------------------------------------------------------------------------+
                                           │
                                           ▼
+---------------------------------------------------------------------------------------+
|                         Domain Entity Layer (OOP Hierarchy)                           |
|       Person (Abstract Base) ──► Student (Derived) ──► UndergraduateStudent           |
+---------------------------------------------------------------------------------------+
                                           │
                                           ▼
+---------------------------------------------------------------------------------------+
|                    Data Access Layer Interface (IStudentRepository)                   |
|               Pure Abstract Interface: add, getById, getAll, update, delete           |
+---------------------------------------------------------------------------------------+
                        │                                           │
                        ▼ (Implements)                              ▼ (Implements)
+-----------------------------------------------+   +-----------------------------------+
|      StudentRepository (MySQL Backend)        |   |   MongoStudentRepository (MongoDB)|
|  Prepared Statements, Port 3306, JDBC API     |   |   BSON Documents, Port 27017      |
+-----------------------------------------------+   +-----------------------------------+
                        │                                           │
                        ▼                                           ▼
+-----------------------------------------------+   +-----------------------------------+
|              MySQL Server Database            |   |          MongoDB Database         |
|         (student_management.students)         |   |    (student_management.students)  |
+-----------------------------------------------+   +-----------------------------------+
```

---
<!-- PAGE BREAK: PAGE 5 (OOP CONCEPTS DEMONSTRATED) -->
<br/>

## 3. OBJECT-ORIENTED PROGRAMMING (OOP) IMPLEMENTATION

The codebase explicitly incorporates the core tenets of Object-Oriented Software Engineering:

### 3.1 Abstraction
The system hides internal implementation details through the **Abstract Base Class `Person`** (`src/Person.h`), defining pure virtual functions:
```cpp
virtual void displayDetails() const = 0;
virtual std::string getRole() const = 0;
```
High-level callers interact solely with abstract method contracts without needing to know internal data formatting.

### 3.2 Encapsulation
All attributes (`m_id`, `m_name`, `m_email`, `m_marks`, `m_age`) are marked `protected` or `private`. Modifications occur exclusively through validated accessors:
* `Student::setAge(int age)` rejects values outside 15–100.
* `Student::setMarks(double marks)` enforces the 0.00–100.00 bounds.
* `Person::setEmail(string email)` validates string patterns against RFC regex.

### 3.3 Multilevel Inheritance
Identity and academic data are modeled in a clean 3-tier hierarchy:
```
[Person]                 (Abstract: id, name, email, displayDetails=0)
   ▲
   │ (Single Inheritance)
[Student]                (Derived: age, course, marks, grade, calculateGrade)
   ▲
   │ (Multilevel Inheritance)
[UndergraduateStudent]   (Specialized: semester [1-8], academicStanding, honors)
```

### 3.4 Runtime Polymorphism & Dynamic Dispatch
Polymorphic behavior is achieved using C++ virtual tables (`vtable`) and virtual table pointers (`vptr`):
```cpp
std::vector<std::unique_ptr<Student>> list = repo->getAllStudents();
for (const auto& student : list) {
    student->displayDetails(); // Dynamic dispatch routes to UndergraduateStudent::displayDetails()
}
```
Proper polymorphic cleanup is guaranteed by declaring `virtual ~Person() = default;` in the base class, eliminating memory leaks during destruction.

### 3.5 Dependency Inversion & SOLID Repository Pattern
The `Menu` UI holds an `IStudentRepository&` reference rather than a concrete SQL class. This allows runtime database swapping (`MySQL <-> MongoDB`) without altering UI code.

---
<!-- PAGE BREAK: PAGE 6 (DATABASE DESIGN & SCHEMAS) -->
<br/>

## 4. DATABASE DESIGN & RELATIONAL / NOSQL SCHEMAS

### 4.1 Relational Schema (MySQL)
* **Database**: `student_management`
* **Table**: `students` (InnoDB Engine, UTF-8 Unicode)

#### Relational Data Dictionary:
| Column Name | Type | Key / Constraint | Description |
| :--- | :--- | :--- | :--- |
| `student_id` | `INT` | `PRIMARY KEY` | Unique Institutional Student ID |
| `name` | `VARCHAR(100)` | `NOT NULL, CHECK (name != '')` | Full Legal Name |
| `age` | `INT` | `CHECK (age >= 15 AND age <= 100)` | Age in Years |
| `course` | `VARCHAR(100)` | `NOT NULL` | Degree / Academic Program |
| `email` | `VARCHAR(150)` | `UNIQUE, NOT NULL` | Unique Institutional Email |
| `marks` | `DECIMAL(5,2)` | `CHECK (marks >= 0.0 AND marks <= 100.0)` | Aggregate Percentage |
| `semester` | `INT` | `CHECK (semester >= 1 AND semester <= 8)` | Current Academic Semester |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Record Creation Timestamp |

### 4.2 Document NoSQL Schema (MongoDB)
* **Database**: `student_management`
* **Collection**: `students`
* **Validation**: Enforced via `$jsonSchema` engine in `database/mongo_setup.js`:
```json
{
  "$jsonSchema": {
    "bsonType": "object",
    "required": ["student_id", "name", "email", "age", "course", "marks", "semester"],
    "properties": {
      "student_id": { "bsonType": ["int", "long"], "description": "Unique integer ID" },
      "email": { "bsonType": "string", "pattern": "^.+@.+\\..+$" },
      "age": { "bsonType": "int", "minimum": 15, "maximum": 100 },
      "marks": { "bsonType": ["double", "int"], "minimum": 0.0, "maximum": 100.0 },
      "semester": { "bsonType": "int", "minimum": 1, "maximum": 8 }
    }
  }
}
```
* **Unique Indexes**: `db.students.createIndex({ student_id: 1 }, { unique: true })`, `db.students.createIndex({ email: 1 }, { unique: true })`.

---
<!-- PAGE BREAK: PAGE 7 (CORE ALGORITHMS & IMPLEMENTATION HIGHLIGHTS) -->
<br/>

## 5. CORE ALGORITHMS & IMPLEMENTATION HIGHLIGHTS

### 5.1 Automated Grade Calculation Algorithm
Grade computation is completely automated in `Student::computeGradeFromMarks(double marks)`:
$$\text{Grade} = \begin{cases} 
\text{'A'} & \text{if } \text{marks} \ge 90.00 \quad \text{[Dean's List / Honors]} \\
\text{'B'} & \text{if } 80.00 \le \text{marks} < 90.00 \quad \text{[Good Standing]} \\
\text{'C'} & \text{if } 70.00 \le \text{marks} < 80.00 \quad \text{[Good Standing]} \\
\text{'D'} & \text{if } 60.00 \le \text{marks} < 70.00 \quad \text{[Pass]} \\
\text{'F'} & \text{if } \text{marks} < 60.00 \quad \text{[Academic Warning / Probation]}
\end{cases}$$

### 5.2 Prepared Statements (SQL Injection Prevention)
SQL queries avoid insecure string concatenations by binding user inputs as isolated literals:
```cpp
const std::string sql = "INSERT INTO students (student_id, name, age, course, email, marks, semester) "
                        "VALUES (?, ?, ?, ?, ?, ?, ?)";
std::unique_ptr<sql::PreparedStatement> pstmt(m_conn->prepareStatement(sql));
pstmt->setInt(1, student.getId());
pstmt->setString(2, student.getName());
pstmt->setInt(3, student.getAge());
pstmt->setString(4, student.getCourse());
pstmt->setString(5, student.getEmail());
pstmt->setDouble(6, student.getMarks());
pstmt->setInt(7, student.getSemester());
pstmt->executeUpdate();
```

### 5.3 Bulletproof Stream Input Validation
Guards against invalid character entries into numeric fields (`cin >> intVal`):
```cpp
if (std::cin.fail()) {
    std::cin.clear(); // Reset stream error flags
    std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n'); // Purge buffer
    std::cout << "Invalid input format. Please try again.\n";
}
```

---
<!-- PAGE BREAK: PAGE 8 (TESTING, CONCLUSION & FUTURE SCOPE) -->
<br/>

## 6. VERIFICATION TEST CASES & CONCLUSION

### 6.1 Test Case Execution Summary
| Test ID | Test Scenario | Input Data | Expected Result | Status |
| :--- | :--- | :--- | :--- | :---: |
| **TC-01** | Add Student (Valid) | ID: `106`, Name: `Kavya Rao`, Marks: `92.5` | Row persisted, Grade: `A`, Status: `Dean's List` | **PASS** |
| **TC-02** | Add Student (Duplicate ID) | ID: `101` (Pre-existing) | Catches duplicate primary key, rejects insertion | **PASS** |
| **TC-03** | Add Student (Duplicate Email) | Email: `aarav.sharma@example.edu` | Catches unique key conflict, friendly alert | **PASS** |
| **TC-04** | Input Validation (Invalid Age) | Age: `12` or `140` | Bounds check fails (15–100), prompts re-entry | **PASS** |
| **TC-05** | Stream Fault (Typo in ID) | ID: `abc` | Clears `cin` fail bit, no crash/infinite loop | **PASS** |
| **TC-06** | Search Student by ID | ID: `101` | Displays details for Aarav Sharma polymorphically | **PASS** |
| **TC-07** | Update Marks & Grade | ID: `105`, Marks: `52.0` $\rightarrow$ `82.0` | Grade recalculates `F` $\rightarrow$ `B`, updated in database | **PASS** |
| **TC-08** | Polyglot DB Switch | Menu Option `7` | Toggles active backend between MySQL and MongoDB | **PASS** |

### 6.2 Limitations
* Operates on a single institutional campus without multi-tenant partitioning.
* Password hashing for administrative accounts is outside the immediate project scope.

### 6.3 Future Scope
1. **Biometric & Attendance Integration**: Extend database schemas to record biometric lecture attendance logs.
2. **Automated Grade Card Generation**: Export PDF mark sheets and analytical performance charts.
3. **Cloud Native Deployment**: Host on AWS RDS (MySQL) and MongoDB Atlas with containerized microservices.

### 6.4 Conclusion
The **Student Management System** demonstrates the integration of Object-Oriented C++ design patterns with production Relational (MySQL) and NoSQL (MongoDB) databases. By replacing rudimentary file-handling with compiled prepared statements, encapsulation, and runtime polymorphism, the project fulfills all academic and industry-level engineering standards.

<br/><br/>

**Student Signature**: ________________________ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **Supervisor Signature**: ________________________  
**Date**: `____ / ____ / 2026`
