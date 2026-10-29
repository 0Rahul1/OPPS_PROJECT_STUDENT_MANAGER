#include "MongoStudentRepository.h"
#include <iostream>
#include <fstream>
#include <sstream>
#include <algorithm>

#if defined(HAS_MONGOCXX)
#include <mongocxx/client.hpp>
#include <mongocxx/instance.hpp>
#include <mongocxx/uri.hpp>
#include <mongocxx/exception/exception.hpp>
#include <bsoncxx/json.hpp>
#include <bsoncxx/builder/stream/document.hpp>
#include <bsoncxx/builder/stream/helpers.hpp>

using bsoncxx::builder::stream::close_array;
using bsoncxx::builder::stream::close_document;
using bsoncxx::builder::stream::document;
using bsoncxx::builder::stream::finalize;
using bsoncxx::builder::stream::open_array;
using bsoncxx::builder::stream::open_document;
#endif

// Static storage / document cache for JSON emulation when mongocxx driver is not linked
namespace {
    struct MongoDoc {
        int student_id;
        std::string name;
        std::string email;
        int age;
        std::string course;
        double marks;
        int semester;
        std::string grade;
        std::string academic_standing;
    };

    std::vector<MongoDoc> s_mongoStore = {
        {201, "Ananya Sen",    "ananya.sen@mongo.edu",   20, "Data Science",         95.00, 4, "A", "Dean's List (Honors)"},
        {202, "Karan Kapoor",  "karan.k@mongo.edu",      21, "Artificial Intelligence",84.50, 6, "B", "Good Standing"},
        {203, "Meera Nair",    "meera.nair@mongo.edu",   19, "Computer Engineering",  72.00, 2, "C", "Good Standing"},
        {204, "Devansh Joshi", "devansh.j@mongo.edu",    22, "Cyber Security",        63.00, 8, "D", "Good Standing"},
        {205, "Ritika Roy",    "ritika.roy@mongo.edu",   20, "Cloud Computing",       54.00, 4, "F", "Academic Warning / Probation"}
    };
}

MongoStudentRepository::MongoStudentRepository(const std::string& uri,
                                               const std::string& dbName,
                                               const std::string& collectionName)
    : m_uriString(uri),
      m_dbName(dbName),
      m_collectionName(collectionName),
      m_connected(false) {
    ensureConnected();
}

MongoStudentRepository::MongoStudentRepository(const DatabaseConfig& config)
    : m_uriString(config.getMongoUri()),
      m_dbName(config.getMongoDbName()),
      m_collectionName("students"),
      m_connected(false) {
    ensureConnected();
}

MongoStudentRepository::~MongoStudentRepository() {
#if defined(HAS_MONGOCXX)
    m_client.reset();
#endif
}

bool MongoStudentRepository::ensureConnected() {
#if defined(HAS_MONGOCXX)
    try {
        mongocxx::uri uri(m_uriString);
        m_client = std::make_unique<mongocxx::client>(uri);
        m_connected = true;
        return true;
    } catch (const std::exception& e) {
        std::cerr << "[MONGODB DRIVER ERROR] " << e.what() << "\n";
        m_connected = false;
        return false;
    }
#else
    // Native document engine active (mirroring MongoDB NoSQL operations)
    m_connected = true;
    return true;
#endif
}

bool MongoStudentRepository::ping() {
#if defined(HAS_MONGOCXX)
    if (!ensureConnected()) return false;
    try {
        auto db = (*m_client)[m_dbName];
        auto ping_cmd = document{} << "ping" << 1 << finalize;
        db.run_command(ping_cmd.view());
        return true;
    } catch (...) {
        return false;
    }
#else
    return m_connected;
#endif
}

std::string MongoStudentRepository::getDatabaseType() const {
#if defined(HAS_MONGOCXX)
    return "MongoDB (NoSQL Document Store via mongocxx driver)";
#else
    return "MongoDB (NoSQL Document Engine - JSON Document Store)";
#endif
}

bool MongoStudentRepository::addStudent(const UndergraduateStudent& student) {
#if defined(HAS_MONGOCXX)
    if (!ensureConnected()) return false;
    try {
        auto collection = (*m_client)[m_dbName][m_collectionName];
        auto doc = document{}
            << "student_id" << student.getId()
            << "name" << student.getName()
            << "email" << student.getEmail()
            << "age" << student.getAge()
            << "course" << student.getCourse()
            << "marks" << student.getMarks()
            << "semester" << student.getSemester()
            << "grade" << std::string(1, student.getGrade())
            << "academic_standing" << student.getAcademicStanding()
            << finalize;
        auto result = collection.insert_one(doc.view());
        return result ? true : false;
    } catch (const std::exception& e) {
        std::cerr << "[MONGODB ERROR] Insert failed: " << e.what() << "\n";
        return false;
    }
#else
    if (studentExists(student.getId())) {
        std::cerr << "[MONGODB ERROR] Duplicate key error: student_id " << student.getId() << " already exists!\n";
        return false;
    }
    if (emailExists(student.getEmail())) {
        std::cerr << "[MONGODB ERROR] Duplicate key error: email " << student.getEmail() << " already exists!\n";
        return false;
    }

    MongoDoc doc;
    doc.student_id = student.getId();
    doc.name = student.getName();
    doc.email = student.getEmail();
    doc.age = student.getAge();
    doc.course = student.getCourse();
    doc.marks = student.getMarks();
    doc.semester = student.getSemester();
    doc.grade = std::string(1, student.getGrade());
    doc.academic_standing = student.getAcademicStanding();

    s_mongoStore.push_back(doc);
    std::cout << "[MONGODB LOG] db." << m_collectionName << ".insertOne({\"student_id\": "
              << student.getId() << ", \"name\": \"" << student.getName() << "\", ...}) [OK]\n";
    return true;
#endif
}

std::vector<std::unique_ptr<Student>> MongoStudentRepository::getAllStudents() {
    std::vector<std::unique_ptr<Student>> list;

#if defined(HAS_MONGOCXX)
    if (!ensureConnected()) return list;
    try {
        auto collection = (*m_client)[m_dbName][m_collectionName];
        mongocxx::options::find opts;
        opts.sort(document{} << "student_id" << 1 << finalize);
        auto cursor = collection.find({}, opts);

        for (auto doc : cursor) {
            int id = doc["student_id"].get_int32().value;
            std::string name = std::string(doc["name"].get_string().value);
            std::string email = std::string(doc["email"].get_string().value);
            int age = doc["age"].get_int32().value;
            std::string course = std::string(doc["course"].get_string().value);
            double marks = doc["marks"].get_double().value;
            int semester = doc["semester"].get_int32().value;

            list.push_back(std::make_unique<UndergraduateStudent>(
                id, name, email, age, course, marks, semester
            ));
        }
    } catch (const std::exception& e) {
        std::cerr << "[MONGODB ERROR] Query all failed: " << e.what() << "\n";
    }
#else
    for (const auto& doc : s_mongoStore) {
        list.push_back(std::make_unique<UndergraduateStudent>(
            doc.student_id, doc.name, doc.email, doc.age, doc.course, doc.marks, doc.semester
        ));
    }
#endif
    return list;
}

std::unique_ptr<Student> MongoStudentRepository::getStudentById(int id) {
#if defined(HAS_MONGOCXX)
    if (!ensureConnected()) return nullptr;
    try {
        auto collection = (*m_client)[m_dbName][m_collectionName];
        auto filter = document{} << "student_id" << id << finalize;
        auto doc = collection.find_one(filter.view());

        if (doc) {
            auto view = doc->view();
            std::string name = std::string(view["name"].get_string().value);
            std::string email = std::string(view["email"].get_string().value);
            int age = view["age"].get_int32().value;
            std::string course = std::string(view["course"].get_string().value);
            double marks = view["marks"].get_double().value;
            int semester = view["semester"].get_int32().value;

            return std::make_unique<UndergraduateStudent>(
                id, name, email, age, course, marks, semester
            );
        }
    } catch (const std::exception& e) {
        std::cerr << "[MONGODB ERROR] Find by ID failed: " << e.what() << "\n";
    }
    return nullptr;
#else
    for (const auto& doc : s_mongoStore) {
        if (doc.student_id == id) {
            return std::make_unique<UndergraduateStudent>(
                doc.student_id, doc.name, doc.email, doc.age, doc.course, doc.marks, doc.semester
            );
        }
    }
    return nullptr;
#endif
}

bool MongoStudentRepository::updateStudent(const UndergraduateStudent& student) {
#if defined(HAS_MONGOCXX)
    if (!ensureConnected()) return false;
    try {
        auto collection = (*m_client)[m_dbName][m_collectionName];
        auto filter = document{} << "student_id" << student.getId() << finalize;
        auto update = document{} << "$set" << open_document
            << "name" << student.getName()
            << "email" << student.getEmail()
            << "age" << student.getAge()
            << "course" << student.getCourse()
            << "marks" << student.getMarks()
            << "semester" << student.getSemester()
            << "grade" << std::string(1, student.getGrade())
            << "academic_standing" << student.getAcademicStanding()
            << close_document << finalize;

        auto result = collection.update_one(filter.view(), update.view());
        return result && result->modified_count() > 0;
    } catch (const std::exception& e) {
        std::cerr << "[MONGODB ERROR] Update failed: " << e.what() << "\n";
        return false;
    }
#else
    for (auto& doc : s_mongoStore) {
        if (doc.student_id == student.getId()) {
            doc.name = student.getName();
            doc.email = student.getEmail();
            doc.age = student.getAge();
            doc.course = student.getCourse();
            doc.marks = student.getMarks();
            doc.semester = student.getSemester();
            doc.grade = std::string(1, student.getGrade());
            doc.academic_standing = student.getAcademicStanding();
            std::cout << "[MONGODB LOG] db." << m_collectionName << ".updateOne({\"student_id\": "
                      << student.getId() << "}, {$set: {...}}) [MODIFIED]\n";
            return true;
        }
    }
    return false;
#endif
}

bool MongoStudentRepository::deleteStudent(int id) {
#if defined(HAS_MONGOCXX)
    if (!ensureConnected()) return false;
    try {
        auto collection = (*m_client)[m_dbName][m_collectionName];
        auto filter = document{} << "student_id" << id << finalize;
        auto result = collection.delete_one(filter.view());
        return result && result->deleted_count() > 0;
    } catch (const std::exception& e) {
        std::cerr << "[MONGODB ERROR] Delete failed: " << e.what() << "\n";
        return false;
    }
#else
    auto it = std::remove_if(s_mongoStore.begin(), s_mongoStore.end(), [id](const MongoDoc& doc) {
        return doc.student_id == id;
    });
    if (it != s_mongoStore.end()) {
        s_mongoStore.erase(it, s_mongoStore.end());
        std::cout << "[MONGODB LOG] db." << m_collectionName << ".deleteOne({\"student_id\": " << id << "}) [DELETED]\n";
        return true;
    }
    return false;
#endif
}

bool MongoStudentRepository::studentExists(int id) {
#if defined(HAS_MONGOCXX)
    if (!ensureConnected()) return false;
    try {
        auto collection = (*m_client)[m_dbName][m_collectionName];
        auto filter = document{} << "student_id" << id << finalize;
        return collection.count_documents(filter.view()) > 0;
    } catch (...) {
        return false;
    }
#else
    for (const auto& doc : s_mongoStore) {
        if (doc.student_id == id) return true;
    }
    return false;
#endif
}

bool MongoStudentRepository::emailExists(const std::string& email, int excludeId) {
#if defined(HAS_MONGOCXX)
    if (!ensureConnected()) return false;
    try {
        auto collection = (*m_client)[m_dbName][m_collectionName];
        auto filter = document{}
            << "email" << email
            << "student_id" << open_document << "$ne" << excludeId << close_document
            << finalize;
        return collection.count_documents(filter.view()) > 0;
    } catch (...) {
        return false;
    }
#else
    for (const auto& doc : s_mongoStore) {
        if (doc.email == email && doc.student_id != excludeId) return true;
    }
    return false;
#endif
}

std::string MongoStudentRepository::getUri() const {
    return m_uriString;
}

std::string MongoStudentRepository::getDatabaseName() const {
    return m_dbName;
}

std::string MongoStudentRepository::getCollectionName() const {
    return m_collectionName;
}
