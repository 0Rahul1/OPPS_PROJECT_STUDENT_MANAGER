const fs = require('fs');
const path = require('path');
const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    Table,
    TableRow,
    TableCell,
    WidthType,
    AlignmentType,
    BorderStyle,
    HeadingLevel,
    Header,
    Footer,
    PageNumber,
    PageBreak,
    ShadingType
} = require('docx');

// Color Palette
const PRIMARY = "1E3A8A";    // Dark Blue
const SECONDARY = "2563EB";  // Blue
const TEXT_DARK = "0F172A";  // Slate 900
const TEXT_MUTED = "475569"; // Slate 600
const BG_LIGHT = "F8FAFC";   // Slate 50
const BORDER_COLOR = "CBD5E1"; // Slate 300
const ACCENT = "0D9488";     // Teal

const tableBorder = {
    top: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
    left: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
    right: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
    insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: BORDER_COLOR },
    insideVertical: { style: BorderStyle.SINGLE, size: 2, color: BORDER_COLOR }
};

const cellMargins = { top: 120, bottom: 120, left: 160, right: 160 };

function createHeading1(text) {
    return new Paragraph({
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 240, after: 120 },
        children: [
            new TextRun({
                text: text,
                bold: true,
                size: 26, // 13pt
                color: PRIMARY,
                font: "Calibri"
            })
        ]
    });
}

function createHeading2(text) {
    return new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 180, after: 80 },
        children: [
            new TextRun({
                text: text,
                bold: true,
                size: 22, // 11pt
                color: SECONDARY,
                font: "Calibri"
            })
        ]
    });
}

function createHeading3(text) {
    return new Paragraph({
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 120, after: 60 },
        children: [
            new TextRun({
                text: text,
                bold: true,
                size: 20, // 10pt
                color: TEXT_DARK,
                font: "Calibri"
            })
        ]
    });
}

function createBodyPara(text, options = {}) {
    return new Paragraph({
        alignment: options.alignment || AlignmentType.JUSTIFIED,
        spacing: { before: options.before || 60, after: options.after || 60, line: 276 }, // 1.15 line spacing
        children: [
            new TextRun({
                text: text,
                size: options.size || 20, // 10pt
                color: options.color || TEXT_DARK,
                font: "Calibri",
                bold: options.bold || false,
                italics: options.italics || false
            })
        ]
    });
}

function createBulletPara(title, desc) {
    return new Paragraph({
        bullet: { level: 0 },
        spacing: { before: 40, after: 40, line: 260 },
        children: [
            new TextRun({ text: title + ": ", bold: true, size: 20, font: "Calibri", color: PRIMARY }),
            new TextRun({ text: desc, size: 20, font: "Calibri", color: TEXT_DARK })
        ]
    });
}

function createCodeBlock(lines) {
    return lines.map(line => new Paragraph({
        spacing: { before: 20, after: 20 },
        shading: { fill: "F1F5F9" },
        children: [
            new TextRun({
                text: line,
                font: "Consolas",
                size: 17,
                color: "1E293B"
            })
        ]
    }));
}

function buildDocument() {
    const children = [];

    // ==========================================
    // PAGE 1: TITLE & COVER PAGE
    // ==========================================
    children.push(
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 60 },
            children: [
                new TextRun({ text: "[INSTITUTION NAME PLACEHOLDER]", bold: true, size: 30, color: PRIMARY, font: "Calibri" })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 40 },
            children: [
                new TextRun({ text: "DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING", bold: true, size: 22, color: SECONDARY, font: "Calibri" })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 20, after: 400 },
            children: [
                new TextRun({ text: "(Approved by AICTE, Affiliated to [UNIVERSITY NAME PLACEHOLDER])", italics: true, size: 18, color: TEXT_MUTED, font: "Calibri" })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 100 },
            children: [
                new TextRun({ text: "A MINI-PROJECT REPORT / PRACTICAL RECORD FILE ON", bold: true, size: 20, color: TEXT_MUTED, font: "Calibri" })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 80, after: 60 },
            children: [
                new TextRun({ text: "STUDENT MANAGEMENT SYSTEM", bold: true, size: 36, color: PRIMARY, font: "Calibri" })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 300 },
            children: [
                new TextRun({ text: "(Implementation in Modern C++17 with Polyglot MySQL & MongoDB Persistence)", bold: true, italics: true, size: 20, color: SECONDARY, font: "Calibri" })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 40 },
            children: [
                new TextRun({ text: "Course: ", bold: true, size: 20, font: "Calibri", color: PRIMARY }),
                new TextRun({ text: "Object-Oriented Programming & DBMS Laboratory", size: 20, font: "Calibri" })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 20, after: 40 },
            children: [
                new TextRun({ text: "Course Code: ", bold: true, size: 20, font: "Calibri", color: PRIMARY }),
                new TextRun({ text: "[COURSE_CODE_PLACEHOLDER - e.g., CS-402 / CS-301]", size: 20, font: "Calibri" })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 20, after: 400 },
            children: [
                new TextRun({ text: "Academic Session: ", bold: true, size: 20, font: "Calibri", color: PRIMARY }),
                new TextRun({ text: "2026 – 2027", bold: true, size: 20, font: "Calibri" })
            ]
        })
    );

    // Submission Table
    const coverTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: tableBorder,
        rows: [
            new TableRow({
                tableHeader: true,
                children: [
                    new TableCell({
                        shading: { fill: PRIMARY },
                        margins: cellMargins,
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        children: [new Paragraph({ children: [new TextRun({ text: "SUBMITTED BY:", bold: true, color: "FFFFFF", size: 20, font: "Calibri" })] })]
                    }),
                    new TableCell({
                        shading: { fill: PRIMARY },
                        margins: cellMargins,
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        children: [new Paragraph({ children: [new TextRun({ text: "UNDER THE SUPERVISION OF:", bold: true, color: "FFFFFF", size: 20, font: "Calibri" })] })]
                    })
                ]
            }),
            new TableRow({
                children: [
                    new TableCell({
                        margins: cellMargins,
                        children: [
                            new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: "Name: ", bold: true, size: 19 }), new TextRun({ text: "[STUDENT_NAME_PLACEHOLDER]", size: 19 })] }),
                            new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: "Roll No: ", bold: true, size: 19 }), new TextRun({ text: "[ROLL_NO_PLACEHOLDER]", size: 19 })] }),
                            new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: "Reg No: ", bold: true, size: 19 }), new TextRun({ text: "[REG_NO_PLACEHOLDER]", size: 19 })] }),
                            new Paragraph({ spacing: { after: 20 }, children: [new TextRun({ text: "Semester: ", bold: true, size: 19 }), new TextRun({ text: "[SEMESTER_BRANCH_PLACEHOLDER]", size: 19 })] })
                        ]
                    }),
                    new TableCell({
                        margins: cellMargins,
                        children: [
                            new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: "Guide: ", bold: true, size: 19 }), new TextRun({ text: "[FACULTY_NAME_PLACEHOLDER]", size: 19 })] }),
                            new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: "Designation: ", bold: true, size: 19 }), new TextRun({ text: "[DESIGNATION_PLACEHOLDER]", size: 19 })] }),
                            new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: "Department: ", bold: true, size: 19 }), new TextRun({ text: "Computer Science & Engineering", size: 19 })] }),
                            new Paragraph({ spacing: { after: 20 }, children: [new TextRun({ text: "Institution: ", bold: true, size: 19 }), new TextRun({ text: "[INSTITUTION_NAME_PLACEHOLDER]", size: 19 })] })
                        ]
                    })
                ]
            })
        ]
    });
    children.push(coverTable);

    children.push(
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 100 },
            children: [
                new TextRun({ text: "Month & Year of Submission: ", bold: true, size: 20, font: "Calibri", color: PRIMARY }),
                new TextRun({ text: "October 2026", size: 20, font: "Calibri" })
            ]
        }),
        new Paragraph({ children: [new PageBreak()] })
    );

    // ==========================================
    // PAGE 2: CERTIFICATES & ACKNOWLEDGEMENT
    // ==========================================
    children.push(
        createHeading1("CERTIFICATE OF ORIGINALITY"),
        createBodyPara(
            "This is to certify that the mini-project entitled \"Student Management System (C++ OOP + MySQL & MongoDB)\" submitted by [STUDENT_NAME_PLACEHOLDER], bearing University Roll Number [ROLL_NO_PLACEHOLDER], is an authentic record of academic project work carried out under my direct supervision in partial fulfillment of the academic requirements for the award of the degree in Computer Science & Engineering during the academic session 2026–2027."
        ),
        createBodyPara(
            "To the best of my knowledge, the project work has achieved the requisite standard of technical excellence and integrity, and has not been submitted elsewhere for the award of any other degree or diploma."
        ),
        new Paragraph({ spacing: { before: 200, after: 80 } }),
        new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
                insideHorizontal: { style: BorderStyle.NONE },
                insideVertical: { style: BorderStyle.NONE }
            },
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            width: { size: 50, type: WidthType.PERCENTAGE },
                            children: [
                                new Paragraph({ children: [new TextRun({ text: "____________________________________", bold: true })] }),
                                new Paragraph({ children: [new TextRun({ text: "Project Guide / Supervisor", bold: true, color: PRIMARY, size: 20 })] }),
                                new Paragraph({ children: [new TextRun({ text: "[FACULTY_NAME_PLACEHOLDER]", size: 19 })] }),
                                new Paragraph({ children: [new TextRun({ text: "Dept. of Computer Science & Eng.", size: 18, color: TEXT_MUTED })] })
                            ]
                        }),
                        new TableCell({
                            width: { size: 50, type: WidthType.PERCENTAGE },
                            children: [
                                new Paragraph({ children: [new TextRun({ text: "____________________________________", bold: true })] }),
                                new Paragraph({ children: [new TextRun({ text: "Head of Department (HOD)", bold: true, color: PRIMARY, size: 20 })] }),
                                new Paragraph({ children: [new TextRun({ text: "[HOD_NAME_PLACEHOLDER]", size: 19 })] }),
                                new Paragraph({ children: [new TextRun({ text: "Dept. of Computer Science & Eng.", size: 18, color: TEXT_MUTED })] })
                            ]
                        })
                    ]
                })
            ]
        }),
        new Paragraph({ spacing: { before: 180, after: 60 } }),
        new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
                insideHorizontal: { style: BorderStyle.NONE },
                insideVertical: { style: BorderStyle.NONE }
            },
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            width: { size: 60, type: WidthType.PERCENTAGE },
                            children: [
                                new Paragraph({ children: [new TextRun({ text: "____________________________________", bold: true })] }),
                                new Paragraph({ children: [new TextRun({ text: "External Examiner (Viva Voce)", bold: true, color: PRIMARY, size: 20 })] }),
                                new Paragraph({ children: [new TextRun({ text: "Date of Examination: ____ / ____ / 2026", size: 18, color: TEXT_MUTED })] })
                            ]
                        })
                    ]
                })
            ]
        }),
        createHeading1("ACKNOWLEDGEMENT"),
        createBodyPara(
            "I express my profound gratitude to my project supervisor, [FACULTY_NAME_PLACEHOLDER], for their invaluable mentorship, technical guidance, and constructive critiques throughout the conceptualization, system modeling, and development of this software system."
        ),
        createBodyPara(
            "I am deeply indebted to [HOD_NAME_PLACEHOLDER], Head of the Department of Computer Science & Engineering, and our respected Principal, [PRINCIPAL_NAME_PLACEHOLDER], for granting access to modern computing lab infrastructure, database clusters, and developmental resources."
        ),
        createBodyPara(
            "Finally, I extend my heartfelt appreciation to my family and colleagues for their constant encouragement and assistance during the completion of this practical project work."
        ),
        new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { before: 160, after: 40 },
            children: [
                new TextRun({ text: "[STUDENT_NAME_PLACEHOLDER]\n", bold: true, size: 20, color: PRIMARY }),
                new TextRun({ text: "University Roll No: [ROLL_NO_PLACEHOLDER]", size: 19, color: TEXT_MUTED })
            ]
        }),
        new Paragraph({ children: [new PageBreak()] })
    );

    // ==========================================
    // PAGE 3: ABSTRACT, PROBLEM STATEMENT & OBJECTIVES
    // ==========================================
    children.push(
        createHeading1("1. ABSTRACT & SYSTEM OVERVIEW"),
        createHeading2("1.1 Executive Abstract"),
        createBodyPara(
            "The Student Management System is an intermediate enterprise computing application engineered in Modern C++ (C++17) designed to administer, evaluate, and persist student academic records across two database paradigms: an ACID-compliant Relational Database (Oracle MySQL Server via port 3306) and a flexible Document-Oriented NoSQL Store (MongoDB via port 27017). The system deprecates volatile arrays and unstructured flat files by enforcing the Abstract Repository Design Pattern (IStudentRepository). The system enforces core Object-Oriented paradigms—including multilevel inheritance, encapsulation, and runtime polymorphism—delivering robust business logic, automated grade recalculation, and cross-platform management."
        ),
        createHeading2("1.2 Problem Statement"),
        createBodyPara("Traditional coursework student management programs suffer from critical design flaws:"),
        createBulletPara("Volatile Memory Loss", "In-memory arrays and STL vectors forfeit all added or modified records immediately upon program exit."),
        createBulletPara("Lack of Relational Constraints", "Plain text/CSV storage permits duplicate primary keys, corrupt email strings, and out-of-range student marks without verification."),
        createBulletPara("SQL Injection Vulnerabilities", "Direct string concatenation into SQL commands exposes institutional data to unauthorized manipulation."),
        createBulletPara("Terminal Stream Crashes", "Entering alphabetic input into numeric input streams (std::cin) results in fatal stream buffer failures and unrecoverable infinite loops."),
        createHeading2("1.3 Project Objectives"),
        createBulletPara("Decoupled 4-Tier Architecture", "Strictly separate UI Presentation, Business Logic Domain Entities, Repository Interfaces, and Data Storage."),
        createBulletPara("Dual Database Engine", "Support both enterprise MySQL Server and schema-validated MongoDB instances seamlessly."),
        createBulletPara("Prepared Statements", "Eliminate SQL injection risks entirely by binding all parameters through parameterized queries."),
        createBulletPara("Automated Evaluation", "Compute letter grades (A, B, C, D, F) and academic standings (Dean's List, Good Standing, Probation) dynamically from aggregate marks (0–100)."),
        createBulletPara("Polyglot DB Switching", "Enable switching the active storage engine between MySQL and MongoDB at runtime with zero changes to UI or client business logic."),
        new Paragraph({ children: [new PageBreak()] })
    );

    // ==========================================
    // PAGE 4: SRS & ARCHITECTURE DESIGN
    // ==========================================
    children.push(
        createHeading1("2. SYSTEM REQUIREMENTS SPECIFICATION (SRS) & ARCHITECTURE"),
        createHeading2("2.1 Hardware Requirements"),
        createBulletPara("Processor", "x86_64 Dual Core / Quad Core Intel Core i3 / AMD Ryzen 3 or higher."),
        createBulletPara("Memory (RAM)", "Minimum 4 GB (8 GB recommended for simultaneous local MySQL and MongoDB execution)."),
        createBulletPara("Storage", "Minimum 2 GB available storage space for C++ binaries, libraries, and database records."),
        createHeading2("2.2 Software Specifications"),
        createBulletPara("Operating System", "Microsoft Windows 10/11 (64-bit) or Linux (Ubuntu 22.04 LTS+)."),
        createBulletPara("Programming Standard", "Modern C++ (ISO/IEC C++17 Standard)."),
        createBulletPara("Compiler Toolchain", "MinGW-w64 GCC 16.2 / MSVC v143 (Visual Studio 2022)."),
        createBulletPara("Build System", "CMake 3.16+ / Make."),
        createBulletPara("Relational Database", "Oracle MySQL Community Server 8.0 / 8.4 LTS (TCP Port 3306)."),
        createBulletPara("NoSQL Database", "MongoDB Community Server 7.0+ (TCP Port 27017)."),
        createHeading2("2.3 Layered System Architecture"),
        createBodyPara(
            "The architecture strictly adheres to the Dependency Inversion Principle (DIP). The Presentation Layer interacts exclusively with the abstract interface IStudentRepository rather than low-level database classes."
        )
    );

    const archBox = [
        "+--------------------------------------------------------------------------------+",
        "|                               Presentation Layer                               |",
        "|        (Terminal Console UI: Menu.cpp & Web Dashboard: server.js Port 3000)    |",
        "+--------------------------------------------------------------------------------+",
        "                                         │                                        ",
        "                                         ▼                                        ",
        "+--------------------------------------------------------------------------------+",
        "|                       Domain Entity Layer (OOP Hierarchy)                      |",
        "|          Person (Abstract Base) ──► Student ──► UndergraduateStudent           |",
        "+--------------------------------------------------------------------------------+",
        "                                         │                                        ",
        "                                         ▼                                        ",
        "+--------------------------------------------------------------------------------+",
        "|                  Data Access Layer Interface (IStudentRepository)              |",
        "|              Pure Virtual Contracts: add, getById, getAll, update, delete      |",
        "+--------------------------------------------------------------------------------+",
        "                     │                                      │                     ",
        "                     ▼ (Implements)                         ▼ (Implements)        ",
        "+------------------------------------------+  +----------------------------------+",
        "|     StudentRepository (MySQL Backend)    |  |  MongoStudentRepository (MongoDB)|",
        "|   Prepared Statements, Port 3306, JDBC   |  |   BSON Documents, Port 27017     |",
        "+------------------------------------------+  +----------------------------------+",
        "                     │                                      │                     ",
        "                     ▼                                      ▼                     ",
        "+------------------------------------------+  +----------------------------------+",
        "|            MySQL Server Database         |  |         MongoDB Database         |",
        "|        (student_management.students)     |  |   (student_management.students)  |",
        "+------------------------------------------+  +----------------------------------+"
    ];
    children.push(...createCodeBlock(archBox));
    children.push(new Paragraph({ children: [new PageBreak()] }));

    // ==========================================
    // PAGE 5: OOP CONCEPTS DEMONSTRATED
    // ==========================================
    children.push(
        createHeading1("3. OBJECT-ORIENTED PROGRAMMING (OOP) IMPLEMENTATION"),
        createHeading2("3.1 Abstraction"),
        createBodyPara(
            "The system enforces abstraction via the abstract base class Person (src/Person.h). Public callers never interact with arbitrary raw buffers, but rather pure virtual method contracts:"
        )
    );
    children.push(...createCodeBlock([
        "class Person {",
        "public:",
        "    virtual void displayDetails() const = 0; // Pure virtual",
        "    virtual std::string getRole() const = 0; // Pure virtual",
        "    virtual ~Person() = default;             // Virtual destructor ensures leak-free cleanup",
        "};"
    ]));

    children.push(
        createHeading2("3.2 Encapsulation & Data Hiding"),
        createBodyPara(
            "All member variables are marked private or protected. State mutations occur exclusively via validated setters, preventing corrupt records from penetrating the system:"
        )
    );
    children.push(...createCodeBlock([
        "void Student::setAge(int age) {",
        "    if (age < 15 || age > 100) throw std::invalid_argument(\"Age must be 15-100\");",
        "    m_age = age;",
        "}",
        "void Student::setMarks(double marks) {",
        "    if (marks < 0.0 || marks > 100.0) throw std::out_of_range(\"Marks must be 0-100\");",
        "    m_marks = marks;",
        "    m_grade = computeGradeFromMarks(marks); // Automated recalculation",
        "}"
    ]));

    children.push(
        createHeading2("3.3 Multilevel Inheritance Hierarchy"),
        createBodyPara(
            "Attributes flow logically across a 3-tier hierarchy: Person encapsulates general identity (id, name, email); Student introduces academic metrics (age, course, marks, grade); UndergraduateStudent adds semester and degree honors."
        ),
        createHeading2("3.4 Runtime Polymorphism & Dynamic Dispatch"),
        createBodyPara(
            "Heterogeneous collections are processed through base pointers (std::unique_ptr<Student>). The C++ compiler dispatches member invocations through virtual method tables (vtables):"
        )
    );
    children.push(...createCodeBlock([
        "std::vector<std::unique_ptr<Student>> records = repo->getAllStudents();",
        "for (const auto& student : records) {",
        "    student->displayDetails(); // Dynamic dispatch routes to UndergraduateStudent at runtime",
        "}"
    ]));

    children.push(
        createHeading2("3.5 Dependency Inversion & SOLID Design"),
        createBodyPara(
            "The Presentation UI (Menu.cpp) references the pure virtual interface IStudentRepository& rather than concrete database classes. This allows hot-swapping between MySQL and MongoDB backends."
        ),
        new Paragraph({ children: [new PageBreak()] })
    );

    // ==========================================
    // PAGE 6: DATABASE DESIGN & SCHEMAS
    // ==========================================
    children.push(
        createHeading1("4. DATABASE DESIGN & RELATIONAL / NOSQL SCHEMAS"),
        createHeading2("4.1 Relational Schema (MySQL InnoDB)"),
        createBodyPara("Database: student_management | Table: students | Normalized to Third Normal Form (3NF)")
    );

    const dbTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: tableBorder,
        rows: [
            new TableRow({
                tableHeader: true,
                children: [
                    new TableCell({ shading: { fill: PRIMARY }, margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "Column Name", bold: true, color: "FFFFFF", size: 18 })] })] }),
                    new TableCell({ shading: { fill: PRIMARY }, margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "Data Type", bold: true, color: "FFFFFF", size: 18 })] })] }),
                    new TableCell({ shading: { fill: PRIMARY }, margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "Constraint / Key", bold: true, color: "FFFFFF", size: 18 })] })] }),
                    new TableCell({ shading: { fill: PRIMARY }, margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "Description", bold: true, color: "FFFFFF", size: 18 })] })] })
                ]
            }),
            new TableRow({
                children: [
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "student_id", bold: true, size: 17 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "INT", size: 17 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "PRIMARY KEY", bold: true, color: SECONDARY, size: 17 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "Unique Institutional Student ID", size: 17 })] })] })
                ]
            }),
            new TableRow({
                children: [
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "name", bold: true, size: 17 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "VARCHAR(100)", size: 17 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "NOT NULL", size: 17 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "Full legal candidate name", size: 17 })] })] })
                ]
            }),
            new TableRow({
                children: [
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "age", bold: true, size: 17 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "INT", size: 17 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "CHECK (15-100)", size: 17 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "Validated candidate age", size: 17 })] })] })
                ]
            }),
            new TableRow({
                children: [
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "course", bold: true, size: 17 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "VARCHAR(100)", size: 17 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "NOT NULL", size: 17 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "Enrolled degree program", size: 17 })] })] })
                ]
            }),
            new TableRow({
                children: [
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "email", bold: true, size: 17 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "VARCHAR(150)", size: 17 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "UNIQUE, NOT NULL", bold: true, color: SECONDARY, size: 17 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "Institutional email address", size: 17 })] })] })
                ]
            }),
            new TableRow({
                children: [
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "marks", bold: true, size: 17 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "DECIMAL(5,2)", size: 17 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "CHECK (0-100)", size: 17 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "Aggregate percentage", size: 17 })] })] })
                ]
            }),
            new TableRow({
                children: [
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "semester", bold: true, size: 17 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "INT", size: 17 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "CHECK (1-8)", size: 17 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "Current semester of study", size: 17 })] })] })
                ]
            }),
            new TableRow({
                children: [
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "created_at", bold: true, size: 17 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "TIMESTAMP", size: 17 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "DEFAULT CURRENT", size: 17 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "Record audit timestamp", size: 17 })] })] })
                ]
            })
        ]
    });
    children.push(dbTable);

    children.push(
        createHeading2("4.2 Document NoSQL Schema (MongoDB Collection)"),
        createBodyPara("Database: student_management | Collection: students | Enforced via $jsonSchema validator:")
    );
    children.push(...createCodeBlock([
        "{",
        "  $jsonSchema: {",
        "    bsonType: 'object',",
        "    required: ['student_id', 'name', 'email', 'age', 'course', 'marks', 'semester'],",
        "    properties: {",
        "      student_id: { bsonType: ['int', 'long'], description: 'Unique integer ID' },",
        "      email: { bsonType: 'string', pattern: '^.+@.+\\\\..+$' },",
        "      age: { bsonType: 'int', minimum: 15, maximum: 100 },",
        "      marks: { bsonType: ['double', 'int'], minimum: 0.0, maximum: 100.0 }",
        "    }",
        "  }",
        "}"
    ]));
    children.push(new Paragraph({ children: [new PageBreak()] }));

    // ==========================================
    // PAGE 7: CORE ALGORITHMS & SECURITY
    // ==========================================
    children.push(
        createHeading1("5. CORE ALGORITHMS & IMPLEMENTATION HIGHLIGHTS"),
        createHeading2("5.1 Automated Grade Calculation Algorithm"),
        createBodyPara(
            "Grade computation is executed deterministically by Student::computeGradeFromMarks(double marks). Standings are automatically derived without subjective instructor bias:"
        )
    );
    children.push(...createCodeBlock([
        "char Student::computeGradeFromMarks(double marks) {",
        "    if (marks >= 90.0) return 'A'; // Honors / Dean's List",
        "    if (marks >= 80.0) return 'B'; // Good Academic Standing",
        "    if (marks >= 70.0) return 'C'; // Satisfactory Standing",
        "    if (marks >= 60.0) return 'D'; // Conditional Pass",
        "    return 'F';                    // Academic Warning / Failure",
        "}"
    ]));

    children.push(
        createHeading2("5.2 Prepared Statements (SQL Injection Prevention)"),
        createBodyPara(
            "Direct string concatenations (e.g. \"WHERE id=\" + id) are strictly prohibited. Parameters are transmitted via protocol-level placeholders, preventing SQL injection exploits:"
        )
    );
    children.push(...createCodeBlock([
        "const std::string sql = \"INSERT INTO students (student_id, name, age, course, email, marks, semester) \"",
        "                        \"VALUES (?, ?, ?, ?, ?, ?, ?)\";",
        "std::unique_ptr<sql::PreparedStatement> pstmt(m_conn->prepareStatement(sql));",
        "pstmt->setInt(1, student.getId());",
        "pstmt->setString(2, student.getName());",
        "pstmt->setInt(3, student.getAge());",
        "pstmt->setString(4, student.getCourse());",
        "pstmt->setString(5, student.getEmail());",
        "pstmt->setDouble(6, student.getMarks());",
        "pstmt->setInt(7, student.getSemester());",
        "pstmt->executeUpdate();"
    ]));

    children.push(
        createHeading2("5.3 Stream Fault Recovery"),
        createBodyPara(
            "Console input streams are safeguarded against non-numeric token entry using cin fault detection, clearing stream fail bits and flushing residual tokens from the buffer:"
        )
    );
    children.push(...createCodeBlock([
        "if (std::cin.fail()) {",
        "    std::cin.clear(); // Reset cin error flag",
        "    std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\\n'); // Clear stream buffer",
        "    std::cout << \"[ERROR] Invalid numeric format. Please re-enter.\\n\";",
        "}"
    ]));
    children.push(new Paragraph({ children: [new PageBreak()] }));

    // ==========================================
    // PAGE 8: TEST MATRIX, LIMITATIONS & CONCLUSION
    // ==========================================
    children.push(
        createHeading1("6. VERIFICATION TEST CASES & CONCLUSION"),
        createHeading2("6.1 Formal Test Matrix (TC-01 to TC-08)")
    );

    const testTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: tableBorder,
        rows: [
            new TableRow({
                tableHeader: true,
                children: [
                    new TableCell({ shading: { fill: PRIMARY }, margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "Test ID", bold: true, color: "FFFFFF", size: 17 })] })] }),
                    new TableCell({ shading: { fill: PRIMARY }, margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "Scenario", bold: true, color: "FFFFFF", size: 17 })] })] }),
                    new TableCell({ shading: { fill: PRIMARY }, margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "Input Data", bold: true, color: "FFFFFF", size: 17 })] })] }),
                    new TableCell({ shading: { fill: PRIMARY }, margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "Expected Output", bold: true, color: "FFFFFF", size: 17 })] })] }),
                    new TableCell({ shading: { fill: PRIMARY }, margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "Status", bold: true, color: "FFFFFF", size: 17 })] })] })
                ]
            }),
            new TableRow({
                children: [
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "TC-01", bold: true, size: 16 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "Add Valid Student", size: 16 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "ID: 106, Marks: 92.5", size: 16 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "Persisted, Grade: A, Dean's List", size: 16 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "PASS", bold: true, color: ACCENT, size: 16 })] })] })
                ]
            }),
            new TableRow({
                children: [
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "TC-02", bold: true, size: 16 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "Duplicate Primary ID", size: 16 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "ID: 101 (Pre-existing)", size: 16 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "Duplicate PK caught; rejection alert", size: 16 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "PASS", bold: true, color: ACCENT, size: 16 })] })] })
                ]
            }),
            new TableRow({
                children: [
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "TC-03", bold: true, size: 16 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "Duplicate Email", size: 16 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "aarav.sharma@example.edu", size: 16 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "Unique constraint caught; rejected", size: 16 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "PASS", bold: true, color: ACCENT, size: 16 })] })] })
                ]
            }),
            new TableRow({
                children: [
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "TC-04", bold: true, size: 16 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "Out of Bounds Age", size: 16 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "Age: 12 or 140", size: 16 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "Validation fails (15-100 range)", size: 16 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "PASS", bold: true, color: ACCENT, size: 16 })] })] })
                ]
            }),
            new TableRow({
                children: [
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "TC-05", bold: true, size: 16 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "Stream Fault Entry", size: 16 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "ID: 'xyz' (Alphabet)", size: 16 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "cin buffer purged; program stable", size: 16 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "PASS", bold: true, color: ACCENT, size: 16 })] })] })
                ]
            }),
            new TableRow({
                children: [
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "TC-06", bold: true, size: 16 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "Search by ID", size: 16 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "Search ID: 101", size: 16 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "Displays polymorphic student details", size: 16 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "PASS", bold: true, color: ACCENT, size: 16 })] })] })
                ]
            }),
            new TableRow({
                children: [
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "TC-07", bold: true, size: 16 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "Recalculate Grade", size: 16 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "ID: 105, Marks: 52 -> 82", size: 16 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "Grade updates 'F' -> 'B' in DB", size: 16 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "PASS", bold: true, color: ACCENT, size: 16 })] })] })
                ]
            }),
            new TableRow({
                children: [
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "TC-08", bold: true, size: 16 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "Polyglot DB Switch", size: 16 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "Option 7 in Menu UI", size: 16 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "Swaps active DB MySQL <-> MongoDB", size: 16 })] })] }),
                    new TableCell({ margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "PASS", bold: true, color: ACCENT, size: 16 })] })] })
                ]
            })
        ]
    });
    children.push(testTable);

    children.push(
        createHeading2("6.2 Known Limitations"),
        createBodyPara("1. Single institutional tenant without partitioned multi-campus schemas."),
        createBodyPara("2. Password hashing and encryption for administrative users is left as future work."),
        createHeading2("6.3 Future Scope & Roadmaps"),
        createBodyPara("1. Biometric & Smart Attendance: Integrate NFC/Biometric sensors with database logs."),
        createBodyPara("2. PDF Mark Sheet Export: Automated generation of verifiable official semester grade cards."),
        createBodyPara("3. Cloud Microservices: Containerize into Docker and deploy on AWS RDS and MongoDB Atlas."),
        createHeading2("6.4 Conclusion"),
        createBodyPara(
            "The Student Management System successfully demonstrates the union of Object-Oriented C++ design patterns with production Relational (MySQL) and Document (MongoDB) databases. By enforcing compiled prepared statements, encapsulation, and runtime polymorphism, the software satisfies all academic and enterprise software engineering benchmarks."
        ),
        new Paragraph({ spacing: { before: 180, after: 60 } }),
        new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
                insideHorizontal: { style: BorderStyle.NONE },
                insideVertical: { style: BorderStyle.NONE }
            },
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            width: { size: 50, type: WidthType.PERCENTAGE },
                            children: [
                                new Paragraph({ children: [new TextRun({ text: "____________________________________", bold: true })] }),
                                new Paragraph({ children: [new TextRun({ text: "Student Signature", bold: true, size: 19, color: PRIMARY })] }),
                                new Paragraph({ children: [new TextRun({ text: "Date: ____ / ____ / 2026", size: 17, color: TEXT_MUTED })] })
                            ]
                        }),
                        new TableCell({
                            width: { size: 50, type: WidthType.PERCENTAGE },
                            children: [
                                new Paragraph({ children: [new TextRun({ text: "____________________________________", bold: true })] }),
                                new Paragraph({ children: [new TextRun({ text: "Project Guide / Supervisor", bold: true, size: 19, color: PRIMARY })] }),
                                new Paragraph({ children: [new TextRun({ text: "Date: ____ / ____ / 2026", size: 17, color: TEXT_MUTED })] })
                            ]
                        })
                    ]
                })
            ]
        })
    );

    // ==========================================
    // DOCUMENT CONFIGURATION
    // ==========================================
    const doc = new Document({
        styles: {
            default: {
                document: {
                    run: {
                        font: "Calibri",
                        color: TEXT_DARK,
                        size: 20
                    }
                }
            }
        },
        sections: [{
            properties: {
                page: {
                    margin: {
                        top: 1000,
                        bottom: 1000,
                        left: 1200,
                        right: 1200
                    }
                }
            },
            headers: {
                default: new Header({
                    children: [
                        new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            children: [
                                new TextRun({
                                    text: "STUDENT MANAGEMENT SYSTEM  |  ACADEMIC PROJECT FILE",
                                    font: "Calibri",
                                    size: 16,
                                    color: "94A3B8"
                                })
                            ]
                        })
                    ]
                })
            },
            footers: {
                default: new Footer({
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: "Academic Session 2026-2027  |  Department of Computer Science & Engineering          Page ",
                                    font: "Calibri",
                                    size: 16,
                                    color: "94A3B8"
                                }),
                                new TextRun({
                                    children: [PageNumber.CURRENT],
                                    font: "Calibri",
                                    size: 16,
                                    color: "94A3B8"
                                }),
                                new TextRun({
                                    text: " of ",
                                    font: "Calibri",
                                    size: 16,
                                    color: "94A3B8"
                                }),
                                new TextRun({
                                    children: [PageNumber.TOTAL_PAGES],
                                    font: "Calibri",
                                    size: 16,
                                    color: "94A3B8"
                                })
                            ]
                        })
                    ]
                })
            },
            children: children
        }]
    });

    return doc;
}

const doc = buildDocument();
const outputPath = path.join(__dirname, 'docs', 'PROJECT_FILE.docx');

Packer.toBuffer(doc).then(buffer => {
    fs.writeFileSync(outputPath, buffer);
    console.log('SUCCESS: Word document created at:', outputPath, 'Size:', buffer.length, 'bytes');
}).catch(err => {
    console.error('ERROR generating Word document:', err);
    process.exit(1);
});
