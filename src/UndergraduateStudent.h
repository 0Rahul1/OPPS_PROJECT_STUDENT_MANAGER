#ifndef UNDERGRADUATE_STUDENT_H
#define UNDERGRADUATE_STUDENT_H

#include "Student.h"

/**
 * @brief Specialized Student class representing an Undergraduate student.
 * 
 * Demonstrates:
 * - Multilevel Inheritance: Person -> Student -> UndergraduateStudent.
 * - Runtime Polymorphism: Overrides displayDetails() and getRole() with specific academic standing.
 * - Specialization: Adds semester progression and academic standing calculation.
 */
class UndergraduateStudent : public Student {
private:
    int m_semester;
    std::string m_academicStanding;

    void updateAcademicStanding();

public:
    // Constructors
    UndergraduateStudent();
    UndergraduateStudent(int id, const std::string& name, const std::string& email,
                         int age, const std::string& course, double marks, int semester = 1);

    // Virtual Destructor
    virtual ~UndergraduateStudent() override = default;

    // Getters and Setters
    int getSemester() const;
    void setSemester(int semester);
    std::string getAcademicStanding() const;

    // Polymorphic overrides
    virtual void displayDetails() const override;
    virtual std::string getRole() const override;

    // Validation helper
    static bool isValidSemester(int semester);
};

#endif // UNDERGRADUATE_STUDENT_H
