// ============================================================================
// Student Management System - MongoDB Database Initialization Script
// Database: student_management
// Collection: students
// Run using MongoDB Shell (mongosh): mongosh database/mongo_setup.js
// ============================================================================

// Switch to student_management database
const dbName = "student_management";
const db = db.getSiblingDB(dbName);

print(`[1/4] Configuring database: ${dbName}...`);

// Step 1: Drop existing collection if recreating
db.students.drop();

// Step 2: Create Collection with JSON Schema Validation
db.createCollection("students", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["student_id", "name", "email", "age", "course", "marks", "semester"],
            properties: {
                student_id: {
                    bsonType: ["int", "long"],
                    description: "must be an integer and is required"
                },
                name: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                email: {
                    bsonType: "string",
                    pattern: "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$",
                    description: "must be a valid email string and is required"
                },
                age: {
                    bsonType: "int",
                    minimum: 15,
                    maximum: 100,
                    description: "must be an integer between 15 and 100 and is required"
                },
                course: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                marks: {
                    bsonType: ["double", "int", "decimal"],
                    minimum: 0.0,
                    maximum: 100.0,
                    description: "must be a number between 0.00 and 100.00 and is required"
                },
                semester: {
                    bsonType: "int",
                    minimum: 1,
                    maximum: 8,
                    description: "must be an integer between 1 and 8 and is required"
                },
                grade: {
                    bsonType: "string",
                    description: "computed letter grade: A, B, C, D, or F"
                },
                academic_standing: {
                    bsonType: "string",
                    description: "academic status: Dean's List, Good Standing, or Probation"
                }
            }
        }
    }
});

print("[2/4] Creating unique indexes on student_id and email...");

// Step 3: Create Unique Indexes
db.students.createIndex({ student_id: 1 }, { unique: true, name: "uq_student_id" });
db.students.createIndex({ email: 1 }, { unique: true, name: "uq_student_email" });

print("[3/4] Inserting demo student documents...");

// Step 4: Insert Demo Documents
db.students.insertMany([
    {
        student_id: 201,
        name: "Ananya Sen",
        email: "ananya.sen@mongo.edu",
        age: NumberInt(20),
        course: "Data Science",
        marks: 95.00,
        semester: NumberInt(4),
        grade: "A",
        academic_standing: "Dean's List (Honors)",
        created_at: new Date()
    },
    {
        student_id: 202,
        name: "Karan Kapoor",
        email: "karan.k@mongo.edu",
        age: NumberInt(21),
        course: "Artificial Intelligence",
        marks: 84.50,
        semester: NumberInt(6),
        grade: "B",
        academic_standing: "Good Standing",
        created_at: new Date()
    },
    {
        student_id: 203,
        name: "Meera Nair",
        email: "meera.nair@mongo.edu",
        age: NumberInt(19),
        course: "Computer Engineering",
        marks: 72.00,
        semester: NumberInt(2),
        grade: "C",
        academic_standing: "Good Standing",
        created_at: new Date()
    },
    {
        student_id: 204,
        name: "Devansh Joshi",
        email: "devansh.j@mongo.edu",
        age: NumberInt(22),
        course: "Cyber Security",
        marks: 63.00,
        semester: NumberInt(8),
        grade: "D",
        academic_standing: "Good Standing",
        created_at: new Date()
    },
    {
        student_id: 205,
        name: "Ritika Roy",
        email: "ritika.roy@mongo.edu",
        age: NumberInt(20),
        course: "Cloud Computing",
        marks: 54.00,
        semester: NumberInt(4),
        grade: "F",
        academic_standing: "Academic Warning / Probation",
        created_at: new Date()
    }
]);

print("[4/4] Verification Query - All Registered Students in MongoDB:");
printjson(db.students.find({}, { _id: 0, student_id: 1, name: 1, course: 1, marks: 1, grade: 1 }).toArray());
print("\n[SUCCESS] MongoDB setup completed successfully!");
