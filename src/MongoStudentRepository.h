#ifndef MONGO_STUDENT_REPOSITORY_H
#define MONGO_STUDENT_REPOSITORY_H

#include "IStudentRepository.h"
#include "DatabaseConfig.h"
#include <string>
#include <memory>
#include <vector>

// Forward declarations for MongoDB C++ Driver when available
#if defined(HAS_MONGOCXX)
namespace mongocxx {
    inline namespace v_noabi {
        class client;
        class database;
        class collection;
    }
}
#endif

/**
 * @brief MongoDB (NoSQL Document Store) implementation of IStudentRepository.
 * 
 * Demonstrates:
 * - Polyglot Persistence: System can operate seamlessly over Relational SQL (MySQL)
 *   or Document NoSQL (MongoDB) through the same IStudentRepository interface.
 * - BSON Document Model: Documents stored in the "students" collection.
 * - Dynamic Dispatch: Can be injected into Menu at runtime without modifying UI code.
 */
class MongoStudentRepository : public IStudentRepository {
private:
    std::string m_uriString;
    std::string m_dbName;
    std::string m_collectionName;
    bool m_connected;

#if defined(HAS_MONGOCXX)
    std::unique_ptr<mongocxx::client> m_client;
#endif

    bool ensureConnected();

public:
    MongoStudentRepository(const std::string& uri = "mongodb://127.0.0.1:27017",
                           const std::string& dbName = "student_management",
                           const std::string& collectionName = "students");
    explicit MongoStudentRepository(const DatabaseConfig& config);
    virtual ~MongoStudentRepository() override;

    // Connectivity verification
    virtual bool ping() override;
    virtual std::string getDatabaseType() const override;

    // CRUD Operations
    virtual bool addStudent(const UndergraduateStudent& student) override;
    virtual std::vector<std::unique_ptr<Student>> getAllStudents() override;
    virtual std::unique_ptr<Student> getStudentById(int id) override;
    virtual bool updateStudent(const UndergraduateStudent& student) override;
    virtual bool deleteStudent(int id) override;

    // Validation & Constraints
    virtual bool studentExists(int id) override;
    virtual bool emailExists(const std::string& email, int excludeId = 0) override;

    // Helper for diagnostic configuration
    std::string getUri() const;
    std::string getDatabaseName() const;
    std::string getCollectionName() const;
};

#endif // MONGO_STUDENT_REPOSITORY_H
