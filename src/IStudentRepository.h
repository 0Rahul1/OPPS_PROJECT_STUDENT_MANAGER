#ifndef I_STUDENT_REPOSITORY_H
#define I_STUDENT_REPOSITORY_H

#include "Student.h"
#include "UndergraduateStudent.h"
#include <vector>
#include <memory>
#include <string>

/**
 * @brief Abstract Repository Interface for Student Persistence.
 * 
 * Demonstrates:
 * - Interface Segregation & Dependency Inversion Principle (SOLID).
 * - Full Abstraction: High-level application logic (Menu/UI) depends only on this interface,
 *   completely decoupled from whether the persistence backend is MySQL (Relational SQL)
 *   or MongoDB (Document NoSQL).
 * - Polymorphic Repository swapping at runtime.
 */
class IStudentRepository {
public:
    virtual ~IStudentRepository() = default;

    // Connectivity verification
    virtual bool ping() = 0;
    virtual std::string getDatabaseType() const = 0;

    // CRUD Operations
    virtual bool addStudent(const UndergraduateStudent& student) = 0;
    virtual std::vector<std::unique_ptr<Student>> getAllStudents() = 0;
    virtual std::unique_ptr<Student> getStudentById(int id) = 0;
    virtual bool updateStudent(const UndergraduateStudent& student) = 0;
    virtual bool deleteStudent(int id) = 0;

    // Constraints & Validation Helpers
    virtual bool studentExists(int id) = 0;
    virtual bool emailExists(const std::string& email, int excludeId = 0) = 0;
};

#endif // I_STUDENT_REPOSITORY_H
