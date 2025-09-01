import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import Transaction from "@/models/transaction"; 

// GET: fetch all transactions
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    console.log("Fetching transactions...");

    const transactions = await Transaction.find({}).sort({ date: -1 });
    console.log(`Found ${transactions.length} transactions`);

    return NextResponse.json({ transactions }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/transactions error:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch transactions", details: error.message },
      { status: 500 }
    );
  }
}

// POST: create a new transaction
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await dbConnect();

    const transaction = new Transaction(body);
    await transaction.save();

    return NextResponse.json({ transaction }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/transactions error:", error.message);

    if (error.name === "ValidationError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create transaction", details: error.message },
      { status: 500 }
    );
  }
}
