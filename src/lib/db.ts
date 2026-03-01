import fs from 'fs';
import path from 'path';
import { Student } from './types';

// In-memory database for development
interface Database {
  students: { [id: number]: Student };
  users: { [id: number]: any };
  prepare: (sql: string) => any;
  exec: (sql: string) => void;
}

// File-based storage
const dataDir = path.join(process.cwd(), 'data');
const studentsFile = path.join(dataDir, 'students.json');
const usersFile = path.join(dataDir, 'users.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Load data from files
function loadStudents(): { [id: number]: Student } {
  try {
    if (fs.existsSync(studentsFile)) {
      return JSON.parse(fs.readFileSync(studentsFile, 'utf-8'));
    }
  } catch (error) {
    console.error('Error loading students:', error);
  }
  return {};
}

function loadUsers(): { [id: number]: any } {
  try {
    if (fs.existsSync(usersFile)) {
      return JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
    }
  } catch (error) {
    console.error('Error loading users:', error);
  }
  return {};
}

// Save data to files
function saveStudents(students: { [id: number]: Student }) {
  fs.writeFileSync(studentsFile, JSON.stringify(students, null, 2));
}

function saveUsers(users: { [id: number]: any }) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// In-memory database
const db: any = {
  students: loadStudents(),
  users: loadUsers(),

  prepare: (sql: string) => ({
    run: (...args: any[]) => ({ lastInsertRowid: generateId() }),
    get: (...args: any[]) => null,
    all: (...args: any[]) => [],
  }),

  exec: (sql: string) => {},

  // Custom methods
  getStudents: function() {
    return Object.values(this.students);
  },

  getStudent: function(id: number) {
    return this.students[id];
  },

  addStudent: function(student: Omit<Student, 'id' | 'created_at' | 'updated_at'>) {
    const id = Math.max(...Object.keys(this.students).map(Number), 0) + 1;
    const now = new Date().toISOString();
    const newStudent: Student = {
      id,
      ...student,
      created_at: now,
      updated_at: now,
    };
    this.students[id] = newStudent;
    saveStudents(this.students);
    return newStudent;
  },

  updateStudent: function(id: number, updates: Partial<Student>) {
    if (this.students[id]) {
      this.students[id] = {
        ...this.students[id],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      saveStudents(this.students);
      return this.students[id];
    }
    return null;
  },

  deleteStudent: function(id: number) {
    const student = this.students[id];
    if (student) {
      delete this.students[id];
      saveStudents(this.students);
      return student;
    }
    return null;
  },
};

function generateId(): number {
  return Math.floor(Math.random() * 1000000);
}

export default db;
