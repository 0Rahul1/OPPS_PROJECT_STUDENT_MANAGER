#ifndef DATABASE_CONFIG_H
#define DATABASE_CONFIG_H

#include <string>

/**
 * @brief Class responsible for safely loading and managing database configuration.
 * 
 * Demonstrates:
 * - Security Best Practices: Credentials never hardcoded; loaded from environment or local .env file.
 * - Encapsulation: Database connection parameters are encapsulated and sanitized.
 * - Polyglot Persistence Support: Supports both MySQL and MongoDB connection properties.
 */
class DatabaseConfig {
private:
    std::string m_dbType;      // "mysql" or "mongodb"
    
    // MySQL Properties
    std::string m_host;
    int m_port;
    std::string m_user;
    std::string m_password;
    std::string m_database;

    // MongoDB Properties
    std::string m_mongoUri;
    std::string m_mongoDbName;

    void trim(std::string& s) const;
    void parseEnvLine(const std::string& line);

public:
    DatabaseConfig();

    // Loads configuration prioritizing environment variables, then .env file, then defaults
    bool load(const std::string& envFilePath = ".env");

    // Database Engine Type
    std::string getDbType() const;
    void setDbType(const std::string& type);

    // MySQL Getters
    std::string getHost() const;
    int getPort() const;
    std::string getUser() const;
    std::string getPassword() const;
    std::string getDatabase() const;
    std::string getHostUrl() const;

    // MongoDB Getters
    std::string getMongoUri() const;
    std::string getMongoDbName() const;

    // Print safe configuration summary (passwords masked)
    void printSummary() const;
};

#endif // DATABASE_CONFIG_H
