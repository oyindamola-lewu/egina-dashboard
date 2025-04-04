"use client";

import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from "recharts";
import { FaTint, FaOilCan, FaFire, FaCubes, FaTachometerAlt } from "react-icons/fa";
import styles from "./WellOverlay.module.css";

interface WellOverlayProps {
  wellId: number | null;
  onClose: () => void;
}

interface WellMetrics {
  id: number;
  liquid_production: number;
  oil_production: number;
  gas_production: number;
  gas_to_oil_ratio: number;
  sand_production: number;
  jumper_pressure: number;
}

const WellOverlay: React.FC<WellOverlayProps> = ({ wellId, onClose }) => {
  const [wellData, setWellData] = useState<WellMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (wellId === null) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("Fetching data...");
        const response = await fetch(`/api/well-metrics?wellId=${wellId}`);
        if (!response.ok) throw new Error("Failed to fetch well data");

        const data = await response.json();
        console.log("Response:", data);

        if (data.length > 0) {
          setWellData(data[0]);
        } else {
          setError("No data found for this well.");
          setWellData(null);
        }
      } catch (err) {
        setError("Error fetching well data.");
        console.error(err);
      } finally {
        console.log("Setting loading to false");
        setLoading(false);
      }
    };

    fetchData();
  }, [wellId]);

  const oil = wellData?.oil_production ?? 0;
  const gas = wellData?.gas_production ?? 0;
  const water = Math.max((wellData?.liquid_production ?? 0) - oil, 0);

  const pieData = [
    { name: "Oil", value: oil, color: "#2ca02c" },
    { name: "Gas", value: gas, color: "#ff7f0e" },
    { name: "Water", value: water, color: "#1f77b4" },
  ];

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        {/* ✅ Close Button Fix */}
        <button className={styles.closeButton} onClick={onClose}>✕</button>

        {/* ✅ Well ID Fix */}
        <h2 className={styles.title}>
          Well {wellId ? `W${String(wellId).padStart(3, "0")}` : "Unknown"}
        </h2>

        {/* ✅ LOADING SCREEN FIX */}
        {loading && (
          <div className={styles.loadingOverlay}>
            <p>Loading...</p>
          </div>
        )}

        {/* ✅ ERROR HANDLING */}
        {error && <div className={styles.errorMessage}>{error}</div>}

        {/* ✅ KPI Section - Only Render if Data Exists */}
        {!loading && wellData && (
          <>
            <div className={styles.kpiContainer}>
              {[
                ["Liquid Production", wellData.liquid_production, "bbl/d", <FaTint color="#007bff" />],
                ["Oil Production", wellData.oil_production, "bbl/d", <FaOilCan color="#2ca02c" />],
                ["Gas Production", wellData.gas_production, "scf/d", <FaFire color="#ff7f0e" />],
                ["Gas-Oil Ratio", wellData.gas_to_oil_ratio, "", <FaTachometerAlt color="#d62728" />],
                ["Sand Production", wellData.sand_production, "lb/d", <FaCubes color="#6c757d" />],
                ["Jumper Pressure", wellData.jumper_pressure, "psi", <FaTachometerAlt color="#007bff" />],
              ].map(([label, value, unit, icon], index) => (
                <div key={index} className={styles.kpiItem}>
                  <span className={styles.kpiLabel}>
                    {icon} {label}
                  </span>
                  <span className={styles.kpiValue}>
                    {value} {unit}
                  </span>
                </div>
              ))}
            </div>

            {/* Charts Section */}
            <div className={styles.chartsContainer}>
              <div className={styles.chartBox}>
                <h4>Production Breakdown</h4>
                {pieData.some((d) => d.value > 0) ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" innerRadius="50%" outerRadius="80%">
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p>No production data available.</p>
                )}
              </div>

              <div className={styles.chartBox}>
                <h4>Gas-to-Oil Ratio</h4>
                {wellData.gas_to_oil_ratio > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <RadialBarChart innerRadius="40%" outerRadius="90%" data={[{ name: "GOR", value: wellData.gas_to_oil_ratio }]}>
                      <RadialBar dataKey="value" fill="#d62728" />
                      <Tooltip />
                    </RadialBarChart>
                  </ResponsiveContainer>
                ) : (
                  <p>No GOR data available.</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WellOverlay;
