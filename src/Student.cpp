#include "Student.h"
#include <stdexcept>
#include <iostream>
#include <iomanip>

Student::Student()
    : Person(), m_age(18), m_course("General Studies"), m_marks(0.0), m_grade('F') {}

Student::Student(int id, const std::string& name, const std::string& email,
                 int age, const std::string& course, double marks)
    : Person(id, name, email), m_age(age), m_course(course), m_marks(marks) {
    if (!isValidAge(age)) {
        throw std::invalid_argument("Age must be between 15 and 100.");
    }
    if (!isValidCourse(course)) {
        throw std::invalid_argument("Course cannot be empty or excessively long.");
    }
    if (!isValidMarks(marks)) {
        throw std::invalid_argument("Marks must be between 0.00 and 100.00.");
    }
    recalculateGrade();
}

int Student::getAge() const {
    return m_age;
}

std::string Student::getCourse() const {
    return m_course;
}

double Student::getMarks() const {
    return m_marks;
}

char Student::getGrade() const {
    return m_grade;
}

void Student::setAge(int age) {
    if (!isValidAge(age)) {
        throw std::invalid_argument("Age must be between 15 and 100.");
    }
    m_age = age;
}

void Student::setCourse(const std::string& course) {
    if (!isValidCourse(course)) {
        throw std::invalid_argument("Course cannot be empty or excessively long.");
    }
    m_course = course;
}

void Student::setMarks(double marks) {
    if (!isValidMarks(marks)) {
        throw std::invalid_argument("Marks must be between 0.00 and 100.00.");
    }
    m_marks = marks;
    recalculateGrade();
}

void Student::recalculateGrade() {
    m_grade = computeGradeFromMarks(m_marks);
}

char Student::computeGradeFromMarks(double marks) {
    if (marks >= 90.0) return 'A';
    if (marks >= 80.0) return 'B';
    if (marks >= 70.0) return 'C';
    if (marks >= 60.0) return 'D';
    return 'F';
}

void Student::displayDetails() const {
    std::cout << "--------------------------------------------------\n";
    std::cout << "Role:           " << getRole() << "\n";
    std::cout << "Student ID:     " << m_id << "\n";
    std::cout << "Name:           " << m_name << "\n";
    std::cout << "Age:            " << m_age << "\n";
    std::cout << "Email:          " << m_email << "\n";
    std::cout << "Course:         " << m_course << "\n";
    std::cout << std::fixed << std::setprecision(2);
    std::cout << "Marks:          " << m_marks << " / 100.00\n";
    std::cout << "Grade:          " << m_grade << "\n";
    std::cout << "--------------------------------------------------\n";
}

std::string Student::getRole() const {
    return "Student";
}

bool Student::isValidAge(int age) {
    return (age >= 15 && age <= 100);
}

bool Student::isValidMarks(double marks) {
    return (marks >= 0.0 && marks <= 100.0);
}

bool Student::isValidCourse(const std::string& course) {
    return (!course.empty() && course.length() <= 100);
}
