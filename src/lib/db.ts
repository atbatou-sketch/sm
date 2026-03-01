import fs from 'fs';
import path from 'path';
import { Student } from './types';

// In-memory database for development and serverless
interface Database {
  students: { [id: number]: Student };
  users: { [id: number]: any };
}

// File-based storage (for local development only)
const isProduction = process.env.NODE_ENV === 'production';
const dataDir = path.join(process.cwd(), 'data');
const studentsFile = path.join(dataDir, 'students.json');
const usersFile = path.join(dataDir, 'users.json');

// Load data from files
function loadStudents(): { [id: number]: Student } {
  if (isProduction) return {};
  
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
  if (isProduction) return {};
  
  try {
    if (fs.existsSync(usersFile)) {
      return JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
    }
  } catch (error) {
    console.error('Error loading users:', error);
  }
  return {};
}

// Save data to files (only in development)
function saveStudents(students: { [id: number]: Student }) {
  if (isProduction) return;
  
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(studentsFile, JSON.stringify(students, null, 2));
  } catch (error) {
    console.error('Error saving students:', error);
  }
}

function saveUsers(users: { [id: number]: any }) {
  if (isProduction) return;
  
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error saving users:', error);
  }
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
    return Object.values(this.students).sort((a: any, b: any) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
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

  addUser: function(user: any) {
    const id = Math.max(...Object.keys(this.users).map(Number), 0) + 1;
    const newUser = { id, ...user };
    this.users[id] = newUser;
    saveUsers(this.users);
    return newUser;
  },

  getUser: function(id: number) {
    return this.users[id];
  },

  getUserByEmail: function(email: string) {
    return Object.values(this.users).find((u: any) => u.email === email);
  },
};

function generateId(): number {
  return Math.floor(Math.random() * 1000000);
}

export default db;
