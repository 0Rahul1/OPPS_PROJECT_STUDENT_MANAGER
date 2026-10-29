#ifndef DATABASE_CONNECTION_H
#define DATABASE_CONNECTION_H

#include "DatabaseConfig.h"
#include <memory>
#include <string>
#include <exception>

// Conditional compilation for MySQL Connector/C++ JDBC API
#if defined(HAS_MYSQL_CONNECTOR)
    #if __has_include(<mysql/jdbc.h>)
        #include <mysql/jdbc.h>
    #elif __has_include(<jdbc/mysql_driver.h>)
        #include <jdbc/mysql_driver.h>
        #include <jdbc/mysql_connection.h>
        #include <jdbc/cppconn/driver.h>
        #include <jdbc/cppconn/exception.h>
        #include <jdbc/cppconn/resultset.h>
        #include <jdbc/cppconn/statement.h>
        #include <jdbc/cppconn/prepared_statement.h>
    #else
        #include <mysql_driver.h>
        #include <mysql_connection.h>
        #include <cppconn/driver.h>
        #include <cppconn/exception.h>
        #include <cppconn/resultset.h>
        #include <cppconn/statement.h>
        #include <cppconn/prepared_statement.h>
    #endif
#else
    // Fallback forward definitions when MySQL Connector/C++ is not linked
    namespace sql {
        class Connection {
        public:
            virtual ~Connection() = default;
            virtual bool isClosed() const { return true; }
            virtual bool isValid() const { return false; }
            virtual void setSchema(const std::string&) {}
        };
        class SQLException : public std::exception {
        private:
            std::string m_msg;
            int m_code;
        public:
            SQLException(const std::string& msg = "MySQL Connector/C++ not linked", int code = 2003)
                : m_msg(msg), m_code(code) {}
            const char* what() const noexcept override { return m_msg.c_str(); }
            int getErrorCode() const { return m_code; }
            std::string getSQLState() const { return "08001"; }
        };
    }
#endif

/**
 * @brief Factory class to create and verify MySQL Connector/C++ JDBC connections.
 */
class DatabaseConnection {
public:
    static std::unique_ptr<sql::Connection> createConnection(const DatabaseConfig& config);
    static bool testConnection(const DatabaseConfig& config);
    static void printSqlError(const sql::SQLException& e);
};

#endif // DATABASE_CONNECTION_H
