import { NextResponse } from "next/server";
import db from "@/lib/db"; // Ensure correct path
import { RowDataPacket } from "mysql2/promise";

// Define Well interface
interface Well extends RowDataPacket {
  id: number;
  liquid_efficiency: number;
  oil_efficiency: number;
  gas_efficiency: number;
  gor_deviation: number;
  water_breakthrough_risk: number;
  pressure_stability: number;
  sand_risk: number;
  choke_stability: number;
}

// Function to determine color rating for KPIs
const getColor = (value: number, limits: { green: number; yellow: number }): string => {
  if (value >= limits.green) return "green";
  if (value >= limits.yellow) return "yellow";
  return "red";
};

export async function GET() {
  try {
    const [rows] = await db.query<Well[]>(`
      SELECT id, liquid_efficiency, oil_efficiency, gas_efficiency,
             gor_deviation, water_breakthrough_risk, pressure_stability,
             sand_risk, choke_stability
      FROM wells
    `);

    // Define thresholds for color ratings
    const limits = {
      liquid_efficiency: { green: 90, yellow: 75 },
      oil_efficiency: { green: 85, yellow: 70 },
      gas_efficiency: { green: 80, yellow: 65 },
      gor_deviation: { green: 5, yellow: 15 }, // Lower is better
      water_breakthrough_risk: { green: 20, yellow: 40 }, // Lower is better
      pressure_stability: { green: 90, yellow: 75 }, // Higher is better
      sand_risk: { green: 10, yellow: 30 }, // Lower is better
      choke_stability: { green: 85, yellow: 70 }, // Higher is better
    };

    // Map and return updated well data
    const wells = (rows as Well[]).map((well) => ({
      id: well.id,
      lpeColor: getColor(well.liquid_efficiency, limits.liquid_efficiency),
      opeColor: getColor(well.oil_efficiency, limits.oil_efficiency),
      gpeColor: getColor(well.gas_efficiency, limits.gas_efficiency),
      gorColor: getColor(well.gor_deviation, limits.gor_deviation),
      waterRiskColor: getColor(well.water_breakthrough_risk, limits.water_breakthrough_risk),
      pressureColor: getColor(well.pressure_stability, limits.pressure_stability),
      sandRiskColor: getColor(well.sand_risk, limits.sand_risk),
      chokeColor: getColor(well.choke_stability, limits.choke_stability),
    }));

    return NextResponse.json(wells);
  } catch (error) {
    console.error("Database query error:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}