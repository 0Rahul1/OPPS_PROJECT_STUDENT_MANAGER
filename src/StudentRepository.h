#ifndef STUDENT_REPOSITORY_H
#define STUDENT_REPOSITORY_H

#include "IStudentRepository.h"
#include "Student.h"
#include "UndergraduateStudent.h"
#include "DatabaseConfig.h"
#include "DatabaseConnection.h"
#include <vector>
#include <memory>

/**
 * @brief MySQL Implementation of IStudentRepository using MySQL Connector/C++ (JDBC API).
 * 
 * Demonstrates:
 * - Data Access Object (DAO) / Repository Pattern: Implements IStudentRepository.
 * - Security: Uses Prepared Statements with bound parameters (? placeholders) to prevent SQL injection.
 * - Exception Handling: Catches sql::SQLException, handles duplicate keys and connection drops gracefully.
 * - Runtime Polymorphism: Stores and returns polymorphic Student objects (UndergraduateStudent instances).
 */
class StudentRepository : public IStudentRepository {
private:
    DatabaseConfig m_config;
    std::unique_ptr<sql::Connection> m_conn;

    // Helper to ensure connection is alive before executing statements
    bool ensureConnected();

public:
    explicit StudentRepository(const DatabaseConfig& config);
    virtual ~StudentRepository() override = default;

    // Check if database service is reachable
    virtual bool ping() override;
    virtual std::string getDatabaseType() const override;

    // CRUD Operations using Prepared Statements
    virtual bool addStudent(const UndergraduateStudent& student) override;
    virtual std::vector<std::unique_ptr<Student>> getAllStudents() override;
    virtual std::unique_ptr<Student> getStudentById(int id) override;
    virtual bool updateStudent(const UndergraduateStudent& student) override;
    virtual bool deleteStudent(int id) override;

    // Uniqueness and existence verification helpers
    virtual bool studentExists(int id) override;
    virtual bool emailExists(const std::string& email, int excludeId = 0) override;
};

// Typedef alias for explicit naming
using MySQLStudentRepository = StudentRepository;

#endif // STUDENT_REPOSITORY_H
