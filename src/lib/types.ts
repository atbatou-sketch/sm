// Student types
export interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  enrollment_date: string;
  status: 'active' | 'inactive' | 'graduated';
  created_at: string;
  updated_at: string;
}

export interface CreateStudentInput {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
}

export interface UpdateStudentInput {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  status?: 'active' | 'inactive' | 'graduated';
}

// User types
export interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
}
