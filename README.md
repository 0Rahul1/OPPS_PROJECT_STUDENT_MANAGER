# Student Management System (C++ OOP + Polyglot MySQL & MongoDB)

A robust, enterprise-inspired terminal/console application for academic student record management built in **Modern C++ (C++17)** supporting **Polyglot Persistence**:
1. **MySQL Server**: Relational RDBMS via **MySQL Connector/C++ (Stable JDBC API)** on port 3306 with prepared statements and parameter binding.
2. **MongoDB**: Document NoSQL store via **IStudentRepository** on port 27017 supporting BSON document collections and runtime database switching!

---

## 🌟 Key Features

- **Polyglot Persistence**: Seamlessly toggle between **MySQL (Relational SQL)** and **MongoDB (Document NoSQL)** via the **Abstract Repository Pattern (`IStudentRepository`)**.
- **Full Database CRUD Operations**: Add, View, Search, Update, and Delete students directly in MySQL or MongoDB.
- **Enterprise-Grade OOP Architecture**: Implements Classes & Objects, Encapsulation, Abstraction, Multilevel Inheritance, Runtime Polymorphism, and Dependency Inversion (SOLID).
- **Automated Grade Calculation**: Computes letter grades (A, B, C, D, F) and academic standings (Dean's List, Good Standing, Academic Warning) dynamically from aggregate marks (0–100).
- **Security & SQL Injection Prevention**: Exclusively uses Prepared Statements with bound parameters (`?` placeholders) for all user data in MySQL, and structured BSON documents in MongoDB.
- **Zero Hardcoded Secrets**: Reads credentials securely from environment variables or a `.env` file excluded from version control.
- **Bulletproof Input Validation**: Guards against buffer overflows, invalid data types, negative identifiers, invalid email formats, and infinite loops on `std::cin` failure.
- **Graceful Error Handling**: Captures native `sql::SQLException` and MongoDB exceptions with plain-English troubleshooting advice.

---

## 🏗️ Architecture & OOP Design

The project separates presentation, business logic, and persistence cleanly:

```
+---------------------------------------------------------------------------------------+
|                                  Menu (src/Menu.cpp)                                  |
|         Terminal UI, Input Validation, Table Formatting, DB Switcher (Option 7)       |
+---------------------------------------------------------------------------------------+
                                           |
                                           v
+---------------------------------------------------------------------------------------+
|                         OOP Domain Model (Classes & Hierarchy)                        |
|                                                                                       |
|                             Person (Abstract Base Class)                              |
|                                   ^                                                   |
|                                   | (Inheritance)                                     |
|                                Student                                                |
|                                   ^                                                   |
|                                   | (Multilevel Inheritance)                          |
|                         UndergraduateStudent                                          |
+---------------------------------------------------------------------------------------+
                                           |
                                           v
+---------------------------------------------------------------------------------------+
|                    IStudentRepository (src/IStudentRepository.h)                      |
|                  Abstract Interface defining Student Data Operations                  |
+---------------------------------------------------------------------------------------+
                        |                                           |
                        v (Implements)                              v (Implements)
+-----------------------------------------------+   +-----------------------------------+
|      StudentRepository (MySQL Backend)        |   |   MongoStudentRepository (MongoDB)|
|  Prepared Statements, Port 3306, JDBC Driver  |   |   BSON Documents, Port 27017      |
+-----------------------------------------------+   +-----------------------------------+
                        |                                           |
                        v                                           v
+-----------------------------------------------+   +-----------------------------------+
|              MySQL Server RDBMS               |   |          MongoDB NoSQL            |
|         (student_management.students)         |   |    (student_management.students)  |
+-----------------------------------------------+   +-----------------------------------+
```

### OOP Principles Implemented:
1. **Classes and Objects**: `Person`, `Student`, `UndergraduateStudent`, `DatabaseConfig`, `DatabaseConnection`, `StudentRepository`, `MongoStudentRepository`, `Menu`.
2. **Encapsulation**: Private and protected member variables with strict getter/setter validation (e.g. `setAge`, `setMarks`, `setEmail`).
3. **Abstraction**: 
   * Entity Abstraction: `Person` declares pure virtual methods `virtual void displayDetails() const = 0` and `virtual std::string getRole() const = 0`.
   * Data Abstraction: `IStudentRepository` defines the abstract contract for all persistence backends.
4. **Inheritance**: `Person` -> `Student` -> `UndergraduateStudent`.
5. **Runtime Polymorphism**: Virtual methods and dynamic dispatch (`student->displayDetails()`) invoked through `std::unique_ptr<Student>` base pointers with proper virtual destructors.
6. **Dependency Inversion Principle**: The presentation layer (`Menu`) depends only on `IStudentRepository`, enabling on-the-fly database swapping (MySQL $\leftrightarrow$ MongoDB) without modifying UI logic.

---

## 📁 Project Directory Structure

```
Oppes_Project/
├── .env.example              # Configuration template for MySQL & MongoDB
├── .gitignore                # Excludes credentials, build artifacts, and binaries
├── CMakeLists.txt            # CMake build configuration for C++17 & Connectors
├── build.bat                 # 1-click Windows build script
├── setup_environment.ps1     # Diagnostic tool for inspecting tools on Windows
├── README.md                 # Complete setup, build, and troubleshooting guide
├── database/
│   ├── schema.sql            # MySQL table definitions, constraints, and demo data
│   └── mongo_setup.js        # MongoDB collection schema validation and demo docs
├── src/
│   ├── main.cpp              # Application entry point & polyglot repo setup
│   ├── Person.h / .cpp       # Abstract base class
│   ├── Student.h / .cpp      # Core student entity & grade calculation
│   ├── UndergraduateStudent.h / .cpp # Specialized student with academic standing
│   ├── IStudentRepository.h  # Abstract repository interface (SOLID)
│   ├── DatabaseConfig.h / .cpp       # Safe credentials loader (.env / environment)
│   ├── DatabaseConnection.h / .cpp   # MySQL driver factory & exception formatter
│   ├── StudentRepository.h / .cpp   # MySQL JDBC prepared statement repository
│   ├── MongoStudentRepository.h / .cpp # MongoDB NoSQL document store repository
│   └── Menu.h / .cpp                 # Interactive console UI & input validation
└── docs/
    ├── PROJECT_REPORT.md     # Academic mini-project report
    └── VIVA_PREPARATION.md   # 20 questions and answers for college viva
```

---

## ⚙️ Environment Prerequisites (Windows 10/11 x64)

| Component | Minimum Version | Recommended / Tested |
|---|---|---|
| **OS** | Windows 10 x64 | Windows 11 x64 |
| **Compiler** | C++17 support | Visual Studio 2022 (MSVC) or MinGW-w64 (GCC 11+) |
| **Build Tool** | CMake 3.16+ | CMake 3.28+ |
| **Relational DB** | MySQL Server 8.0+ | MySQL Server 8.4 LTS / 8.0 (Port 3306) |
| **Document DB** | MongoDB 6.0+ | MongoDB Community Server 7.0 / 8.0 (Port 27017) |
| **Connectors** | MySQL Connector/C++ 8.x | MySQL Connector/C++ 8.4 LTS (x64) |

---

## 📥 Installation Steps for Windows

### Step 1: Install Build Tools & CMake
In an elevated PowerShell terminal:
```powershell
# Install CMake
winget install Kitware.CMake --accept-package-agreements --accept-source-agreements

# Install Visual Studio Build Tools (or Visual Studio Community 2022 with C++ Desktop Development)
winget install Microsoft.VisualStudio.2022.BuildTools --accept-package-agreements --accept-source-agreements
```

### Step 2: Install Databases (MySQL and/or MongoDB)

#### A. MySQL Server:
```powershell
winget install Oracle.MySQL --accept-package-agreements --accept-source-agreements
winget install Oracle.MySQLWorkbench --accept-package-agreements --accept-source-agreements
```

#### B. MongoDB (Optional):
```powershell
winget install MongoDB.Server --accept-package-agreements --accept-source-agreements
winget install MongoDB.Shell --accept-package-agreements --accept-source-agreements
```

### Step 3: Install MySQL Connector/C++ (8.4 LTS x64)
1. Download **Windows (x86, 64-bit), MSI Installer** from [Oracle MySQL Connector/C++ Downloads](https://dev.mysql.com/downloads/connector/cpp/).
2. Run installer (default path: `C:\Program Files\MySQL\Connector C++ 8.4`).

---

## 🗄️ Database Initialization

### For MySQL:
Run the SQL schema in MySQL Workbench or CLI:
```bash
mysql -u root -p < database/schema.sql
```

### For MongoDB:
Run the MongoDB setup script via `mongosh`:
```bash
mongosh database/mongo_setup.js
```

---

## 🔐 Credentials Configuration

1. Copy `.env.example` to `.env`:
   ```powershell
   Copy-Item .env.example .env
   ```
2. Configure your `.env`:
   ```ini
   # Set default backend: 'mysql' or 'mongodb'
   DB_TYPE=mysql

   # MySQL Settings (Port 3306)
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=YourMySQLPasswordHere
   DB_NAME=student_management

   # MongoDB Settings (Port 27017 or Atlas URI)
   MONGO_URI=mongodb://127.0.0.1:27017
   MONGO_DB_NAME=student_management
   ```

---

## 🔨 Building and Running

### Build:
```cmd
build.bat
```

### Run:
```cmd
build\Release\StudentManagementSystem.exe
```

In the interactive menu:
* Options **1–5**: Full CRUD operations.
* Option **6**: System Diagnostics and active database status.
* Option **7**: **Switch Database Engine** (toggles between MySQL and MongoDB on the fly!).

---

## 📜 License & Academic Integrity
Prepared for academic coursework in Object-Oriented Programming and Database Management Systems.
