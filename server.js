// ============================================================================
// Student Management System - Live Interactive Portal & Console Emulator
// Pure Node.js (Zero external npm dependencies required)
// ============================================================================

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'database', 'live_students.json');

// Initial demo dataset matching database/schema.sql and database/mongo_setup.js
const INITIAL_STUDENTS = [
    {
        id: 101,
        name: "Aarav Sharma",
        age: 20,
        email: "aarav.sharma@example.edu",
        course: "Computer Science",
        marks: 94.50,
        semester: 4,
        grade: "A",
        academicStanding: "Dean's List (Honors)",
        dbSource: "MySQL (Port 3306)"
    },
    {
        id: 102,
        name: "Diya Patel",
        age: 19,
        email: "diya.patel@example.edu",
        course: "Information Technology",
        marks: 86.00,
        semester: 2,
        grade: "B",
        academicStanding: "Good Standing",
        dbSource: "MySQL (Port 3306)"
    },
    {
        id: 103,
        name: "Rohan Verma",
        age: 21,
        email: "rohan.verma@example.edu",
        course: "Electronics Engineering",
        marks: 74.25,
        semester: 6,
        grade: "C",
        academicStanding: "Good Standing",
        dbSource: "MySQL (Port 3306)"
    },
    {
        id: 104,
        name: "Sneha Mukherjee",
        age: 20,
        email: "sneha.m@example.edu",
        course: "Computer Science",
        marks: 65.50,
        semester: 4,
        grade: "D",
        academicStanding: "Good Standing",
        dbSource: "MySQL (Port 3306)"
    },
    {
        id: 105,
        name: "Vikram Malhotra",
        age: 22,
        email: "vikram.m@example.edu",
        course: "Mechanical Engineering",
        marks: 52.00,
        semester: 8,
        grade: "F",
        academicStanding: "Academic Warning / Probation",
        dbSource: "MySQL (Port 3306)"
    }
];

let activeDatabase = "MySQL (Relational SQL - Port 3306)";

function loadStudents() {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            saveStudents(INITIAL_STUDENTS);
            return INITIAL_STUDENTS;
        }
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return INITIAL_STUDENTS;
    }
}

function saveStudents(students) {
    try {
        const dir = path.dirname(DATA_FILE);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(DATA_FILE, JSON.stringify(students, null, 2), 'utf8');
    } catch (err) {
        console.error("Failed to save data file:", err);
    }
}

function computeGrade(marks) {
    if (marks >= 90.0) return 'A';
    if (marks >= 80.0) return 'B';
    if (marks >= 70.0) return 'C';
    if (marks >= 60.0) return 'D';
    return 'F';
}

function computeStanding(marks) {
    if (marks >= 90.0) return "Dean's List (Honors)";
    if (marks >= 60.0) return "Good Standing";
    return "Academic Warning / Probation";
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // CORS & JSON Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // 1. Static HTML Dashboard / Terminal App
    if (pathname === '/' || pathname === '/index.html') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(renderHtml());
        return;
    }

    // 2. API: GET /api/status
    if (pathname === '/api/status' && req.method === 'GET') {
        const students = loadStudents();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: "ONLINE",
            activeDatabase: activeDatabase,
            totalStudents: students.length,
            supportedDatabases: ["MySQL (Port 3306)", "MongoDB (Port 27017)"],
            architecture: "IStudentRepository (Abstract Repository Pattern)"
        }));
        return;
    }

    // 3. API: POST /api/switch-db
    if (pathname === '/api/switch-db' && req.method === 'POST') {
        activeDatabase = activeDatabase.includes("MySQL") 
            ? "MongoDB (NoSQL Document Store - Port 27017)"
            : "MySQL (Relational SQL - Port 3306)";
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ activeDatabase }));
        return;
    }

    // 4. API: GET /api/students
    if (pathname === '/api/students' && req.method === 'GET') {
        const students = loadStudents();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(students));
        return;
    }

    // 5. API: POST /api/students (Add Student)
    if (pathname === '/api/students' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const payload = JSON.parse(body);
                const students = loadStudents();

                const id = parseInt(payload.id);
                const age = parseInt(payload.age);
                const marks = parseFloat(payload.marks);
                const semester = parseInt(payload.semester);
                const name = (payload.name || "").trim();
                const email = (payload.email || "").trim();
                const course = (payload.course || "").trim();

                // Validation
                if (!id || id <= 0) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: "Student ID must be a positive integer." }));
                }
                if (students.some(s => s.id === id)) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: `Student ID ${id} already exists in ${activeDatabase}.` }));
                }
                if (students.some(s => s.email.toLowerCase() === email.toLowerCase())) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: `Email '${email}' is already registered.` }));
                }
                if (isNaN(age) || age < 15 || age > 100) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: "Age must be between 15 and 100." }));
                }
                if (isNaN(marks) || marks < 0 || marks > 100) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: "Marks must be between 0.00 and 100.00." }));
                }

                const newStudent = {
                    id,
                    name,
                    age,
                    email,
                    course,
                    marks,
                    semester: semester || 1,
                    grade: computeGrade(marks),
                    academicStanding: computeStanding(marks),
                    dbSource: activeDatabase
                };

                students.push(newStudent);
                students.sort((a, b) => a.id - b.id);
                saveStudents(students);

                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newStudent));
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "Invalid JSON payload." }));
            }
        });
        return;
    }

    // 6. API: PUT /api/students/:id (Update)
    if (pathname.startsWith('/api/students/') && req.method === 'PUT') {
        const id = parseInt(pathname.split('/')[3]);
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const payload = JSON.parse(body);
                const students = loadStudents();
                const index = students.findIndex(s => s.id === id);

                if (index === -1) {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: `Student ID ${id} not found.` }));
                }

                const email = payload.email ? payload.email.trim() : students[index].email;
                if (students.some(s => s.id !== id && s.email.toLowerCase() === email.toLowerCase())) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: `Email '${email}' is already in use by another student.` }));
                }

                const marks = payload.marks !== undefined ? parseFloat(payload.marks) : students[index].marks;

                students[index] = {
                    ...students[index],
                    name: payload.name ? payload.name.trim() : students[index].name,
                    age: payload.age ? parseInt(payload.age) : students[index].age,
                    email: email,
                    course: payload.course ? payload.course.trim() : students[index].course,
                    marks: marks,
                    semester: payload.semester ? parseInt(payload.semester) : students[index].semester,
                    grade: computeGrade(marks),
                    academicStanding: computeStanding(marks),
                    dbSource: activeDatabase
                };

                saveStudents(students);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(students[index]));
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "Invalid payload." }));
            }
        });
        return;
    }

    // 7. API: DELETE /api/students/:id (Delete)
    if (pathname.startsWith('/api/students/') && req.method === 'DELETE') {
        const id = parseInt(pathname.split('/')[3]);
        let students = loadStudents();
        const index = students.findIndex(s => s.id === id);

        if (index === -1) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: `Student ID ${id} not found.` }));
        }

        const removed = students.splice(index, 1);
        saveStudents(students);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, removed: removed[0] }));
        return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
});

function renderHtml() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Management System | Live Academic Portal</title>
    <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-base: #0f172a;
            --bg-card: #1e293b;
            --bg-terminal: #020617;
            --text-primary: #f8fafc;
            --text-muted: #94a3b8;
            --accent-cyan: #38bdf8;
            --accent-green: #4ade80;
            --accent-amber: #fbbf24;
            --accent-rose: #f43f5e;
            --accent-purple: #c084fc;
            --border: #334155;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background-color: var(--bg-base);
            color: var(--text-primary);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }

        header {
            background-color: rgba(30, 41, 59, 0.8);
            backdrop-filter: blur(8px);
            border-bottom: 1px solid var(--border);
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            z-index: 50;
        }

        .brand {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        .brand-badge {
            background: linear-gradient(135deg, #38bdf8, #818cf8);
            color: #0f172a;
            font-weight: 700;
            font-size: 0.85rem;
            padding: 0.25rem 0.6rem;
            border-radius: 6px;
        }
        .brand h1 {
            font-size: 1.25rem;
            font-weight: 700;
            letter-spacing: -0.02em;
        }

        .db-status-bar {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        .badge-live {
            display: inline-flex;
            align-items: center;
            gap: 0.4rem;
            background-color: rgba(74, 222, 128, 0.15);
            color: var(--accent-green);
            padding: 0.35rem 0.8rem;
            border-radius: 9999px;
            font-size: 0.85rem;
            font-weight: 600;
            border: 1px solid rgba(74, 222, 128, 0.3);
        }
        .pulse-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: var(--accent-green);
            box-shadow: 0 0 10px var(--accent-green);
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.4; transform: scale(0.85); }
        }

        .btn {
            background-color: var(--accent-cyan);
            color: #0f172a;
            font-weight: 600;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 0.9rem;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }
        .btn:hover {
            filter: brightness(1.1);
            transform: translateY(-1px);
        }
        .btn-purple {
            background: linear-gradient(135deg, #a855f7, #6366f1);
            color: white;
        }
        .btn-outline {
            background-color: transparent;
            border: 1px solid var(--border);
            color: var(--text-primary);
        }
        .btn-outline:hover {
            background-color: var(--border);
        }

        main {
            flex: 1;
            padding: 2rem;
            max-width: 1400px;
            margin: 0 auto;
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 1.25rem;
        }
        .stat-card {
            background-color: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 1.25rem;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
        .stat-label {
            font-size: 0.85rem;
            color: var(--text-muted);
            text-transform: uppercase;
            font-weight: 600;
            letter-spacing: 0.05em;
        }
        .stat-val {
            font-size: 1.75rem;
            font-weight: 700;
            color: var(--text-primary);
        }

        .tabs-header {
            display: flex;
            gap: 0.5rem;
            border-bottom: 1px solid var(--border);
            padding-bottom: 0.5rem;
        }
        .tab-btn {
            background: none;
            border: none;
            color: var(--text-muted);
            font-size: 1rem;
            font-weight: 600;
            padding: 0.6rem 1.2rem;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .tab-btn.active {
            background-color: var(--border);
            color: var(--accent-cyan);
        }

        .tab-content {
            display: none;
        }
        .tab-content.active {
            display: block;
        }

        .panel {
            background-color: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: 12px;
            overflow: hidden;
        }
        .panel-header {
            padding: 1.25rem;
            border-bottom: 1px solid var(--border);
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 1rem;
        }
        .search-box {
            background-color: var(--bg-base);
            border: 1px solid var(--border);
            color: var(--text-primary);
            padding: 0.5rem 1rem;
            border-radius: 8px;
            font-size: 0.9rem;
            width: 280px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
        }
        th, td {
            padding: 1rem 1.25rem;
            border-bottom: 1px solid var(--border);
        }
        th {
            background-color: rgba(15, 23, 42, 0.6);
            color: var(--text-muted);
            font-weight: 600;
            font-size: 0.85rem;
            text-transform: uppercase;
        }
        tbody tr:hover {
            background-color: rgba(56, 189, 248, 0.05);
        }

        .badge-grade {
            display: inline-block;
            font-weight: 700;
            padding: 0.2rem 0.55rem;
            border-radius: 6px;
            font-size: 0.85rem;
        }
        .grade-A { background-color: rgba(74, 222, 128, 0.2); color: var(--accent-green); }
        .grade-B { background-color: rgba(56, 189, 248, 0.2); color: var(--accent-cyan); }
        .grade-C { background-color: rgba(251, 191, 36, 0.2); color: var(--accent-amber); }
        .grade-D { background-color: rgba(192, 132, 252, 0.2); color: var(--accent-purple); }
        .grade-F { background-color: rgba(244, 63, 94, 0.2); color: var(--accent-rose); }

        /* Terminal Emulator View */
        .terminal-container {
            background-color: var(--bg-terminal);
            border: 1px solid #1e293b;
            border-radius: 12px;
            padding: 1.5rem;
            font-family: 'Fira Code', monospace;
            color: #38bdf8;
            box-shadow: inset 0 0 20px rgba(0,0,0,0.8);
            min-height: 480px;
            display: flex;
            flex-direction: column;
        }
        .terminal-output {
            flex: 1;
            white-space: pre-wrap;
            line-height: 1.5;
            overflow-y: auto;
            max-height: 500px;
            color: #cbd5e1;
        }
        .terminal-prompt {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-top: 1rem;
            border-top: 1px solid #1e293b;
            padding-top: 1rem;
        }
        .terminal-input {
            background: transparent;
            border: none;
            color: #38bdf8;
            font-family: 'Fira Code', monospace;
            font-size: 1rem;
            flex: 1;
            outline: none;
        }

        /* Modal */
        .modal-overlay {
            position: fixed;
            inset: 0;
            background-color: rgba(0,0,0,0.7);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 100;
            padding: 1rem;
        }
        .modal {
            background-color: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: 12px;
            width: 100%;
            max-width: 540px;
            padding: 2rem;
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
        }
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }
        .form-group {
            display: flex;
            flex-direction: column;
            gap: 0.4rem;
        }
        .form-group label {
            font-size: 0.85rem;
            color: var(--text-muted);
            font-weight: 500;
        }
        .form-control {
            background-color: var(--bg-base);
            border: 1px solid var(--border);
            color: var(--text-primary);
            padding: 0.6rem 0.8rem;
            border-radius: 6px;
            font-size: 0.95rem;
            outline: none;
        }
        .form-control:focus {
            border-color: var(--accent-cyan);
        }
        .modal-actions {
            display: flex;
            justify-content: flex-end;
            gap: 0.75rem;
            margin-top: 1rem;
        }
    </style>
</head>
<body>

    <header>
        <div class="brand">
            <span class="brand-badge">C++ OOP & Polyglot DB</span>
            <h1>Student Management System</h1>
        </div>
        <div class="db-status-bar">
            <div class="badge-live">
                <span class="pulse-dot"></span>
                <span id="activeDbLabel">MySQL (Port 3306)</span>
            </div>
            <button class="btn btn-purple" onclick="switchDatabase()">🔄 Switch to MongoDB</button>
        </div>
    </header>

    <main>
        <!-- Statistics Grid -->
        <div class="stats-grid">
            <div class="stat-card">
                <span class="stat-label">Total Registered</span>
                <span class="stat-val" id="statTotal">5</span>
            </div>
            <div class="stat-card">
                <span class="stat-label">Average Marks</span>
                <span class="stat-val" id="statAvg">74.45%</span>
            </div>
            <div class="stat-card">
                <span class="stat-label">Dean's List / Honors</span>
                <span class="stat-val" id="statHonors">1</span>
            </div>
            <div class="stat-card">
                <span class="stat-label">Active Architecture</span>
                <span class="stat-val" style="font-size: 1.1rem; color: var(--accent-cyan);">IStudentRepository</span>
            </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="tabs-header">
            <button class="tab-btn active" onclick="setTab('dashboard')">📊 Graphical Dashboard</button>
            <button class="tab-btn" onclick="setTab('terminal')">💻 Terminal Console Emulator</button>
        </div>

        <!-- Tab 1: Graphical Dashboard -->
        <div id="tab-dashboard" class="tab-content active">
            <div class="panel">
                <div class="panel-header">
                    <div>
                        <h2 style="font-size: 1.1rem;">Registered Student Records</h2>
                        <p style="font-size: 0.85rem; color: var(--text-muted);">Real-time persistence backed by active database repository</p>
                    </div>
                    <div style="display: flex; gap: 0.75rem;">
                        <input type="text" class="search-box" id="searchInput" placeholder="Search by name, ID or course..." oninput="filterTable()">
                        <button class="btn" onclick="openAddModal()">➕ Add Student</button>
                    </div>
                </div>
                <div style="overflow-x: auto;">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Full Name</th>
                                <th>Age</th>
                                <th>Email</th>
                                <th>Course</th>
                                <th>Semester</th>
                                <th>Marks</th>
                                <th>Grade</th>
                                <th>Academic Standing</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="studentTableBody">
                            <!-- Populated dynamically via JS -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Tab 2: Terminal Console View -->
        <div id="tab-terminal" class="tab-content">
            <div class="terminal-container">
                <div class="terminal-output" id="terminalOutput">===============================================================
         ACADEMIC STUDENT MANAGEMENT SYSTEM (C++ OOP)          
          Polyglot Architecture: MySQL &amp; MongoDB             
===============================================================

[STEP 1/2] Initializing IStudentRepository interface...
[STEP 2/2] Active Persistence Engine: MySQL (Port 3306)

==================================================
    STUDENT MANAGEMENT SYSTEM (C++ OOP)           
  Active DB: MySQL (Port 3306)
==================================================
  1. Add New Student
  2. Display All Students
  3. Search Student by ID
  4. Update Student Details
  5. Delete Student Record
  6. System Diagnostics &amp; DB Status
  7. Switch Database (MySQL &lt;-&gt; MongoDB)
  0. Exit
==================================================
Type an option number (1-7) below and press Enter:
</div>
                <div class="terminal-prompt">
                    <span style="color: var(--accent-green); font-weight: 600;">student_mgmt&gt;</span>
                    <input type="text" class="terminal-input" id="terminalInput" placeholder="Enter option 1-7 (e.g. 2 to display all)..." onkeydown="handleTerminalCommand(event)">
                </div>
            </div>
        </div>
    </main>

    <!-- Modal for Add / Edit -->
    <div class="modal-overlay" id="studentModal">
        <div class="modal">
            <h2 id="modalTitle" style="font-size: 1.25rem;">Add New Student</h2>
            <form id="studentForm" onsubmit="handleFormSubmit(event)">
                <div class="form-row">
                    <div class="form-group">
                        <label>Student ID *</label>
                        <input type="number" class="form-control" id="formId" required min="1">
                    </div>
                    <div class="form-group">
                        <label>Full Name *</label>
                        <input type="text" class="form-control" id="formName" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Email Address *</label>
                        <input type="email" class="form-control" id="formEmail" required>
                    </div>
                    <div class="form-group">
                        <label>Age (15 - 100) *</label>
                        <input type="number" class="form-control" id="formAge" min="15" max="100" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Course / Program *</label>
                        <input type="text" class="form-control" id="formCourse" required>
                    </div>
                    <div class="form-group">
                        <label>Semester (1 - 8) *</label>
                        <input type="number" class="form-control" id="formSemester" min="1" max="8" value="1" required>
                    </div>
                </div>
                <div class="form-group">
                    <label>Aggregate Marks (0.00 - 100.00) *</label>
                    <input type="number" step="0.01" class="form-control" id="formMarks" min="0" max="100" required oninput="previewGrade()">
                </div>
                <div id="gradePreview" style="font-size: 0.85rem; color: var(--accent-cyan);">
                    Grade: - | Standing: -
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button>
                    <button type="submit" class="btn">Save Record</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        let studentsData = [];
        let isEditMode = false;

        async function fetchStudents() {
            try {
                const res = await fetch('/api/students');
                studentsData = await res.json();
                renderTable(studentsData);
                updateStats(studentsData);
            } catch (err) {
                console.error("Failed to load students:", err);
            }
        }

        async function fetchStatus() {
            try {
                const res = await fetch('/api/status');
                const data = await res.json();
                document.getElementById('activeDbLabel').innerText = data.activeDatabase;
            } catch (err) {}
        }

        async function switchDatabase() {
            try {
                const res = await fetch('/api/switch-db', { method: 'POST' });
                const data = await res.json();
                document.getElementById('activeDbLabel').innerText = data.activeDatabase;
                appendTerminal('\\n[SYSTEM] Switched active repository to ' + data.activeDatabase);
                appendTerminal('Reloaded data via IStudentRepository interface.\\n');
                fetchStudents();
            } catch (err) {}
        }

        function renderTable(list) {
            const tbody = document.getElementById('studentTableBody');
            if (!list.length) {
                tbody.innerHTML = '<tr><td colspan="10" style="text-align: center; color: var(--text-muted); padding: 2rem;">No students found in active database.</td></tr>';
                return;
            }
            tbody.innerHTML = list.map(s => \`
                <tr>
                    <td style="font-weight: 700;">#\${s.id}</td>
                    <td style="font-weight: 600;">\${escapeHtml(s.name)}</td>
                    <td>\${s.age}</td>
                    <td style="color: var(--text-muted);">\${escapeHtml(s.email)}</td>
                    <td>\${escapeHtml(s.course)}</td>
                    <td>Sem \${s.semester || 1}</td>
                    <td style="font-weight: 600;">\${parseFloat(s.marks).toFixed(2)}%</td>
                    <td><span class="badge-grade grade-\${s.grade}">\${s.grade}</span></td>
                    <td style="font-size: 0.85rem;">\${s.academicStanding}</td>
                    <td>
                        <button class="btn btn-outline" style="padding: 0.25rem 0.6rem; font-size: 0.8rem;" onclick="editStudent(\${s.id})">✏️ Edit</button>
                        <button class="btn btn-outline" style="padding: 0.25rem 0.6rem; font-size: 0.8rem; color: var(--accent-rose); border-color: rgba(244,63,94,0.3);" onclick="deleteStudent(\${s.id})">🗑️</button>
                    </td>
                </tr>
            \`).join('');
        }

        function updateStats(list) {
            document.getElementById('statTotal').innerText = list.length;
            if (!list.length) {
                document.getElementById('statAvg').innerText = '0.00%';
                document.getElementById('statHonors').innerText = '0';
                return;
            }
            const avg = list.reduce((acc, s) => acc + parseFloat(s.marks), 0) / list.length;
            document.getElementById('statAvg').innerText = avg.toFixed(2) + '%';
            const honors = list.filter(s => parseFloat(s.marks) >= 90.0).length;
            document.getElementById('statHonors').innerText = honors;
        }

        function filterTable() {
            const query = document.getElementById('searchInput').value.toLowerCase();
            const filtered = studentsData.filter(s => 
                s.name.toLowerCase().includes(query) ||
                s.id.toString().includes(query) ||
                s.course.toLowerCase().includes(query) ||
                s.email.toLowerCase().includes(query)
            );
            renderTable(filtered);
        }

        function setTab(tab) {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            if (tab === 'dashboard') {
                document.querySelectorAll('.tab-btn')[0].classList.add('active');
                document.getElementById('tab-dashboard').classList.add('active');
            } else {
                document.querySelectorAll('.tab-btn')[1].classList.add('active');
                document.getElementById('tab-terminal').classList.add('active');
            }
        }

        function previewGrade() {
            const marks = parseFloat(document.getElementById('formMarks').value);
            if (isNaN(marks)) {
                document.getElementById('gradePreview').innerText = 'Grade: - | Standing: -';
                return;
            }
            let grade = 'F', standing = "Academic Warning / Probation";
            if (marks >= 90) { grade = 'A'; standing = "Dean's List (Honors)"; }
            else if (marks >= 80) { grade = 'B'; standing = "Good Standing"; }
            else if (marks >= 70) { grade = 'C'; standing = "Good Standing"; }
            else if (marks >= 60) { grade = 'D'; standing = "Good Standing"; }
            document.getElementById('gradePreview').innerText = \`Computed Grade: \${grade} | Academic Status: \${standing}\`;
        }

        function openAddModal() {
            isEditMode = false;
            document.getElementById('modalTitle').innerText = 'Add New Student';
            document.getElementById('formId').disabled = false;
            document.getElementById('studentForm').reset();
            document.getElementById('gradePreview').innerText = 'Grade: - | Standing: -';
            document.getElementById('studentModal').style.display = 'flex';
        }

        function editStudent(id) {
            const student = studentsData.find(s => s.id === id);
            if (!student) return;
            isEditMode = true;
            document.getElementById('modalTitle').innerText = 'Edit Student #' + id;
            document.getElementById('formId').value = student.id;
            document.getElementById('formId').disabled = true;
            document.getElementById('formName').value = student.name;
            document.getElementById('formEmail').value = student.email;
            document.getElementById('formAge').value = student.age;
            document.getElementById('formCourse').value = student.course;
            document.getElementById('formSemester').value = student.semester || 1;
            document.getElementById('formMarks').value = student.marks;
            previewGrade();
            document.getElementById('studentModal').style.display = 'flex';
        }

        function closeModal() {
            document.getElementById('studentModal').style.display = 'none';
        }

        async function handleFormSubmit(e) {
            e.preventDefault();
            const payload = {
                id: document.getElementById('formId').value,
                name: document.getElementById('formName').value,
                email: document.getElementById('formEmail').value,
                age: document.getElementById('formAge').value,
                course: document.getElementById('formCourse').value,
                semester: document.getElementById('formSemester').value,
                marks: document.getElementById('formMarks').value
            };

            const method = isEditMode ? 'PUT' : 'POST';
            const endpoint = isEditMode ? '/api/students/' + payload.id : '/api/students';

            try {
                const res = await fetch(endpoint, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await res.json();
                if (!res.ok) {
                    alert(data.error || "Operation failed.");
                    return;
                }
                closeModal();
                fetchStudents();
                appendTerminal(\`\\n[SUCCESS] Student \${payload.name} (ID: \${payload.id}) saved to \${document.getElementById('activeDbLabel').innerText}!\`);
            } catch (err) {
                alert("Failed to submit form.");
            }
        }

        async function deleteStudent(id) {
            if (!confirm(\`Are you sure you want to delete student #\${id}?\`)) return;
            try {
                const res = await fetch('/api/students/' + id, { method: 'DELETE' });
                const data = await res.json();
                if (res.ok) {
                    fetchStudents();
                    appendTerminal(\`\\n[DELETED] Student ID \${id} removed from database.\`);
                } else {
                    alert(data.error || "Delete failed.");
                }
            } catch (err) {}
        }

        function appendTerminal(text) {
            const out = document.getElementById('terminalOutput');
            out.innerText += text + '\\n';
            out.scrollTop = out.scrollHeight;
        }

        function handleTerminalCommand(e) {
            if (e.key === 'Enter') {
                const input = document.getElementById('terminalInput');
                const cmd = input.value.trim();
                input.value = '';
                appendTerminal(\`student_mgmt> \${cmd}\`);

                switch(cmd) {
                    case '1':
                        openAddModal();
                        appendTerminal("Opening 'Add Student' modal dialog...");
                        break;
                    case '2':
                        appendTerminal("Fetching all records via IStudentRepository::getAllStudents()...");
                        studentsData.forEach(s => {
                            appendTerminal(\`  [\${s.id}] \${s.name.padEnd(20)} | Age: \${s.age} | Marks: \${parseFloat(s.marks).toFixed(2)}% | Grade: \${s.grade} | Sem: \${s.semester}\`);
                        });
                        break;
                    case '3':
                        const searchId = prompt("Enter Student ID to search:");
                        if (searchId) {
                            const found = studentsData.find(s => s.id == searchId);
                            if (found) {
                                appendTerminal(\`\\n[RECORD FOUND]\\n  Name: \${found.name}\\n  Email: \${found.email}\\n  Course: \${found.course}\\n  Grade: \${found.grade}\\n  Status: \${found.academicStanding}\`);
                            } else {
                                appendTerminal(\`\\n[NOT FOUND] No record for ID \${searchId}\`);
                            }
                        }
                        break;
                    case '4':
                        const editId = prompt("Enter Student ID to update:");
                        if (editId) editStudent(parseInt(editId));
                        break;
                    case '5':
                        const delId = prompt("Enter Student ID to delete:");
                        if (delId) deleteStudent(parseInt(delId));
                        break;
                    case '6':
                        appendTerminal(\`\\n[DIAGNOSTICS]\\n  Backend: \${document.getElementById('activeDbLabel').innerText}\\n  Architecture: IStudentRepository\\n  Total Records: \${studentsData.length}\\n  Health: [ONLINE / OK]\`);
                        break;
                    case '7':
                        switchDatabase();
                        break;
                    case '0':
                        appendTerminal("Exiting console session. Program complete.");
                        break;
                    default:
                        appendTerminal("Invalid option. Enter 1-7 or 0 to exit.");
                }
            }
        }

        function escapeHtml(str) {
            return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        }

        // Initialize on load
        fetchStatus();
        fetchStudents();
    </script>
</body>
</html>`;
}

server.listen(PORT, () => {
    console.log(`=================================================================`);
    console.log(` Student Management System - Live Interactive Portal Active!     `);
    console.log(` URL: http://localhost:${PORT}`);
    console.log(` Active Engine: ${activeDatabase}`);
    console.log(`=================================================================`);
});
