#include "Person.h"
#include <algorithm>
#include <cctype>
#include <stdexcept>
#include <regex>

Person::Person()
    : m_id(0), m_name(""), m_email("") {}

Person::Person(int id, const std::string& name, const std::string& email)
    : m_id(id), m_name(name), m_email(email) {
    if (id < 0) {
        throw std::invalid_argument("ID cannot be negative.");
    }
    if (!isValidName(name)) {
        throw std::invalid_argument("Invalid name provided.");
    }
    if (!isValidEmail(email)) {
        throw std::invalid_argument("Invalid email format provided.");
    }
}

int Person::getId() const {
    return m_id;
}

std::string Person::getName() const {
    return m_name;
}

std::string Person::getEmail() const {
    return m_email;
}

void Person::setId(int id) {
    if (id < 0) {
        throw std::invalid_argument("ID cannot be negative.");
    }
    m_id = id;
}

void Person::setName(const std::string& name) {
    if (!isValidName(name)) {
        throw std::invalid_argument("Name cannot be empty or contain invalid characters.");
    }
    m_name = name;
}

void Person::setEmail(const std::string& email) {
    if (!isValidEmail(email)) {
        throw std::invalid_argument("Invalid email format.");
    }
    m_email = email;
}

bool Person::isValidName(const std::string& name) {
    if (name.empty() || name.length() > 100) {
        return false;
    }
    // Must contain at least one alphabetic character
    bool hasAlpha = false;
    for (char ch : name) {
        if (std::isalpha(static_cast<unsigned char>(ch))) {
            hasAlpha = true;
        } else if (ch != ' ' && ch != '.' && ch != '-' && ch != '\'') {
            return false;
        }
    }
    return hasAlpha;
}

bool Person::isValidEmail(const std::string& email) {
    if (email.empty() || email.length() > 150) {
        return false;
    }
    // Standard email regex pattern
    const std::regex emailPattern(R"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)");
    return std::regex_match(email, emailPattern);
}
