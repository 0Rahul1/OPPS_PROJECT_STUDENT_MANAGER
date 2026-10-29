#include "DatabaseConfig.h"
#include <fstream>
#include <iostream>
#include <cstdlib>
#include <algorithm>

DatabaseConfig::DatabaseConfig()
    : m_dbType("mysql"),
      m_host("127.0.0.1"),
      m_port(3306),
      m_user("root"),
      m_password(""),
      m_database("student_management"),
      m_mongoUri("mongodb://127.0.0.1:27017"),
      m_mongoDbName("student_management") {}

void DatabaseConfig::trim(std::string& s) const {
    s.erase(s.begin(), std::find_if(s.begin(), s.end(), [](unsigned char ch) {
        return !std::isspace(ch);
    }));
    s.erase(std::find_if(s.rbegin(), s.rend(), [](unsigned char ch) {
        return !std::isspace(ch);
    }).base(), s.end());
}

void DatabaseConfig::parseEnvLine(const std::string& line) {
    std::string trimmed = line;
    trim(trimmed);

    if (trimmed.empty() || trimmed[0] == '#') {
        return;
    }

    auto delimiterPos = trimmed.find('=');
    if (delimiterPos == std::string::npos) {
        return;
    }

    std::string key = trimmed.substr(0, delimiterPos);
    std::string value = trimmed.substr(delimiterPos + 1);

    trim(key);
    trim(value);

    if (value.size() >= 2 && ((value.front() == '"' && value.back() == '"') ||
                              (value.front() == '\'' && value.back() == '\''))) {
        value = value.substr(1, value.size() - 2);
    }

    if (key == "DB_TYPE") {
        m_dbType = value;
        std::transform(m_dbType.begin(), m_dbType.end(), m_dbType.begin(), ::tolower);
    } else if (key == "DB_HOST") {
        m_host = value;
    } else if (key == "DB_PORT") {
        try {
            m_port = std::stoi(value);
        } catch (...) {
            m_port = 3306;
        }
    } else if (key == "DB_USER") {
        m_user = value;
    } else if (key == "DB_PASSWORD") {
        m_password = value;
    } else if (key == "DB_NAME") {
        m_database = value;
    } else if (key == "MONGO_URI") {
        m_mongoUri = value;
    } else if (key == "MONGO_DB_NAME") {
        m_mongoDbName = value;
    }
}

bool DatabaseConfig::load(const std::string& envFilePath) {
    std::ifstream file(envFilePath);
    if (file.is_open()) {
        std::string line;
        while (std::getline(file, line)) {
            parseEnvLine(line);
        }
        file.close();
    }

    // System Environment overrides
    const char* envType = std::getenv("DB_TYPE");
    if (envType && std::string(envType).length() > 0) {
        m_dbType = envType;
        std::transform(m_dbType.begin(), m_dbType.end(), m_dbType.begin(), ::tolower);
    }

    const char* envHost = std::getenv("DB_HOST");
    if (envHost && std::string(envHost).length() > 0) m_host = envHost;

    const char* envPort = std::getenv("DB_PORT");
    if (envPort && std::string(envPort).length() > 0) {
        try {
            m_port = std::stoi(envPort);
        } catch (...) {}
    }

    const char* envUser = std::getenv("DB_USER");
    if (envUser && std::string(envUser).length() > 0) m_user = envUser;

    const char* envPass = std::getenv("DB_PASSWORD");
    if (envPass) m_password = envPass;

    const char* envDb = std::getenv("DB_NAME");
    if (envDb && std::string(envDb).length() > 0) m_database = envDb;

    const char* envMongoUri = std::getenv("MONGO_URI");
    if (envMongoUri && std::string(envMongoUri).length() > 0) m_mongoUri = envMongoUri;

    const char* envMongoDb = std::getenv("MONGO_DB_NAME");
    if (envMongoDb && std::string(envMongoDb).length() > 0) m_mongoDbName = envMongoDb;

    return true;
}

std::string DatabaseConfig::getDbType() const {
    return m_dbType;
}

void DatabaseConfig::setDbType(const std::string& type) {
    m_dbType = type;
    std::transform(m_dbType.begin(), m_dbType.end(), m_dbType.begin(), ::tolower);
}

std::string DatabaseConfig::getHost() const { return m_host; }
int DatabaseConfig::getPort() const { return m_port; }
std::string DatabaseConfig::getUser() const { return m_user; }
std::string DatabaseConfig::getPassword() const { return m_password; }
std::string DatabaseConfig::getDatabase() const { return m_database; }

std::string DatabaseConfig::getHostUrl() const {
    return "tcp://" + m_host + ":" + std::to_string(m_port);
}

std::string DatabaseConfig::getMongoUri() const { return m_mongoUri; }
std::string DatabaseConfig::getMongoDbName() const { return m_mongoDbName; }

void DatabaseConfig::printSummary() const {
    std::cout << "[Database Configuration Loaded]\n";
    std::cout << "  Active Engine: " << (m_dbType == "mongodb" ? "MongoDB (NoSQL Document Store)" : "MySQL (Relational RDBMS)") << "\n";
    if (m_dbType == "mongodb") {
        std::cout << "  Mongo URI:     " << m_mongoUri << "\n";
        std::cout << "  Database:      " << m_mongoDbName << "\n";
    } else {
        std::cout << "  Host:          " << m_host << "\n";
        std::cout << "  Port:          " << m_port << " (MySQL Classic Protocol)\n";
        std::cout << "  Database:      " << m_database << "\n";
        std::cout << "  User:          " << m_user << "\n";
        std::cout << "  Password:      " << (m_password.empty() ? "(none)" : "********") << "\n";
    }
}
