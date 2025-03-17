"use client";

import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import styles from "./Chart.module.css";

interface ChartProps {
  title: string;
  dataKey: keyof WellMetrics; // Ensures only valid keys are used
  wellId: number; // ✅ Ensure the chart gets data for a specific well
}

export interface WellMetrics {
  id: number;
  well_id: number;
  date: string; // Store dates as strings in ISO format
  liquid_production: number;
  oil_production: number;
  gas_production: number;
  gas_to_oil_ratio: number;
  basic_sediment_water: number;
  downhole_pressure: number;
  sand_production: number;
  jumper_pressure: number;
}

const Chart: React.FC<ChartProps> = ({ title, dataKey, wellId }) => {
  const [data, setData] = useState<{ date: string; value: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/well-metrics?wellId=${wellId}`);
        if (!response.ok) throw new Error("Failed to fetch data");

        const result: WellMetrics[] = await response.json();

        // ✅ Filter data to show only the selected well's metrics
        const filteredData = result
          .filter((item) => item.well_id === wellId) // Only use data for this well
          .map((item) => ({
            date: item.date, // Assuming API returns date as YYYY-MM-DD
            value: Number(item[dataKey]), // Ensure it's always a number
          }));

        setData(filteredData);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchData();
  }, [dataKey, wellId]); // ✅ Re-fetch if wellId or dataKey changes

  return (
    <div className={styles.chart}>
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={150}>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;