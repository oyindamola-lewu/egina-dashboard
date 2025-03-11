import { NextResponse } from "next/server";
import db from "@/lib/db"; // Adjust the path if necessary

export async function GET() {
  try {
    const [rows] = await db.query("SELECT * FROM wells");
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: "Database error", details: error }, { status: 500 });
  }
}