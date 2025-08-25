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
  return mongoose.Types.ObjectId.isValid(id);
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
    console.log('🔍 GET account request - User ID:', params.id, 'Account ID:', params.accountId);
    
    if (!isValidMongoId(params.id) || !isValidMongoId(params.accountId)) {
      console.log('❌ Invalid MongoDB ID format');
      return createErrorResponse('Invalid MongoDB ID format', { 
        userId: params.id, 
        accountId: params.accountId 
      }, 400);
    }

    await dbConnect();
    console.log('✅ Database connected');
    
    // Find user first
    const user = await User.findById(params.id);
    console.log('👤 User lookup result:', user ? `Found: ${user.name}` : 'Not found');
    
    if (!user) {
      return createErrorResponse('User not found', { userId: params.id }, 404);
    }

    // Find account - try both ways for debugging
    console.log('🔍 Looking for account with:');
    console.log('  Account ID:', params.accountId);
    console.log('  User ID:', params.id);
    
    // Method 1: Find by _id and userId
    const account1 = await Account.findOne({
      _id: params.accountId,
      userId: params.id
    });
    console.log('📊 Method 1 (findOne with both IDs):', account1 ? 'Found' : 'Not found');
    
    // Method 2: Find by _id only (for debugging)
    const account2 = await Account.findById(params.accountId);
    console.log('📊 Method 2 (findById only):', account2 ? `Found, belongs to user: ${account2.userId}` : 'Not found');
    
    if (!account1) {
      // More detailed error for debugging
      if (account2) {
        console.log('❌ Account exists but belongs to different user');
        console.log('  Account userId:', account2.userId);
        console.log('  Requested userId:', params.id);
        return createErrorResponse('Account entry not found or does not belong to this user', { 
          accountId: params.accountId, 
          userId: params.id,
          actualUserId: account2.userId.toString()
        }, 404);
      } else {
        console.log('❌ Account does not exist at all');
        return createErrorResponse('Account entry not found', { 
          accountId: params.accountId
        }, 404);
      }
    }
    
    console.log('✅ Account found successfully');
    return NextResponse.json({ 
      success: true,
      account: account1 
    }, { status: 200 });
  } catch (error: any) {
    console.error('❌ Failed to fetch account:', error);
    return createErrorResponse('Failed to fetch account', error.message, 500);
  }
}

// PUT - Update an account entry
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    console.log('🔍 PUT account request - User ID:', params.id, 'Account ID:', params.accountId);
    
    if (!isValidMongoId(params.id) || !isValidMongoId(params.accountId)) {
      console.log('❌ Invalid MongoDB ID format');
      return createErrorResponse('Invalid MongoDB ID format', { 
        userId: params.id, 
        accountId: params.accountId 
      }, 400);
    }
    
    const body = await req.json();
    console.log('📝 Request body:', body);
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
    console.log('✅ Database connected');
    
    // Verify user exists
    const user = await User.findById(params.id);
    console.log('👤 User lookup result:', user ? `Found: ${user.name}` : 'Not found');
    
    if (!user) {
      return createErrorResponse('User not found', { userId: params.id }, 404);
    }

    // Check if account exists first (for debugging)
    const existingAccount = await Account.findById(params.accountId);
    console.log('🔍 Existing account check:', existingAccount ? `Found, belongs to: ${existingAccount.userId}` : 'Not found');
    
    if (!existingAccount) {
      return createErrorResponse('Account entry not found', { 
        accountId: params.accountId
      }, 404);
    }
    
    if (existingAccount.userId.toString() !== params.id) {
      return createErrorResponse('Account entry does not belong to this user', { 
        accountId: params.accountId,
        userId: params.id,
        actualUserId: existingAccount.userId.toString()
      }, 403);
    }

    // Update account entry - use findByIdAndUpdate for simplicity
    console.log('🔄 Updating account...');
    const accountEntry = await Account.findByIdAndUpdate(
      params.accountId,
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

    console.log('✅ Account updated successfully:', accountEntry);
    
    return NextResponse.json({ 
      success: true,
      message: 'Account entry updated successfully', 
      account: accountEntry 
    }, { status: 200 });
  } catch (error: any) {
    console.error('❌ Failed to update account entry:', error);
    
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
    console.log('🔍 DELETE account request - User ID:', params.id, 'Account ID:', params.accountId);
    
    if (!isValidMongoId(params.id) || !isValidMongoId(params.accountId)) {
      console.log('❌ Invalid MongoDB ID format');
      return createErrorResponse('Invalid MongoDB ID format', { 
        userId: params.id, 
        accountId: params.accountId 
      }, 400);
    }
    
    await dbConnect();
    console.log('✅ Database connected');
    
    // Verify user exists
    const user = await User.findById(params.id);
    console.log('👤 User lookup result:', user ? `Found: ${user.name}` : 'Not found');
    
    if (!user) {
      return createErrorResponse('User not found', { userId: params.id }, 404);
    }

    // Check if account exists first (for debugging)
    const existingAccount = await Account.findById(params.accountId);
    console.log('🔍 Existing account check:', existingAccount ? `Found, belongs to: ${existingAccount.userId}` : 'Not found');
    
    
    if (!existingAccount) {
      return createErrorResponse('Account entry not found', { 
        accountId: params.accountId
      }, 404);
    }
    
    if (existingAccount.userId.toString() !== params.id) {
      return createErrorResponse('Account entry does not belong to this user', { 
        accountId: params.accountId,
        userId: params.id,
        actualUserId: existingAccount.userId.toString()
      }, 403);
    }

    // Delete account entry
    console.log('🗑️ Deleting account...');
    const accountEntry = await Account.findByIdAndDelete(params.accountId);

    console.log('✅ Account deleted successfully');
    
    return NextResponse.json({ 
      success: true,
      message: 'Account entry deleted successfully',
      deletedAccount: accountEntry
    }, { status: 200 });
  } catch (error: any) {
    console.error('❌ Failed to delete account entry:', error);
    return createErrorResponse('Failed to delete account entry', error.message, 500);
  }
}