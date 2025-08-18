import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import Item from '@/models/Item';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    console.log('Fetching items...'); // Debug log
    
    const items = await Item.find({}).sort({ createdAt: -1 });
    console.log(`Found ${items.length} items`); // Debug log
    
    return NextResponse.json({ items }, { status: 200 });
  } catch (error: any) {
    console.error('GET /api/items error:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch items', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await dbConnect();
    
    const item = new Item(body);
    await item.save();
    
    return NextResponse.json({ item }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/items error:', error.message);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create item', details: error.message },
      { status: 500 }
    );
  }
}