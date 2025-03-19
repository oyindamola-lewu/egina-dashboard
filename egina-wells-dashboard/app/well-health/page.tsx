"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./styles.module.css";
import ArrowIcon from "@/components/ArrowIcon"; // Adjust based on folder structure
import ArrowIconLeft from "@/components/ArrowIconLeft";
import WellOverlay from "@/components/WellOverlay";
import { WellMetrics } from "@/components/Chart";

interface Well {
  id: number;
  gorColor: string;
  waterRiskColor: string;
  pressureColor: string;
}

// Cell component
const Cell: React.FC<{ id: number; color?: string; onClick: () => void }> = ({ id, color = "#4A4A4A", onClick }) => (
  <div className={styles.cell} style={{ backgroundColor: color }} onClick={onClick}>
    {`W0${id.toString().padStart(2, "0")}`}
  </div>
);

// Grid section component
const GridSection: React.FC<{ title: string; wells: Well[]; colorKey: keyof Omit<Well, "id">; onWellClick: (id: number) => void }> = ({ title, wells, colorKey, onWellClick }) => (
  <div className={styles.gridSection}>
    <h2 className={styles.gridTitle}>{title}</h2>
    <div className={styles.grid}>
      {wells.map((well) => (
        <Cell key={well.id} id={well.id} color={well[colorKey] as string | undefined} onClick={() => onWellClick(well.id)} />
      ))}
    </div>
  </div>
);
export default function WellHealthPage() {
  const [wells, setWells] = useState<Well[]>([]);
  const [selectedWell, setSelectedWell] = useState<number | null>(null);
  const [selectedKPI, setSelectedKPI] = useState<keyof WellMetrics | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/wells");
        if (!res.ok) throw new Error("Failed to fetch wells data");
        const data: Well[] = await res.json();
        setWells(data);
      } catch (error) {
        console.error("Error fetching wells:", error);
      }
    }
    fetchData();
  }, []);

  const handleWellClick = (id: number, kpiType: keyof WellMetrics) => {
    setSelectedWell(id);
    setSelectedKPI(kpiType);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Well Health Overview</h1>
      <GridSection
        title="Deviation (GOR)"
        wells={wells}
        colorKey="gorColor"
        onWellClick={(id) => handleWellClick(id, "gas_to_oil_ratio")}
      />
      <GridSection
        title="Water Breakthrough Risk (BSW)"
        wells={wells}
        colorKey="waterRiskColor"
        onWellClick={(id) => handleWellClick(id, "basic_sediment_water")}
      />
      <GridSection
        title="Pressure Stability (DHP)"
        wells={wells}
        colorKey="pressureColor"
        onWellClick={(id) => handleWellClick(id, "downhole_pressure")}
      />

      {/* Pass both selectedWell and selectedKPI to WellOverlay */}
      <WellOverlay wellId={selectedWell} kpiType={selectedKPI} onClose={() => setSelectedWell(null)} />


      <Link href="/well-integrity">
        <button className={styles.floatingButton}>
          <ArrowIcon className={styles.icon} />
        </button>
      </Link>
      <Link href="/production-kpi">
        <button className={styles.floatingButtonLeft}>
          <ArrowIconLeft className={styles.icon} />
        </button>
      </Link>
    </div>
  );
}