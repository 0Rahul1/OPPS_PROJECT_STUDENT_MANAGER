#include "Menu.h"
#include <iostream>
#include <limits>
#include <iomanip>

Menu::Menu(IStudentRepository& repo, std::function<void()> switchDbCallback)
    : m_repo(&repo), m_switchDbCallback(switchDbCallback) {}

void Menu::setRepository(IStudentRepository& repo) {
    m_repo = &repo;
}

int Menu::readInteger(const std::string& prompt, int minVal, int maxVal) {
    int value;
    while (true) {
        std::cout << prompt;
        if (std::cin >> value) {
            std::string extra;
            std::getline(std::cin, extra);
            if (value >= minVal && value <= maxVal) {
                return value;
            }
            std::cout << "  [!] Input out of range (" << minVal << " to " << maxVal << "). Please try again.\n";
        } else {
            std::cout << "  [!] Invalid numeric format. Please enter an integer.\n";
            std::cin.clear();
            std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
        }
    }
}

double Menu::readDouble(const std::string& prompt, double minVal, double maxVal) {
    double value;
    while (true) {
        std::cout << prompt;
        if (std::cin >> value) {
            std::string extra;
            std::getline(std::cin, extra);
            if (value >= minVal && value <= maxVal) {
                return value;
            }
            std::cout << "  [!] Value out of bounds (" << std::fixed << std::setprecision(2)
                      << minVal << " to " << maxVal << "). Please try again.\n";
        } else {
            std::cout << "  [!] Invalid numeric format. Please enter a valid decimal number.\n";
            std::cin.clear();
            std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
        }
    }
}

std::string Menu::readString(const std::string& prompt, bool (*validator)(const std::string&), const std::string& errorMsg) {
    std::string line;
    while (true) {
        std::cout << prompt;
        std::getline(std::cin, line);
        
        size_t first = line.find_first_not_of(" \t\r\n");
        size_t last = line.find_last_not_of(" \t\r\n");
        if (first == std::string::npos) {
            line = "";
        } else {
            line = line.substr(first, (last - first + 1));
        }

        if (line.empty()) {
            std::cout << "  [!] Input cannot be empty. Please try again.\n";
            continue;
        }

        if (validator && !validator(line)) {
            std::cout << "  [!] " << (errorMsg.empty() ? "Invalid input format." : errorMsg) << "\n";
            continue;
        }

        return line;
    }
}

bool Menu::confirmAction(const std::string& prompt) {
    std::cout << prompt << " (y/N): ";
    std::string response;
    std::getline(std::cin, response);
    return (!response.empty() && (response[0] == 'y' || response[0] == 'Y'));
}

void Menu::handleAddStudent() {
    std::cout << "\n==================================================\n";
    std::cout << "              ADD NEW STUDENT RECORD              \n";
    std::cout << "==================================================\n";

    int id = readInteger("Enter Student ID (e.g., 101): ", 1, 999999999);
    if (m_repo->studentExists(id)) {
        std::cerr << "  [X] Error: Student with ID " << id << " already exists in the database!\n";
        return;
    }

    std::string name = readString("Enter Full Name: ", Person::isValidName, "Name must contain letters and spaces only.");
    
    std::string email;
    while (true) {
        email = readString("Enter Email Address: ", Person::isValidEmail, "Invalid email format (e.g., name@university.edu).");
        if (m_repo->emailExists(email)) {
            std::cerr << "  [X] Error: Email '" << email << "' is already registered to another student. Try again.\n";
        } else {
            break;
        }
    }

    int age = readInteger("Enter Age (15 - 100): ", 15, 100);
    std::string course = readString("Enter Degree/Course Name: ", Student::isValidCourse, "Course name is too long or empty.");
    double marks = readDouble("Enter Marks (0.00 - 100.00): ", 0.0, 100.0);
    int semester = readInteger("Enter Current Semester (1 - 8): ", 1, 8);

    UndergraduateStudent newStudent(id, name, email, age, course, marks, semester);
    
    std::cout << "\nReviewing calculated metrics:\n";
    std::cout << "  -> Awarded Grade:    " << newStudent.getGrade() << "\n";
    std::cout << "  -> Academic Standing:" << newStudent.getAcademicStanding() << "\n";

    if (m_repo->addStudent(newStudent)) {
        std::cout << "\n[SUCCESS] Student " << name << " (ID: " << id << ") successfully saved to "
                  << m_repo->getDatabaseType() << "!\n";
    } else {
        std::cerr << "\n[FAILURE] Failed to insert student record into database.\n";
    }
}

void Menu::handleDisplayAll() {
    std::cout << "\n===========================================================================================================\n";
    std::cout << "                                         ALL REGISTERED STUDENTS                                           \n";
    std::cout << "  [Backend: " << m_repo->getDatabaseType() << "]\n";
    std::cout << "===========================================================================================================\n";

    auto students = m_repo->getAllStudents();
    if (students.empty()) {
        std::cout << "No student records found in the database.\n";
        return;
    }

    std::cout << std::left
              << std::setw(8)  << "ID"
              << std::setw(22) << "Name"
              << std::setw(6)  << "Age"
              << std::setw(28) << "Email"
              << std::setw(22) << "Course"
              << std::setw(10) << "Marks"
              << std::setw(8)  << "Grade"
              << std::setw(6)  << "Sem"
              << "\n";
    std::cout << std::string(110, '-') << "\n";

    for (const auto& student : students) {
        auto ug = dynamic_cast<const UndergraduateStudent*>(student.get());
        int sem = ug ? ug->getSemester() : 1;

        std::cout << std::left
                  << std::setw(8)  << student->getId()
                  << std::setw(22) << (student->getName().length() > 20 ? student->getName().substr(0, 17) + "..." : student->getName())
                  << std::setw(6)  << student->getAge()
                  << std::setw(28) << (student->getEmail().length() > 26 ? student->getEmail().substr(0, 23) + "..." : student->getEmail())
                  << std::setw(22) << (student->getCourse().length() > 20 ? student->getCourse().substr(0, 17) + "..." : student->getCourse())
                  << std::fixed << std::setprecision(2)
                  << std::setw(10) << student->getMarks()
                  << std::setw(8)  << student->getGrade()
                  << std::setw(6)  << sem
                  << "\n";
    }
    std::cout << std::string(110, '=') << "\n";
    std::cout << "Total records in database: " << students.size() << "\n";
}

void Menu::handleSearchStudent() {
    std::cout << "\n==================================================\n";
    std::cout << "             SEARCH STUDENT BY ID                 \n";
    std::cout << "==================================================\n";

    int id = readInteger("Enter Student ID to search: ", 1, 999999999);
    auto student = m_repo->getStudentById(id);

    if (student) {
        std::cout << "\n[RECORD FOUND IN DATABASE (" << m_repo->getDatabaseType() << ")]\n";
        student->displayDetails();
    } else {
        std::cout << "\n[NOT FOUND] No student record matches ID " << id << ".\n";
    }
}

void Menu::handleUpdateStudent() {
    std::cout << "\n==================================================\n";
    std::cout << "              UPDATE STUDENT RECORD               \n";
    std::cout << "==================================================\n";

    int id = readInteger("Enter Student ID to update: ", 1, 999999999);
    auto existing = m_repo->getStudentById(id);
    if (!existing) {
        std::cout << "\n[NOT FOUND] Student with ID " << id << " does not exist in database.\n";
        return;
    }

    std::cout << "\nCurrent record details:\n";
    existing->displayDetails();

    std::cout << "\nEnter updated values (Press Enter to keep current value):\n";
    
    // Name
    std::cout << "Name [" << existing->getName() << "]: ";
    std::string nameInput;
    std::getline(std::cin, nameInput);
    std::string updatedName = nameInput.empty() ? existing->getName() : nameInput;

    // Age
    int updatedAge = existing->getAge();
    std::cout << "Age [" << existing->getAge() << "]: ";
    std::string ageInput;
    std::getline(std::cin, ageInput);
    if (!ageInput.empty()) {
        try {
            int parsed = std::stoi(ageInput);
            if (Student::isValidAge(parsed)) updatedAge = parsed;
        } catch (...) {}
    }

    // Email
    std::string updatedEmail = existing->getEmail();
    while (true) {
        std::cout << "Email [" << existing->getEmail() << "]: ";
        std::string emailInput;
        std::getline(std::cin, emailInput);
        if (emailInput.empty()) {
            break;
        }
        if (!Person::isValidEmail(emailInput)) {
            std::cout << "  [!] Invalid email format. Try again.\n";
            continue;
        }
        if (m_repo->emailExists(emailInput, id)) {
            std::cout << "  [!] Email already in use by another student. Try again.\n";
            continue;
        }
        updatedEmail = emailInput;
        break;
    }

    // Course
    std::cout << "Course [" << existing->getCourse() << "]: ";
    std::string courseInput;
    std::getline(std::cin, courseInput);
    std::string updatedCourse = courseInput.empty() ? existing->getCourse() : courseInput;

    // Marks
    double updatedMarks = existing->getMarks();
    std::cout << "Marks [" << existing->getMarks() << "]: ";
    std::string marksInput;
    std::getline(std::cin, marksInput);
    if (!marksInput.empty()) {
        try {
            double parsed = std::stod(marksInput);
            if (Student::isValidMarks(parsed)) updatedMarks = parsed;
        } catch (...) {}
    }

    // Semester
    auto ug = dynamic_cast<const UndergraduateStudent*>(existing.get());
    int currentSem = ug ? ug->getSemester() : 1;
    int updatedSem = currentSem;
    std::cout << "Semester [" << currentSem << "]: ";
    std::string semInput;
    std::getline(std::cin, semInput);
    if (!semInput.empty()) {
        try {
            int parsed = std::stoi(semInput);
            if (UndergraduateStudent::isValidSemester(parsed)) updatedSem = parsed;
        } catch (...) {}
    }

    UndergraduateStudent updatedStudent(id, updatedName, updatedEmail, updatedAge,
                                         updatedCourse, updatedMarks, updatedSem);

    if (m_repo->updateStudent(updatedStudent)) {
        std::cout << "\n[SUCCESS] Student ID " << id << " successfully updated in "
                  << m_repo->getDatabaseType() << "!\n";
    } else {
        std::cerr << "\n[FAILURE] Failed to update student record.\n";
    }
}

void Menu::handleDeleteStudent() {
    std::cout << "\n==================================================\n";
    std::cout << "              DELETE STUDENT RECORD               \n";
    std::cout << "==================================================\n";

    int id = readInteger("Enter Student ID to delete: ", 1, 999999999);
    auto student = m_repo->getStudentById(id);
    if (!student) {
        std::cout << "\n[NOT FOUND] Student with ID " << id << " does not exist in database.\n";
        return;
    }

    std::cout << "\nTarget Record:\n";
    student->displayDetails();

    if (confirmAction("\n[CAUTION] Are you sure you want to permanently delete this student?")) {
        if (m_repo->deleteStudent(id)) {
            std::cout << "[SUCCESS] Student ID " << id << " has been removed from "
                      << m_repo->getDatabaseType() << ".\n";
        } else {
            std::cerr << "[FAILURE] Failed to delete student from database.\n";
        }
    } else {
        std::cout << "[CANCELLED] Deletion aborted by user.\n";
    }
}

void Menu::handleSystemStatus() {
    std::cout << "\n==================================================\n";
    std::cout << "         SYSTEM DIAGNOSTICS & STATUS              \n";
    std::cout << "==================================================\n";
    bool online = m_repo->ping();
    std::cout << "Active Database:      " << m_repo->getDatabaseType() << "\n";
    std::cout << "Service Health:       " << (online ? "[ONLINE / HEALTHY]" : "[OFFLINE / UNREACHABLE]") << "\n";
    std::cout << "Supported Backends:   1. MySQL Server (Relational SQL - Port 3306)\n";
    std::cout << "                      2. MongoDB (NoSQL Document Store - Port 27017)\n";
    std::cout << "Architecture Pattern: Abstract Repository (IStudentRepository)\n";
    std::cout << "==================================================\n";
}

void Menu::handleSwitchDatabase() {
    std::cout << "\n==================================================\n";
    std::cout << "         SWITCH DATABASE PERSISTENCE BACKEND      \n";
    std::cout << "==================================================\n";
    if (m_switchDbCallback) {
        m_switchDbCallback();
        std::cout << "[SUCCESS] Active backend changed to: " << m_repo->getDatabaseType() << "\n";
    } else {
        std::cout << "[INFO] Database switching callback not configured.\n";
    }
}

void Menu::run() {
    int choice = -1;
    while (choice != 0) {
        std::cout << "\n";
        std::cout << "==================================================\n";
        std::cout << "    STUDENT MANAGEMENT SYSTEM (C++ OOP)           \n";
        std::cout << "  Active DB: " << m_repo->getDatabaseType() << "\n";
        std::cout << "==================================================\n";
        std::cout << "  1. Add New Student\n";
        std::cout << "  2. Display All Students\n";
        std::cout << "  3. Search Student by ID\n";
        std::cout << "  4. Update Student Details\n";
        std::cout << "  5. Delete Student Record\n";
        std::cout << "  6. System Diagnostics & DB Status\n";
        std::cout << "  7. Switch Database (MySQL <-> MongoDB)\n";
        std::cout << "  0. Exit\n";
        std::cout << "==================================================\n";

        choice = readInteger("Select an option [0-7]: ", 0, 7);

        switch (choice) {
            case 1: handleAddStudent(); break;
            case 2: handleDisplayAll(); break;
            case 3: handleSearchStudent(); break;
            case 4: handleUpdateStudent(); break;
            case 5: handleDeleteStudent(); break;
            case 6: handleSystemStatus(); break;
            case 7: handleSwitchDatabase(); break;
            case 0:
                std::cout << "\nThank you for using the Student Management System. Goodbye!\n";
                break;
            default:
                std::cout << "Invalid choice.\n";
                break;
        }
    }
}
