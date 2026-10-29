#include "DatabaseConfig.h"
#include "DatabaseConnection.h"
#include "StudentRepository.h"
#include "MongoStudentRepository.h"
#include "Menu.h"
#include <iostream>
#include <memory>

int main() {
    std::cout << "===============================================================\n";
    std::cout << "         ACADEMIC STUDENT MANAGEMENT SYSTEM (C++ OOP)          \n";
    std::cout << "          Polyglot Architecture: MySQL & MongoDB             \n";
    std::cout << "===============================================================\n\n";

    // Step 1: Load configuration securely from environment variables or .env file
    DatabaseConfig config;
    config.load(".env");
    config.printSummary();

    // Step 2: Instantiate both Repositories (Polyglot Persistence via IStudentRepository)
    StudentRepository mysqlRepo(config);
    MongoStudentRepository mongoRepo(config);

    // Determine initial active repository from configuration (default: mysql)
    IStudentRepository* activeRepo = (config.getDbType() == "mongodb") 
                                     ? static_cast<IStudentRepository*>(&mongoRepo)
                                     : static_cast<IStudentRepository*>(&mysqlRepo);

    // Step 3: Validate database connectivity for chosen active backend
    std::cout << "\n[STEP 1/2] Verifying initial connection to " << activeRepo->getDatabaseType() << "...\n";
    if (config.getDbType() != "mongodb") {
        if (!DatabaseConnection::testConnection(config)) {
            std::cerr << "\n[CRITICAL WARNING] Could not establish connection with MySQL Server!\n"
                      << "  1. Verify MySQL Server service is started (net start MySQL80 / MySQL84).\n"
                      << "  2. You can switch to MongoDB mode at any time using Option 7 in the menu!\n\n";
        } else {
            std::cout << "[STEP 2/2] MySQL database link verified.\n";
        }
    } else {
        if (!mongoRepo.ping()) {
            std::cout << "[INFO] MongoDB operating in local document store mode.\n";
        } else {
            std::cout << "[STEP 2/2] MongoDB link verified.\n";
        }
    }

    // Step 4: Initialize Menu Interface with dynamic database switching callback
    Menu menu(*activeRepo);

    auto switchDatabase = [&]() {
        if (activeRepo == &mysqlRepo) {
            activeRepo = &mongoRepo;
            std::cout << "[SYSTEM] Switched active repository to MongoDB.\n";
        } else {
            activeRepo = &mysqlRepo;
            std::cout << "[SYSTEM] Switched active repository to MySQL.\n";
        }
        menu.setRepository(*activeRepo);
    };

    menu = Menu(*activeRepo, switchDatabase);

    // Step 5: Run Interactive Application Loop
    try {
        menu.run();
    } catch (const std::exception& ex) {
        std::cerr << "\n[FATAL ERROR] An unexpected exception occurred: " << ex.what() << "\n";
        return 1;
    } catch (...) {
        std::cerr << "\n[FATAL ERROR] An unknown fatal error occurred.\n";
        return 1;
    }

    return 0;
}
