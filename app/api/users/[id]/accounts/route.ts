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
    console.log('GET accounts request for user:', params.id);
    
    await dbConnect();
    
    // Verify user exists
    const user = await User.findById(params.id);
    if (!user) {
      console.log('User not found:', params.id);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('User found:', user.name);

    // Fetch accounts sorted by creation date
    const accounts = await Account.find({ userId: params.id }).sort({ createdAt: 1 });
    
    console.log(`Found ${accounts.length} accounts for user ${params.id}`);
    
    return NextResponse.json({ accounts }, { status: 200 });
  } catch (error: any) {
    console.error('Failed to fetch accounts:', error);
    
    if (error.name === 'CastError') {
      return NextResponse.json({ 
        error: 'Invalid user ID format',
        details: error.message 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to fetch accounts',
      details: error.message 
    }, { status: 500 });
  }
}

// POST - Add new account entry
export async function POST(req: NextRequest, { params }: Params) {
  try {
    console.log('POST account request for user:', params.id);
    
    const body = await req.json();
    console.log('Request body:', body);
    
    const { type, amount, description } = body;

    // Enhanced validation
    if (!type || amount === undefined || amount === null || !description) {
      console.log('Validation failed - missing fields');
      return NextResponse.json({ 
        error: 'All fields are required',
        received: { type, amount, description }
      }, { status: 400 });
    }

    if (!['credit', 'debit'].includes(type)) {
      console.log('Invalid account type:', type);
      return NextResponse.json({ error: 'Invalid account type. Must be credit or debit' }, { status: 400 });
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      console.log('Invalid amount:', amount);
      return NextResponse.json({ error: 'Amount must be a positive number' }, { status: 400 });
    }

    if (typeof description !== 'string' || description.trim().length === 0) {
      console.log('Invalid description:', description);
      return NextResponse.json({ error: 'Description must be a non-empty string' }, { status: 400 });
    }

    if (description.trim().length > 200) {
      return NextResponse.json({ error: 'Description cannot exceed 200 characters' }, { status: 400 });
    }

    await dbConnect();
    console.log('Database connected');
    
    // Verify user exists
    const user = await User.findById(params.id);
    if (!user) {
      console.log('User not found:', params.id);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('User found:', user.name);

    // Create new account entry
    const accountEntry = new Account({
      userId: params.id,
      type,
      amount: numAmount,
      description: description.trim()
    });

    const savedAccount = await accountEntry.save();
    console.log('Account entry created:', savedAccount);
    
    return NextResponse.json({ 
      message: 'Account entry added successfully', 
      account: savedAccount 
    }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to add account entry:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: errors 
      }, { status: 400 });
    }

    if (error.name === 'CastError') {
      return NextResponse.json({ 
        error: 'Invalid user ID format',
        details: error.message 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to add account entry',
      details: error.message 
    }, { status: 500 });
  }
}