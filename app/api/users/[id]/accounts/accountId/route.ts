import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import Account from '@/models/Account';
import User from '@/models/User';
import mongoose from 'mongoose';

interface Params {
  params: {
    id: string;
    accountId: string;
  };
}

// Enhanced ID validation for MongoDB
function isValidMongoId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id) && new mongoose.Types.ObjectId(id).toString() === id;
}

// Helper function to create error responses
function createErrorResponse(message: string, details?: any, status = 500) {
  return NextResponse.json({
    success: false,
    error: message,
    details,
    timestamp: new Date().toISOString()
  }, { status });
}

// GET - Get a specific account entry
export async function GET(req: NextRequest, { params }: Params) {
  try {
    console.log('GET account request - User ID:', params.id, 'Account ID:', params.accountId);
    
    if (!isValidMongoId(params.id) || !isValidMongoId(params.accountId)) {
      return createErrorResponse('Invalid MongoDB ID format', { 
        userId: params.id, 
        accountId: params.accountId 
      }, 400);
    }

    await dbConnect();
    
    // Convert string IDs to ObjectId
    const userId = new mongoose.Types.ObjectId(params.id);
    const accountId = new mongoose.Types.ObjectId(params.accountId);

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return createErrorResponse('User not found', { userId: params.id }, 404);
    }

    // Find account
    const account = await Account.findOne({
      _id: accountId,
      userId: userId
    });
    
    if (!account) {
      return createErrorResponse('Account entry not found', { 
        accountId: params.accountId, 
        userId: params.id
      }, 404);
    }
    
    return NextResponse.json({ 
      success: true,
      account 
    }, { status: 200 });
  } catch (error: any) {
    console.error('Failed to fetch account:', error);
    return createErrorResponse('Failed to fetch account', error.message, 500);
  }
}

// PUT - Update an account entry
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    console.log('PUT account request - User ID:', params.id, 'Account ID:', params.accountId);
    
    if (!isValidMongoId(params.id) || !isValidMongoId(params.accountId)) {
      return createErrorResponse('Invalid MongoDB ID format', { 
        userId: params.id, 
        accountId: params.accountId 
      }, 400);
    }
    
    const body = await req.json();
    const { type, amount, description } = body;

    // Validation
    if (!type || amount === undefined || amount === null || !description) {
      return createErrorResponse('All fields are required', { 
        received: { type, amount, description }
      }, 400);
    }

    if (!['credit', 'debit'].includes(type)) {
      return createErrorResponse('Invalid account type', { 
        received: type, 
        allowed: ['credit', 'debit'] 
      }, 400);
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return createErrorResponse('Amount must be a positive number', { 
        received: amount 
      }, 400);
    }

    if (typeof description !== 'string' || description.trim().length === 0) {
      return createErrorResponse('Description must be a non-empty string', { 
        received: description 
      }, 400);
    }

    if (description.trim().length > 200) {
      return createErrorResponse('Description cannot exceed 200 characters', { 
        length: description.length 
      }, 400);
    }

    await dbConnect();
    
    // Convert string IDs to ObjectId
    const userId = new mongoose.Types.ObjectId(params.id);
    const accountId = new mongoose.Types.ObjectId(params.accountId);

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return createErrorResponse('User not found', { userId: params.id }, 404);
    }

    // Update account entry
    const accountEntry = await Account.findOneAndUpdate(
      { 
        _id: accountId, 
        userId: userId 
      },
      { 
        type, 
        amount: numAmount, 
        description: description.trim(),
        updatedAt: new Date()
      },
      { 
        new: true, 
        runValidators: true 
      }
    );

    if (!accountEntry) {
      return createErrorResponse('Account entry not found or does not belong to this user', { 
        accountId: params.accountId,
        userId: params.id
      }, 404);
    }

    console.log('Account updated successfully:', accountEntry);
    
    return NextResponse.json({ 
      success: true,
      message: 'Account entry updated successfully', 
      account: accountEntry 
    }, { status: 200 });
  } catch (error: any) {
    console.error('Failed to update account entry:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return createErrorResponse('Validation failed', errors, 400);
    }
    
    return createErrorResponse('Failed to update account entry', error.message, 500);
  }
}

// DELETE - Remove an account entry
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    console.log('DELETE account request - User ID:', params.id, 'Account ID:', params.accountId);
    
    if (!isValidMongoId(params.id) || !isValidMongoId(params.accountId)) {
      return createErrorResponse('Invalid MongoDB ID format', { 
        userId: params.id, 
        accountId: params.accountId 
      }, 400);
    }
    
    await dbConnect();
    
    // Convert string IDs to ObjectId
    const userId = new mongoose.Types.ObjectId(params.id);
    const accountId = new mongoose.Types.ObjectId(params.accountId);

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return createErrorResponse('User not found', { userId: params.id }, 404);
    }

    // Delete account entry
    const accountEntry = await Account.findOneAndDelete({
      _id: accountId,
      userId: userId
    });

    if (!accountEntry) {
      return createErrorResponse('Account entry not found or does not belong to this user', { 
        accountId: params.accountId,
        userId: params.id
      }, 404);
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Account entry deleted successfully',
      deletedAccount: accountEntry
    }, { status: 200 });
  } catch (error: any) {
    console.error('Failed to delete account entry:', error);
    return createErrorResponse('Failed to delete account entry', error.message, 500);
  }
}