import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { CreateStudentInput, UpdateStudentInput, Student } from '@/lib/types';

// GET all students or a specific student
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      // Get specific student
      const student = db.getStudent(parseInt(id));
      
      if (!student) {
        return NextResponse.json(
          { error: 'Student not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(student);
    } else {
      // Get all students
      const students = db.getStudents();
      return NextResponse.json(students);
    }
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new student
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as CreateStudentInput;

    const { first_name, last_name, email, phone, date_of_birth } = body;

    // Validation
    if (!first_name || !last_name || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: first_name, last_name, email' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const students = db.getStudents();
    if (students.some((s: Student) => s.email === email)) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      );
    }

    // Create student
    const student = db.addStudent({
      first_name,
      last_name,
      email,
      phone: phone || undefined,
      date_of_birth: date_of_birth || undefined,
      enrollment_date: new Date().toISOString(),
      status: 'active',
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update a student
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      );
    }

    // Check if student exists
    const existingStudent = db.getStudent(parseInt(id));
    
    if (!existingStudent) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    const body = await request.json() as UpdateStudentInput;
    const { first_name, last_name, email, phone, date_of_birth, status } = body;

    // Check if new email is unique
    if (email && email !== existingStudent.email) {
      const students = db.getStudents();
      if (students.some((s: Student) => s.email === email && s.id !== parseInt(id))) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 409 }
        );
      }
    }

    // Update student
    const updates: Partial<Student> = {};
    if (first_name !== undefined) updates.first_name = first_name;
    if (last_name !== undefined) updates.last_name = last_name;
    if (email !== undefined) updates.email = email;
    if (phone !== undefined) updates.phone = phone;
    if (date_of_birth !== undefined) updates.date_of_birth = date_of_birth;
    if (status !== undefined) updates.status = status;

    const updatedStudent = db.updateStudent(parseInt(id), updates);

    return NextResponse.json(updatedStudent);
  } catch (error) {
    console.error('Error updating student:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a student
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      );
    }

    // Check if student exists
    const student = db.getStudent(parseInt(id));
    
    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // Delete student
    const deletedStudent = db.deleteStudent(parseInt(id));

    return NextResponse.json({
      message: 'Student deleted successfully',
      student: deletedStudent
    });
  } catch (error) {
    console.error('Error deleting student:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
