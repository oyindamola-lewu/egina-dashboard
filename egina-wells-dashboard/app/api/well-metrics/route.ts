import { NextResponse } from "next/server";
import fs from "fs";
import csvParser from "csv-parser";

const csvFilePath = "./data.csv"; // ✅ Make sure this path is correct

// Define WellMetric interface
interface WellMetric {
  id: number;
  date: string;
  liquid_production: number;
  oil_production: number;
  gas_production: number;
  gas_to_oil_ratio: number;
  basic_sediment_water: number;
  downhole_pressure: number;
  sand_production: number;
  jumper_pressure: number;
}

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
    const wells: WellMetric[] = [];

    const readCSV = () =>
      new Promise<WellMetric[]>((resolve, reject) => {
        fs.createReadStream(csvFilePath)
          .pipe(csvParser())
          .on("data", (row) => {
            wells.push({
              id: Number(row.id),
              date: row.date,
              liquid_production: Number(row.liquid_production),
              oil_production: Number(row.oil_production),
              gas_production: Number(row.gas_production),
              gas_to_oil_ratio: Number(row.gas_to_oil_ratio),
              basic_sediment_water: Number(row.basic_sediment_water),
              downhole_pressure: Number(row.downhole_pressure),
              sand_production: Number(row.sand_production),
              jumper_pressure: Number(row.jumper_pressure),
            });
          })
          .on("end", () => resolve(wells))
          .on("error", (err) => reject(err));
      });

    const wellData = await readCSV();

    // ✅ Ensure filtering by `id`
    const selectedWellMetrics = wellData.filter(
      (well) => well.id === Number(wellId)
    );

    if (selectedWellMetrics.length === 0) {
      return NextResponse.json(
        { error: "No data found for the specified wellId" },
        { status: 404 }
      );
    }

    return NextResponse.json(selectedWellMetrics, { status: 200 });
  } catch (error) {
    console.error("Error fetching well metrics:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
