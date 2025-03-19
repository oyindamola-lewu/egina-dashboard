"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./styles.module.css";
import ArrowIcon from "@/components/ArrowIcon";
import WellOverlay from "@/components/WellOverlay";
import { WellMetrics } from "@/components/Chart";

// Define Well interface
interface Well {
  id: number;
  lpeColor?: string;
  opeColor?: string;
  gpeColor?: string;
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

export default function ProductionKPI() {
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
      <h1 className={styles.heading}>Production KPI View</h1>
      <GridSection
        title="Liquid Production Efficiency (LPE%)"
        wells={wells}
        colorKey="lpeColor"
        onWellClick={(id) => handleWellClick(id, "liquid_production")}
      />
      <GridSection
        title="Oil Production Efficiency (OPE%)"
        wells={wells}
        colorKey="opeColor"
        onWellClick={(id) => handleWellClick(id, "oil_production")}
      />
      <GridSection
        title="Gas Production Efficiency (GPE%)"
        wells={wells}
        colorKey="gpeColor"
        onWellClick={(id) => handleWellClick(id, "gas_production")}
      />

      {/* Pass both selectedWell and selectedKPI to WellOverlay */}
      <WellOverlay wellId={selectedWell} kpiType={selectedKPI} onClose={() => setSelectedWell(null)} />
    
      <Link href="/well-health">
        <button className={styles.floatingButton}>
          <ArrowIcon className={styles.icon} />
        </button>
      </Link>
    </div>
  );
}