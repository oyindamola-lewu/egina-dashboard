"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./styles.module.css";
import ArrowIcon from "@/components/ArrowIcon"; // Adjust based on folder structure

// Define Well interface
interface Well {
  id: number;
  lpeColor?: string;
  opeColor?: string;
  gpeColor?: string;
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
      <h1 className={styles.heading}>Production KPI View</h1>
      <GridSection title="Liquid Production Efficiency (LPE%)" wells={wells} colorKey="lpeColor" />
      <GridSection title="Oil Production Efficiency (OPE%)" wells={wells} colorKey="opeColor" />
      <GridSection title="Gas Production Efficiency (GPE%)" wells={wells} colorKey="gpeColor" />
      <Link href="/well-health">
        <button className={styles.floatingButton}>
          <ArrowIcon className={styles.icon} />
        </button>
      </Link>
    </div>
  );
}