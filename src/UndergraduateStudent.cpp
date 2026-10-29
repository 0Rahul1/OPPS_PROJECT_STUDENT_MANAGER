#include "UndergraduateStudent.h"
#include <iostream>
#include <iomanip>
#include <stdexcept>

UndergraduateStudent::UndergraduateStudent()
    : Student(), m_semester(1) {
    updateAcademicStanding();
}

UndergraduateStudent::UndergraduateStudent(int id, const std::string& name, const std::string& email,
                                           int age, const std::string& course, double marks, int semester)
    : Student(id, name, email, age, course, marks), m_semester(semester) {
    if (!isValidSemester(semester)) {
        throw std::invalid_argument("Semester must be between 1 and 8.");
    }
    updateAcademicStanding();
}

int UndergraduateStudent::getSemester() const {
    return m_semester;
}

void UndergraduateStudent::setSemester(int semester) {
    if (!isValidSemester(semester)) {
        throw std::invalid_argument("Semester must be between 1 and 8.");
    }
    m_semester = semester;
}

std::string UndergraduateStudent::getAcademicStanding() const {
    return m_academicStanding;
}

void UndergraduateStudent::updateAcademicStanding() {
    if (m_marks >= 90.0) {
        m_academicStanding = "Dean's List (Honors)";
    } else if (m_marks >= 60.0) {
        m_academicStanding = "Good Standing";
    } else {
        m_academicStanding = "Academic Warning / Probation";
    }
}

void UndergraduateStudent::displayDetails() const {
    std::cout << "==================================================\n";
    std::cout << "Classification: " << getRole() << "\n";
    std::cout << "Student ID:     " << m_id << "\n";
    std::cout << "Full Name:      " << m_name << "\n";
    std::cout << "Age:            " << m_age << " years\n";
    std::cout << "Email:          " << m_email << "\n";
    std::cout << "Degree Course:  " << m_course << "\n";
    std::cout << "Semester:       " << m_semester << " (Year " << ((m_semester + 1) / 2) << ")\n";
    std::cout << std::fixed << std::setprecision(2);
    std::cout << "Aggregate Marks:" << m_marks << "%\n";
    std::cout << "Awarded Grade:  " << m_grade << "\n";
    std::cout << "Academic Status:" << m_academicStanding << "\n";
    std::cout << "==================================================\n";
}

std::string UndergraduateStudent::getRole() const {
    return "Undergraduate Student (B.Tech / B.Sc / B.E.)";
}

bool UndergraduateStudent::isValidSemester(int semester) {
    return (semester >= 1 && semester <= 8);
}
