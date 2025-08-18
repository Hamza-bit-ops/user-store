import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import Account from '@/models/Account';
import User from '@/models/User';

interface Params {
  params: {
    id: string;
  };
}

// GET - Fetch all accounts for a specific user
export async function GET(req: NextRequest, { params }: Params) {
  try {
    await dbConnect();
    
    // Verify user exists
    const user = await User.findById(params.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch accounts sorted by creation date (newest first)
    const accounts = await Account.find({ userId: params.id }).sort({ createdAt: 1 });
    
    return NextResponse.json({ accounts }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch accounts:', error);
    return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 });
  }
}

// POST - Add new account entry
export async function POST(req: NextRequest, { params }: Params) {
  try {
    const body = await req.json();
    const { type, amount, description } = body;

    // Validation
    if (!type || !amount || !description) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (!['credit', 'debit'].includes(type)) {
      return NextResponse.json({ error: 'Invalid account type' }, { status: 400 });
    }

    if (amount <= 0) {
      return NextResponse.json({ error: 'Amount must be positive' }, { status: 400 });
    }

    await dbConnect();
    
    // Verify user exists
    const user = await User.findById(params.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create new account entry
    const accountEntry = new Account({
      userId: params.id,
      type,
      amount,
      description
    });

    await accountEntry.save();
    
    return NextResponse.json({ 
      message: 'Account entry added successfully', 
      account: accountEntry 
    }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to add account entry:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json({ error: errors.join(', ') }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Failed to add account entry' }, { status: 500 });
  }
}