"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import ArrowIconLeft from "@/components/ArrowIconLeft";

interface Well {
  id: number;
  sandRiskColor?: string;
  chokeColor?: string;
}

const WellCard: React.FC<{ well: Well; onClick: () => void }> = ({ well, onClick }) => (
  <div className={styles.wellCard} onClick={onClick}>
    <div className={styles.wellHeader}>{`W0${well.id.toString().padStart(2, "0")}`}</div>
    <div className={styles.metrics}>
      <div className={styles.metricRow}>
        <span className={styles.metricLabel}>Sand Risk</span>
        <div className={styles.metricBar} style={{ backgroundColor: well.sandRiskColor }}></div>
      </div>
      <div className={styles.metricRow}>
        <span className={styles.metricLabel}>Jumper Pressure</span>
        <div className={styles.metricBar} style={{ backgroundColor: well.chokeColor }}></div>
      </div>
    </div>
  </div>
);

export default function WellIntegrity() {
  const [wells, setWells] = useState<Well[]>([]);
  const [selectedWell, setSelectedWell] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/wells");
        if (!res.ok) throw new Error("Failed to fetch wells data");
        const data: Well[] = await res.json();
        setWells(data);
      } catch (error) {
        console.error("Error fetching wells:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Well Integrity View</h1>

      {loading ? (
        <div className={styles.loader}>Loading wells...</div>
      ) : (
        <div className={styles.grid}>
          {wells.map((well) => (
            <WellCard key={well.id} well={well} onClick={() => setSelectedWell(well.id)} />
          ))}
        </div>
      )}

      <Link href="/well-health">
        <button className={styles.floatingButtonLeft}>
          <ArrowIconLeft className={styles.icon} />
        </button>
      </Link>
    </div>
  );
}
