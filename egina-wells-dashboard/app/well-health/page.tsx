"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./styles.module.css";
import ArrowIcon from "@/components/ArrowIcon";
import ArrowIconLeft from "@/components/ArrowIconLeft";
import WellOverlay from "@/components/WellOverlay";

// Define Well interface
interface Well {
  id: number;
  gorColor?: string;
  waterRiskColor?: string;
  pressureColor?: string;
}

// Well card component
const WellCard: React.FC<{ well: Well; onClick: () => void }> = ({ well, onClick }) => (
  <div className={styles.wellCard} onClick={onClick}>
    <div className={styles.wellHeader}>{`W0${well.id.toString().padStart(2, "0")}`}</div>
    <div className={styles.metrics}>
      <div className={styles.metricRow}>
        <span className={styles.metricLabel}>GOR%</span>
        <div className={styles.metricBar} style={{ backgroundColor: well.gorColor }}></div>
      </div>
      <div className={styles.metricRow}>
        <span className={styles.metricLabel}>BSW%</span>
        <div className={styles.metricBar} style={{ backgroundColor: well.waterRiskColor }}></div>
      </div>
      <div className={styles.metricRow}>
        <span className={styles.metricLabel}>DHP%</span>
        <div className={styles.metricBar} style={{ backgroundColor: well.pressureColor }}></div>
      </div>
    </div>
  </div>
);

export default function WellHealthView() {
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
      <h1 className={styles.heading}>Well Health View</h1>

      {loading ? (
        <div className={styles.loader}>Loading wells...</div>
      ) : (
        <div className={styles.grid}>
          {wells.map((well) => (
            <WellCard key={well.id} well={well} onClick={() => setSelectedWell(well.id)} />
          ))}
        </div>
      )}

      {selectedWell !== null && (
        <WellOverlay wellId={selectedWell} onClose={() => setSelectedWell(null)} />
      )}

      <Link href="/production-kpi">
        <button className={styles.floatingButtonLeft}>
          <ArrowIconLeft className={styles.icon} />
        </button>
      </Link>

      <Link href="/well-integrity">
        <button className={styles.floatingButton}>
          <ArrowIcon className={styles.icon} />
        </button>
      </Link>
    </div>
  );
}
