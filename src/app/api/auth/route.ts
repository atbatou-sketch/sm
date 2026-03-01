import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import crypto from 'crypto';

// Helper to hash password
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// POST - Register a new user
export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    if (action === 'register') {
      const { email, password, name } = await request.json();

      // Validation
      if (!email || !password || !name) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        );
      }

      // Check if user already exists
      const existingStmt = db.prepare('SELECT id FROM users WHERE email = ?');
      if (existingStmt.get(email)) {
        return NextResponse.json(
          { error: 'User already exists' },
          { status: 409 }
        );
      }

      // Hash password
      const hashedPassword = hashPassword(password);

      // Insert user
      const stmt = db.prepare(
        'INSERT INTO users (email, password, name) VALUES (?, ?, ?)'
      );
      
      const result = stmt.run(email, hashedPassword, name);

      return NextResponse.json({
        message: 'User registered successfully',
        userId: result.lastInsertRowid
      }, { status: 201 });

    } else if (action === 'login') {
      const { email, password } = await request.json();

      // Validation
      if (!email || !password) {
        return NextResponse.json(
          { error: 'Email and password are required' },
          { status: 400 }
        );
      }

      // Find user
      const stmt = db.prepare('SELECT id, email, name, password FROM users WHERE email = ?');
      const user = stmt.get(email) as any;

      if (!user) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      // Check password
      const hashedPassword = hashPassword(password);
      if (user.password !== hashedPassword) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      // Create session token (simple JWT-like token)
      const token = crypto.randomBytes(32).toString('hex');
      const sessionStmt = db.prepare(
        'INSERT INTO users (email, password, name) SELECT email, password, name FROM users WHERE id = ? ON CONFLICT(email) DO NOTHING'
      );

      return NextResponse.json({
        message: 'Login successful',
        token: token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      });

    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error in auth:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
