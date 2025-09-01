import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import Transaction from "@/models/transaction";

// GET a single transaction by id
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const transaction = await Transaction.findById(params.id);
    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json({ transaction }, { status: 200 });
  } catch (error: any) {
    console.error(`GET /api/transactions/${params.id} error:`, error.message);
    return NextResponse.json(
      { error: "Failed to fetch transaction", details: error.message },
      { status: 500 }
    );
  }
}

// UPDATE a transaction
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    await dbConnect();

    const transaction = await Transaction.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json({ transaction }, { status: 200 });
  } catch (error: any) {
    console.error(`PUT /api/transactions/${params.id} error:`, error.message);

    if (error.name === "ValidationError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update transaction", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE a transaction
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const transaction = await Transaction.findByIdAndDelete(params.id);
    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Transaction deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`DELETE /api/transactions/${params.id} error:`, error.message);
    return NextResponse.json(
      { error: "Failed to delete transaction", details: error.message },
      { status: 500 }
    );
  }
}
