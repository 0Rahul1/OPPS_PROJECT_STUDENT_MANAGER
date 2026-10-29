#ifndef STUDENT_H
#define STUDENT_H

#include "Person.h"
#include <iomanip>

/**
 * @brief Student class representing a student entity in the institution.
 * 
 * Demonstrates:
 * - Single Inheritance: Inherits identity and contact information from Person.
 * - Encapsulation: Protects academic metrics (age, course, marks, grade) behind validated setters.
 * - Polymorphic Override: Implements displayDetails() and getRole() from Person.
 */
class Student : public Person {
protected:
    int m_age;
    std::string m_course;
    double m_marks;
    char m_grade;

    // Helper method to compute letter grade based on marks
    void recalculateGrade();

public:
    // Constructors
    Student();
    Student(int id, const std::string& name, const std::string& email,
            int age, const std::string& course, double marks);

    // Virtual Destructor
    virtual ~Student() override = default;

    // Getters
    int getAge() const;
    std::string getCourse() const;
    double getMarks() const;
    char getGrade() const;

    // Setters with validation
    void setAge(int age);
    void setCourse(const std::string& course);
    void setMarks(double marks);

    // Grade calculation logic
    static char computeGradeFromMarks(double marks);

    // Polymorphic overrides from Person
    virtual void displayDetails() const override;
    virtual std::string getRole() const override;

    // Static Validation Helper Methods
    static bool isValidAge(int age);
    static bool isValidMarks(double marks);
    static bool isValidCourse(const std::string& course);
};

#endif // STUDENT_H
