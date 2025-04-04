// import { NextResponse } from "next/server";
// import db from "@/lib/db"; // Ensure correct path

// // Define Well interface
// interface Well {
//   id: number;
//   liquid_efficiency: number;
//   oil_efficiency: number;
//   gas_efficiency: number;
//   gor_deviation: number;
//   water_breakthrough_risk: number;
//   pressure_stability: number;
//   sand_risk: number;
//   choke_stability: number;
// }

// // Function to determine color rating for KPIs
// const getColor = (value: number, limits: { green: number; yellow: number }): string => {
//   if (value >= limits.green) return "green";
//   if (value >= limits.yellow) return "yellow";
//   return "red";
// };

// export async function GET() {
//   try {
//     const result = await db.query(`
//       SELECT id, liquid_efficiency, oil_efficiency, gas_efficiency,
//              gor_deviation, water_breakthrough_risk, pressure_stability,
//              sand_risk, choke_stability
//       FROM wells
//     `);

//     // Define thresholds for color ratings
//     const limits = {
//       liquid_efficiency: { green: 90, yellow: 75 },
//       oil_efficiency: { green: 85, yellow: 70 },
//       gas_efficiency: { green: 80, yellow: 65 },
//       gor_deviation: { green: 5, yellow: 15 }, // Lower is better
//       water_breakthrough_risk: { green: 20, yellow: 40 }, // Lower is better
//       pressure_stability: { green: 90, yellow: 75 }, // Higher is better
//       sand_risk: { green: 10, yellow: 30 }, // Lower is better
//       choke_stability: { green: 85, yellow: 70 }, // Higher is better
//     };

//     // Map and return updated well data
//     const wells = result.rows.map((well: Well) => ({
//       id: well.id,
//       lpeColor: getColor(well.liquid_efficiency, limits.liquid_efficiency),
//       opeColor: getColor(well.oil_efficiency, limits.oil_efficiency),
//       gpeColor: getColor(well.gas_efficiency, limits.gas_efficiency),
//       gorColor: getColor(well.gor_deviation, limits.gor_deviation),
//       waterRiskColor: getColor(well.water_breakthrough_risk, limits.water_breakthrough_risk),
//       pressureColor: getColor(well.pressure_stability, limits.pressure_stability),
//       sandRiskColor: getColor(well.sand_risk, limits.sand_risk),
//       chokeColor: getColor(well.choke_stability, limits.choke_stability),
//     }));

//     return NextResponse.json(wells);
//   } catch (error) {
//     console.error("Database query error:", error);
//     return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
//   }
// }


// Reading from CSV file
import { NextResponse } from "next/server";
import fs from "fs";
import csvParser from "csv-parser";

const csvFilePath = "./data.csv"; // Ensure the correct path

// Clean, corrected getColor function
const getColor = (
  value: number,
  good: number,
  warning: number,
  inverted = false
) => {
  if (inverted) {
    return value <= good ? "#22C55E" : value <= warning ? "#FACC15" : "#EF4444";
  } else {
    return value >= good ? "#22C55E" : value >= warning ? "#FACC15" : "#EF4444";
  }
};

export async function GET() {
  try {
    const wells: any[] = [];

    const readCSV = () =>
      new Promise((resolve, reject) => {
        fs.createReadStream(csvFilePath)
          .pipe(csvParser())
          .on("data", (row) => wells.push(row))
          .on("end", () => resolve(wells))
          .on("error", (err) => reject(err));
      });

    await readCSV();

    // Convert string values to numbers and apply getColor logic
    const processedWells = wells.map((well) => ({
      id: well.id,

      liquid_production: +well.liquid_production,
      lpeColor: getColor(+well.liquid_production, 1200, 900),

      oil_production: +well.oil_production,
      opeColor: getColor(+well.oil_production, 800, 650),

      gas_production: +well.gas_production,
      gpeColor: getColor(+well.gas_production, 5500, 4500),

      gas_to_oil_ratio: +well.gas_to_oil_ratio,
      gorColor: getColor(+well.gas_to_oil_ratio, 8.0, 6.5, true),

      basic_sediment_water: +well.basic_sediment_water,
      waterRiskColor: getColor(+well.basic_sediment_water, 0.3, 0.7, true),

      downhole_pressure: +well.downhole_pressure,
      pressureColor: getColor(+well.downhole_pressure, 2800, 2300),

      sand_production: +well.sand_production,
      sandRiskColor: getColor(+well.sand_production, 0.2, 0.5, true),

      jumper_pressure: +well.jumper_pressure,
      chokeColor: getColor(+well.jumper_pressure, 2200, 1700),
    }));

    return NextResponse.json(processedWells, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch wells data" },
      { status: 500 }
    );
  }
}
