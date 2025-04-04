"use client";

import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import styles from "./Chart.module.css";

interface ChartProps {
  title: string;
  dataKey: keyof WellMetrics;
  wellId: number; // ✅ Use `id` directly instead of `well_id`
}

export interface WellMetrics {
  id: number;
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
        console.log(`Fetching data for wellId: ${wellId} and dataKey: ${dataKey}`);
  
        const response = await fetch(`/api/well-metrics?wellId=${wellId}`);
        const result: WellMetrics[] = await response.json();
  
        console.log("API Response:", result); // ✅ Debugging API response
  
        if (!Array.isArray(result) || result.length === 0) {
          console.warn("No data received for wellId:", wellId);
          setData([]); // Ensure no empty chart renders
          return;
        }
  
        const filteredData = result.map((item) => ({
          date: item.date,
          value: Number(item[dataKey]),
        }));
  
        console.log("Filtered Chart Data:", filteredData); // ✅ Check chart data
  
        setData(filteredData);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };
  
    fetchData();
  }, [dataKey, wellId]); 

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
