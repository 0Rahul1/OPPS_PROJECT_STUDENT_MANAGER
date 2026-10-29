#ifndef MENU_H
#define MENU_H

#include "IStudentRepository.h"
#include <string>
#include <memory>
#include <functional>

/**
 * @brief Terminal-based User Interface managing user interaction and input validation.
 * 
 * Demonstrates:
 * - Dependency Inversion: UI depends strictly on IStudentRepository interface,
 *   completely agnostic of whether MySQL or MongoDB is active.
 * - Robust stream input validation to prevent buffer corruption and infinite loops.
 * - Formatted console reporting with formatted tables.
 */
class Menu {
private:
    IStudentRepository* m_repo;
    std::function<void()> m_switchDbCallback;

    // Helper input validation functions
    int readInteger(const std::string& prompt, int minVal, int maxVal);
    double readDouble(const std::string& prompt, double minVal, double maxVal);
    std::string readString(const std::string& prompt, bool (*validator)(const std::string&) = nullptr, const std::string& errorMsg = "");
    bool confirmAction(const std::string& prompt);

    // Menu Action Handlers
    void handleAddStudent();
    void handleDisplayAll();
    void handleSearchStudent();
    void handleUpdateStudent();
    void handleDeleteStudent();
    void handleSystemStatus();
    void handleSwitchDatabase();

public:
    explicit Menu(IStudentRepository& repo, std::function<void()> switchDbCallback = nullptr);
    void setRepository(IStudentRepository& repo);
    void run();
};

#endif // MENU_H
