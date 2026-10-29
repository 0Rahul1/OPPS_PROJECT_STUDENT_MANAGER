#include "DatabaseConnection.h"
#include <iostream>

std::unique_ptr<sql::Connection> DatabaseConnection::createConnection(const DatabaseConfig& config) {
#if defined(HAS_MYSQL_CONNECTOR)
    try {
        sql::Driver* driver = get_driver_instance();
        if (!driver) {
            std::cerr << "[DATABASE ERROR] Unable to acquire MySQL Connector/C++ driver instance.\n";
            return nullptr;
        }

        std::unique_ptr<sql::Connection> conn(driver->connect(
            config.getHostUrl(),
            config.getUser(),
            config.getPassword()
        ));

        if (conn && !config.getDatabase().empty()) {
            conn->setSchema(config.getDatabase());
        }

        return conn;
    } catch (const sql::SQLException& e) {
        printSqlError(e);
        return nullptr;
    } catch (const std::exception& ex) {
        std::cerr << "[SYSTEM ERROR] Standard exception during DB connection: " << ex.what() << "\n";
        return nullptr;
    }
#else
    (void)config;
    std::cerr << "[DATABASE NOTICE] MySQL Connector/C++ library is not yet installed on this PC.\n"
              << "  -> To enable live MySQL operations, install MySQL Connector/C++ 8.4 LTS (x64).\n"
              << "  -> You can use the active MongoDB backend right now via Option 7 in the menu!\n";
    return nullptr;
#endif
}

bool DatabaseConnection::testConnection(const DatabaseConfig& config) {
#if defined(HAS_MYSQL_CONNECTOR)
    std::cout << "[INFO] Attempting to connect to MySQL Server at " << config.getHostUrl() << "...\n";
    auto conn = createConnection(config);
    if (conn && conn->isValid()) {
        std::cout << "[SUCCESS] Successfully connected to MySQL Server and selected database: '"
                  << config.getDatabase() << "'.\n";
        return true;
    }
    std::cerr << "[FAILURE] Could not establish connection to MySQL Server.\n";
    return false;
#else
    (void)config;
    return false;
#endif
}

void DatabaseConnection::printSqlError(const sql::SQLException& e) {
    std::cerr << "\n================ [MYSQL DATABASE ERROR] ================\n";
    std::cerr << "  Message:   " << e.what() << "\n";
    std::cerr << "  Error Code:" << e.getErrorCode() << "\n";
    std::cerr << "  SQLState:  " << e.getSQLState() << "\n";
    std::cerr << "--------------------------------------------------------\n";
    std::cerr << "  Troubleshooting Guide:\n";

    switch (e.getErrorCode()) {
        case 2003: // CR_CONN_HOST_ERROR
            std::cerr << "  -> Can't connect to MySQL server.\n"
                      << "     1. Ensure the MySQL Windows Service (MySQL80/MySQL84) is running.\n"
                      << "        Open PowerShell as Admin and run: Start-Service mysql*\n"
                      << "     2. Verify you are using port 3306 (Classic Protocol), NOT 33060 (X Protocol).\n"
                      << "     3. Check firewall settings blocking localhost:3306.\n";
            break;
        case 1045: // ER_ACCESS_DENIED_ERROR
            std::cerr << "  -> Access denied for specified user/password.\n"
                      << "     1. Verify credentials in your '.env' file.\n"
                      << "     2. Check if user has permission to connect from 'localhost' or '127.0.0.1'.\n"
                      << "     3. If using root, ensure the password matches your MySQL root account.\n";
            break;
        case 1049: // ER_BAD_DB_ERROR
            std::cerr << "  -> Unknown database specified.\n"
                      << "     1. Have you run 'database/schema.sql' in MySQL Workbench or mysql CLI?\n"
                      << "     2. Run: mysql -u root -p < database/schema.sql\n";
            break;
        case 1062: // ER_DUP_ENTRY
            std::cerr << "  -> Duplicate entry error (Primary key or Unique constraint violated).\n"
                      << "     A student with this ID or Email already exists in the database.\n";
            break;
        case 3819: // Check constraint violated
            std::cerr << "  -> Check constraint violated.\n"
                      << "     Ensure Age is between 15-100 and Marks are between 0-100.\n";
            break;
        default:
            std::cerr << "  -> General MySQL execution error. Check your query syntax and permissions.\n";
            break;
    }
    std::cerr << "========================================================\n\n";
}
