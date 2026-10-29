#ifndef PERSON_H
#define PERSON_H

#include <string>
#include <iostream>

/**
 * @brief Abstract Base Class representing a Person.
 * 
 * Demonstrates:
 * - Abstraction: Exposes high-level interface, defines pure virtual functions.
 * - Encapsulation: Protects member variables (protected access) with validated getters/setters.
 * - Polymorphism: Declares virtual destructor and pure virtual display methods.
 */
class Person {
protected:
    int m_id;
    std::string m_name;
    std::string m_email;

public:
    // Constructors
    Person();
    Person(int id, const std::string& name, const std::string& email);

    // Virtual Destructor (Crucial for safe polymorphic deletion)
    virtual ~Person() = default;

    // Getters
    int getId() const;
    std::string getName() const;
    std::string getEmail() const;

    // Setters with validation
    void setId(int id);
    void setName(const std::string& name);
    void setEmail(const std::string& email);

    // Pure Virtual Functions (Enforces Abstraction)
    virtual void displayDetails() const = 0;
    virtual std::string getRole() const = 0;

    // Static Validation Helper Methods
    static bool isValidEmail(const std::string& email);
    static bool isValidName(const std::string& name);
};

#endif // PERSON_H
