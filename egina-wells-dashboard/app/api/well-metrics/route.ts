import { NextResponse } from "next/server";
import db from "@/lib/db"; // Ensure correct path

/*interface Well_Metric {
  id: number;
  well_id: number;
  date: Date;
  liquid_production: number;
  oil_production: number;
  gas_production: number;
  gas_to_oil_ratio: number;
  basic_sediment_water: number;
  downhole_pressure: number;
  sand_production: number;
  jumper_pressure: number;
}*/

export async function GET(req: Request) {
  const url = new URL(req.url);
  const wellId = url.searchParams.get("wellId");

  if (!wellId) {
    return NextResponse.json(
      { error: "Missing wellId parameter" },
      { status: 400 }
    );
  }

  try {
    const result = await db.query(
      `SELECT * FROM well_metrics WHERE well_id = $1`, 
      [wellId]
    );

    return NextResponse.json(result.rows); // `pg` stores data in `rows`
  } catch (error) {
    console.error("Error fetching well metrics:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}