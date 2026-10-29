# 🎓 VIVA PREPARATION GUIDE
## 20 Core Viva Questions & Answers for Student Management System

This guide prepares you for your oral examination (viva voce) on the **Student Management System (C++ OOP + MySQL)** project. Each question includes a concise, technically precise answer that you can easily memorize and explain to your external examiners.

---

### Q1: What is the overall architecture of this project?
**Answer:**  
The project follows a **4-tier layered architecture**:
1. **Presentation Layer (`Menu`)**: Handles console user interactions, input validation, and formatted tables.
2. **Domain Entity Layer (`Person`, `Student`, `UndergraduateStudent`)**: Encapsulates core business data and grading logic.
3. **Data Access Layer (`StudentRepository`)**: Executes SQL operations using prepared statements with bound parameters.
4. **Database Infrastructure Layer (`DatabaseConfig`, `DatabaseConnection`)**: Manages credentials from `.env` files and handles MySQL Connector/C++ driver lifecycle on TCP/IP port 3306.

---

### Q2: Which OOP concepts are implemented in this project, and where?
**Answer:**  
All six core OOP pillars are implemented:
1. **Classes and Objects**: All entities (`Student`, `Repository`, `Menu`) are modeled as classes and instantiated as objects.
2. **Encapsulation**: Private/protected data members (`m_id`, `m_marks`, `m_age`) accessed only via validated getters and setters.
3. **Abstraction**: The abstract base class `Person` hides implementation details via pure virtual methods.
4. **Inheritance**: Multilevel inheritance from `Person` -> `Student` -> `UndergraduateStudent`.
5. **Runtime Polymorphism**: Virtual functions (`displayDetails()`, `getRole()`) overridden in derived classes and called via base class pointers.
6. **Constructors & Destructors**: Parameterized constructors with member initializer lists and virtual destructors to ensure RAII.

---

### Q3: What is the role of the `Person` class, and why is it abstract?
**Answer:**  
`Person` is an **Abstract Base Class** that models common demographic attributes (`id`, `name`, `email`). It is abstract because it contains pure virtual functions:
```cpp
virtual void displayDetails() const = 0;
virtual std::string getRole() const = 0;
```
It cannot be instantiated directly. This enforces a common contract across all human entities in the system.

---

### Q4: What is the inheritance hierarchy used in this project?
**Answer:**  
The project implements **Multilevel Inheritance**:
1. `Person` (Base Class): Manages ID, Name, Email, and validation.
2. `Student` (Derived from `Person`): Adds Age, Course, Aggregate Marks, and automated Grade calculation.
3. `UndergraduateStudent` (Derived from `Student`): Adds Semester progression (1–8) and Academic Standing (Dean's List / Good Standing / Academic Probation).

---

### Q5: What is Runtime Polymorphism, and how is it demonstrated in this code?
**Answer:**  
Runtime Polymorphism (or dynamic dispatch) allows a method call to be resolved at runtime based on the actual type of the object pointed to.  
In our repository and menu:
```cpp
std::vector<std::unique_ptr<Student>> list = repo.getAllStudents();
for (const auto& student : list) {
    student->displayDetails(); // Dynamic dispatch invokes UndergraduateStudent::displayDetails()
}
```
The compiler uses the **vtable (virtual table)** and **vptr (virtual table pointer)** to route the call to the appropriate derived class implementation.

---

### Q6: Why is a virtual destructor mandatory in the base class?
**Answer:**  
When an object of a derived class is deleted through a base class pointer (e.g. `std::unique_ptr<Student>` or `delete basePtr`), if the base class destructor is NOT virtual, only the base class destructor will execute. This causes **undefined behavior** and **memory leaks** because derived class resources are never deallocated. Making the destructor `virtual ~Person() = default;` guarantees that destructors execute in reverse inheritance order.

---

### Q7: How is Encapsulation achieved and why is it beneficial?
**Answer:**  
Encapsulation binds data and the methods that manipulate that data together, hiding internal representations. Data members like `m_marks` and `m_age` are declared `protected` or `private`. They can only be modified through methods like `setMarks()` or `setAge()`, which enforce domain rules (e.g., age must be 15–100, marks must be 0–100). This protects the internal state from illegal external modification.

---

### Q8: What is the difference between an Abstract Class and an Interface in C++?
**Answer:**  
- **Abstract Class**: A class with at least one pure virtual function (`= 0`). It can have data members, constructors, and implemented concrete methods.
- **Interface**: C++ does not have an explicit `interface` keyword; an interface is conceptually a pure abstract class containing *only* pure virtual functions, no member variables (except static constants), and a virtual destructor.

---

### Q9: Why did you use a real MySQL Server instead of text files or SQLite?
**Answer:**  
1. **Data Integrity & Persistence**: Real RDBMS provides ACID (Atomicity, Consistency, Isolation, Durability) guarantees.
2. **Concurrent Access**: Real MySQL Server supports multi-user client-server transactions.
3. **Relational Constraints**: MySQL enforces primary keys, unique keys, and check constraints (`CHECK (marks >= 0.00)`).
4. **Industry Relevance**: Demonstrates real-world enterprise C++ application engineering using database drivers rather than toy file storage.

---

### Q10: What is MySQL Connector/C++ and which API version did you use?
**Answer:**  
MySQL Connector/C++ is the official database driver developed by Oracle allowing C++ applications to connect to MySQL Server.  
There are two distinct APIs:
1. **X DevAPI** (for MySQL Document Store and X Protocol on port 33060).
2. **Legacy JDBC API** (Object-oriented relational API connecting via Classic MySQL Protocol on port 3306).  
Our project strictly uses the **stable JDBC API** (`sql::Driver`, `sql::Connection`, `sql::PreparedStatement`, `sql::ResultSet`).

---

### Q11: What is the difference between port 3306 and port 33060?
**Answer:**  
- **Port 3306**: The standard port for **MySQL Classic Protocol**. Used by classic MySQL clients, MySQL Workbench, and Connector/C++ JDBC connections.
- **Port 33060**: The port for **MySQL X Protocol**, used by the modern X DevAPI for asynchronous NoSQL document operations.  
Connecting to port 33060 with standard JDBC produces packet framing/connection handshake errors.

---

### Q12: What is a Prepared Statement, and why did you use it?
**Answer:**  
A Prepared Statement is a pre-compiled SQL template executed by the database server. Values are sent separately through bound parameter placeholders (`?`).  
Benefits:
1. **Security**: Complete immunity against SQL Injection because parameters are treated strictly as data literals, never as executable SQL code.
2. **Performance**: Query plan is parsed and optimized once by the database engine and can be re-executed multiple times.

---

### Q13: How does your code prevent SQL Injection?
**Answer:**  
We never concatenate user inputs directly into SQL strings.  
Instead of doing:
```cpp
// VULNERABLE:
std::string sql = "SELECT * FROM students WHERE email = '" + userInput + "'";
```
We bind parameters explicitly:
```cpp
// SECURE:
std::unique_ptr<sql::PreparedStatement> pstmt(conn->prepareStatement(
    "SELECT * FROM students WHERE email = ?"
));
pstmt->setString(1, userInput);
```
Even if `userInput` contains `' OR '1'='1`, the MySQL server treats it strictly as a raw string literal.

---

### Q14: How does the application handle duplicate IDs or Emails?
**Answer:**  
1. **Application Level**: Before inserting or updating, `m_repo.studentExists(id)` and `m_repo.emailExists(email)` query the database and alert the user with friendly error messages.
2. **Database Level**: The `students` table defines `PRIMARY KEY (student_id)` and `UNIQUE KEY (email)`. If a duplicate is attempted, MySQL throws `sql::SQLException` with error code `1062` (`ER_DUP_ENTRY`), which is caught and explained gracefully.

---

### Q15: How are database credentials stored and managed securely?
**Answer:**  
Passwords are **never hardcoded** in C++ source files. Credentials are read from operating system environment variables (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`) or a local `.env` configuration file parsed by `DatabaseConfig`. The `.env` file is explicitly listed in `.gitignore` to prevent committing secrets to version control.

---

### Q16: What happens if the MySQL service is stopped or unreachable?
**Answer:**  
The application wraps connection attempts in `try...catch (const sql::SQLException& e)` blocks. If the server is offline, MySQL error code `2003` (`CR_CONN_HOST_ERROR`) is caught. Instead of crashing, the system prints actionable troubleshooting advice (e.g. check Windows service `MySQL80`, verify port 3306) and continues running in safe diagnostic mode.

---

### Q17: How does your program handle invalid user input (e.g., entering letters for an integer)?
**Answer:**  
When an invalid character is entered into `std::cin >> intVar`:
1. `std::cin.fail()` evaluates to true.
2. `std::cin.clear()` resets the stream error flag.
3. `std::cin.ignore(numeric_limits<streamsize>::max(), '\n')` discards all erroneous characters in the buffer up to the newline.
4. The user is prompted to enter a valid number, preventing infinite loops.

---

### Q18: What is RAII, and how is it used in your C++ code?
**Answer:**  
**RAII (Resource Acquisition Is Initialization)** is a C++ idiom where resource lifecycle is bound to object lifetime. When an object goes out of scope, its destructor automatically frees the resource.  
In this project:
- `std::unique_ptr<sql::Connection>` and `std::unique_ptr<sql::PreparedStatement>` guarantee that database connections and statement handles are automatically closed and freed when they go out of scope, eliminating memory and resource leaks.

---

### Q19: How does the grade calculation logic work?
**Answer:**  
Grade calculation is encapsulated inside `Student::computeGradeFromMarks(double marks)`:
- `marks >= 90.00`: **A** (Distinction / Outstanding)
- `marks >= 80.00`: **B** (Very Good)
- `marks >= 70.00`: **C** (Good)
- `marks >= 60.00`: **D** (Pass)
- `marks < 60.00`:  **F** (Fail)  
Additionally, `UndergraduateStudent` calculates academic standing:
- `>= 90.00`: Dean's List (Honors)
- `>= 60.00`: Good Standing
- `< 60.00`: Academic Warning / Probation

---

### Q20: What are the challenges in linking MySQL Connector/C++ on Windows, and how did you resolve them?
**Answer:**  
1. **Header Inclusion**: Provided a preprocessor `#if __has_include` cascade to handle both standard `include/` and `include/jdbc/` layouts.
2. **Library Linking**: Linked `mysqlcppconn.lib` for the 64-bit architecture.
3. **Runtime DLL Dependency**: On Windows, the binary depends on `mysqlcppconn-9-vs14.dll`. We configured CMake post-build copy commands and provided scripts to ensure the DLL sits alongside `StudentManagementSystem.exe`.

---

### Q21: What is the Abstract Repository Pattern, and how does it allow swapping between MySQL and MongoDB?
**Answer:**  
The Abstract Repository Pattern defines a pure virtual interface (`IStudentRepository`) with CRUD methods (`addStudent`, `getAllStudents`, `getStudentById`, etc.).  
- `StudentRepository` implements this interface using SQL queries and prepared statements for **MySQL**.
- `MongoStudentRepository` implements this interface using document collections for **MongoDB**.  
Because the `Menu` interacts only with `IStudentRepository&`, the application can switch between MySQL (Relational) and MongoDB (NoSQL) dynamically at runtime without altering a single line of presentation or domain logic. This adheres directly to the **Dependency Inversion Principle** and **Open/Closed Principle** of SOLID design.

---

### Q22: What are the core differences between storing student records in MySQL vs. MongoDB in this project?
**Answer:**  
1. **Data Model**: MySQL stores records in tabular format with fixed column schemas (`students` table in `InnoDB`). MongoDB stores records as semi-structured BSON documents inside the `students` collection.
2. **Schema Enforcement**: MySQL enforces schema rigidity via column types and SQL `CHECK` constraints. MongoDB supports dynamic schemas, but in this project, schema consistency is enforced using `$jsonSchema` validators.
3. **Port & Protocol**: MySQL uses TCP port **3306** (Classic Protocol), while MongoDB operates over TCP port **27017**.
4. **Query Paradigm**: MySQL relies on compiled SQL statements (`INSERT INTO students ... VALUES (?, ?)`), whereas MongoDB executes BSON command objects (`db.students.insertOne({...})`).
