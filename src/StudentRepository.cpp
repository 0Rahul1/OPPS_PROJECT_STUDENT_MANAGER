#include "StudentRepository.h"
#include <iostream>

StudentRepository::StudentRepository(const DatabaseConfig& config)
    : m_config(config), m_conn(nullptr) {
    ensureConnected();
}

bool StudentRepository::ensureConnected() {
#if defined(HAS_MYSQL_CONNECTOR)
    try {
        if (!m_conn || m_conn->isClosed()) {
            m_conn = DatabaseConnection::createConnection(m_config);
        }
        return (m_conn != nullptr && !m_conn->isClosed());
    } catch (...) {
        return false;
    }
#else
    return false;
#endif
}

bool StudentRepository::ping() {
    return ensureConnected();
}

std::string StudentRepository::getDatabaseType() const {
    return "MySQL (Relational RDBMS - Port 3306)";
}

bool StudentRepository::addStudent(const UndergraduateStudent& student) {
#if defined(HAS_MYSQL_CONNECTOR)
    if (!ensureConnected()) {
        std::cerr << "[ERROR] Cannot add student: MySQL Database connection offline.\n";
        return false;
    }

    try {
        const std::string sql = "INSERT INTO students (student_id, name, age, course, email, marks, semester) "
                                "VALUES (?, ?, ?, ?, ?, ?, ?)";
        std::unique_ptr<sql::PreparedStatement> pstmt(m_conn->prepareStatement(sql));

        // Binding parameters securely (Prevents SQL Injection)
        pstmt->setInt(1, student.getId());
        pstmt->setString(2, student.getName());
        pstmt->setInt(3, student.getAge());
        pstmt->setString(4, student.getCourse());
        pstmt->setString(5, student.getEmail());
        pstmt->setDouble(6, student.getMarks());
        pstmt->setInt(7, student.getSemester());

        int rowsAffected = pstmt->executeUpdate();
        return rowsAffected > 0;
    } catch (const sql::SQLException& e) {
        DatabaseConnection::printSqlError(e);
        return false;
    }
#else
    (void)student;
    std::cerr << "[NOTICE] MySQL Connector is not linked. Switch to MongoDB using Option 7 in the menu!\n";
    return false;
#endif
}

std::vector<std::unique_ptr<Student>> StudentRepository::getAllStudents() {
    std::vector<std::unique_ptr<Student>> list;
#if defined(HAS_MYSQL_CONNECTOR)
    if (!ensureConnected()) {
        std::cerr << "[ERROR] Cannot fetch students: MySQL Database connection offline.\n";
        return list;
    }

    try {
        const std::string sql = "SELECT student_id, name, email, age, course, marks, semester "
                                "FROM students ORDER BY student_id ASC";
        std::unique_ptr<sql::Statement> stmt(m_conn->createStatement());
        std::unique_ptr<sql::ResultSet> res(stmt->executeQuery(sql));

        while (res->next()) {
            int id = res->getInt("student_id");
            std::string name = res->getString("name");
            std::string email = res->getString("email");
            int age = res->getInt("age");
            std::string course = res->getString("course");
            double marks = res->getDouble("marks");
            int semester = res->getInt("semester");

            list.push_back(std::make_unique<UndergraduateStudent>(
                id, name, email, age, course, marks, semester
            ));
        }
    } catch (const sql::SQLException& e) {
        DatabaseConnection::printSqlError(e);
    }
#endif
    return list;
}

std::unique_ptr<Student> StudentRepository::getStudentById(int id) {
#if defined(HAS_MYSQL_CONNECTOR)
    if (!ensureConnected()) {
        std::cerr << "[ERROR] Cannot find student: MySQL Database connection offline.\n";
        return nullptr;
    }

    try {
        const std::string sql = "SELECT student_id, name, email, age, course, marks, semester "
                                "FROM students WHERE student_id = ? LIMIT 1";
        std::unique_ptr<sql::PreparedStatement> pstmt(m_conn->prepareStatement(sql));
        pstmt->setInt(1, id);

        std::unique_ptr<sql::ResultSet> res(pstmt->executeQuery());
        if (res->next()) {
            std::string name = res->getString("name");
            std::string email = res->getString("email");
            int age = res->getInt("age");
            std::string course = res->getString("course");
            double marks = res->getDouble("marks");
            int semester = res->getInt("semester");

            return std::make_unique<UndergraduateStudent>(
                id, name, email, age, course, marks, semester
            );
        }
    } catch (const sql::SQLException& e) {
        DatabaseConnection::printSqlError(e);
    }
#else
    (void)id;
#endif
    return nullptr;
}

bool StudentRepository::updateStudent(const UndergraduateStudent& student) {
#if defined(HAS_MYSQL_CONNECTOR)
    if (!ensureConnected()) {
        std::cerr << "[ERROR] Cannot update student: MySQL Database connection offline.\n";
        return false;
    }

    try {
        const std::string sql = "UPDATE students SET name = ?, age = ?, course = ?, "
                                "email = ?, marks = ?, semester = ? WHERE student_id = ?";
        std::unique_ptr<sql::PreparedStatement> pstmt(m_conn->prepareStatement(sql));

        pstmt->setString(1, student.getName());
        pstmt->setInt(2, student.getAge());
        pstmt->setString(3, student.getCourse());
        pstmt->setString(4, student.getEmail());
        pstmt->setDouble(5, student.getMarks());
        pstmt->setInt(6, student.getSemester());
        pstmt->setInt(7, student.getId());

        int rowsAffected = pstmt->executeUpdate();
        return rowsAffected > 0;
    } catch (const sql::SQLException& e) {
        DatabaseConnection::printSqlError(e);
        return false;
    }
#else
    (void)student;
    return false;
#endif
}

bool StudentRepository::deleteStudent(int id) {
#if defined(HAS_MYSQL_CONNECTOR)
    if (!ensureConnected()) {
        std::cerr << "[ERROR] Cannot delete student: MySQL Database connection offline.\n";
        return false;
    }

    try {
        const std::string sql = "DELETE FROM students WHERE student_id = ?";
        std::unique_ptr<sql::PreparedStatement> pstmt(m_conn->prepareStatement(sql));
        pstmt->setInt(1, id);

        int rowsAffected = pstmt->executeUpdate();
        return rowsAffected > 0;
    } catch (const sql::SQLException& e) {
        DatabaseConnection::printSqlError(e);
        return false;
    }
#else
    (void)id;
    return false;
#endif
}

bool StudentRepository::studentExists(int id) {
#if defined(HAS_MYSQL_CONNECTOR)
    if (!ensureConnected()) return false;
    try {
        const std::string sql = "SELECT 1 FROM students WHERE student_id = ? LIMIT 1";
        std::unique_ptr<sql::PreparedStatement> pstmt(m_conn->prepareStatement(sql));
        pstmt->setInt(1, id);
        std::unique_ptr<sql::ResultSet> res(pstmt->executeQuery());
        return res->next();
    } catch (...) {
        return false;
    }
#else
    (void)id;
    return false;
#endif
}

bool StudentRepository::emailExists(const std::string& email, int excludeId) {
#if defined(HAS_MYSQL_CONNECTOR)
    if (!ensureConnected()) return false;
    try {
        const std::string sql = "SELECT 1 FROM students WHERE email = ? AND student_id != ? LIMIT 1";
        std::unique_ptr<sql::PreparedStatement> pstmt(m_conn->prepareStatement(sql));
        pstmt->setString(1, email);
        pstmt->setInt(2, excludeId);
        std::unique_ptr<sql::ResultSet> res(pstmt->executeQuery());
        return res->next();
    } catch (...) {
        return false;
    }
#else
    (void)email;
    (void)excludeId;
    return false;
#endif
}
