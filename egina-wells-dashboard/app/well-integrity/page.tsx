"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import ArrowIconLeft from "@/components/ArrowIconLeft";

interface Well {
  id: number;
  sandRiskColor: string;
  chokeColor: string;
}

// Cell component
const Cell: React.FC<{ id: number; color?: string }> = ({ id, color = "#4A4A4A" }) => (
  <div className={styles.cell} style={{ backgroundColor: typeof color === "string" ? color : "#4A4A4A" }}>
    {`W0${id.toString().padStart(2, "0")}`}
  </div>
);

// Grid section component
const GridSection: React.FC<{ title: string; wells: Well[]; colorKey: keyof Omit<Well, "id"> }> = ({ title, wells, colorKey }) => (
  <div className={styles.gridSection}>
    <h2 className={styles.gridTitle}>{title}</h2>
    <div className={styles.grid}>
      {wells.map((well) => (
        <Cell key={well.id} id={well.id} color={well[colorKey] as string | undefined} />
      ))}
    </div>
  </div>
);

export default function ProductionKPI() {
  const [wells, setWells] = useState<Well[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/wells");
        if (!res.ok) throw new Error("Failed to fetch wells data");
        const data: Well[] = await res.json();
        console.log("Fetched Wells Data:", data);
        setWells(data);
      } catch (error) {
        console.error("Error fetching wells:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Well Integrity View</h1>

      <GridSection title="Sand Risk" wells={wells} colorKey="sandRiskColor" />
      <GridSection title="Choke Stability" wells={wells} colorKey="chokeColor" />

      <Link href="/well-health">
        <button className={styles.floatingButtonLeft}>
          <ArrowIconLeft className={styles.icon} />
        </button>
      </Link>
    </div>
  );
}