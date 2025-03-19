"use client";

import React from "react";
import styles from "./WellOverlay.module.css";
import Chart, { WellMetrics } from "./Chart";

interface WellOverlayProps {
  wellId: number | null;
  kpiType: keyof WellMetrics | null;
  onClose: () => void;
}


const WellOverlay: React.FC<WellOverlayProps> = ({ wellId, kpiType, onClose }) => {
  if (wellId === null || kpiType === null) return null;


return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <button className={styles.closeButton} onClick={onClose}>✕</button>
        <h2 className={styles.title}>Well W{wellId.toString().padStart(3, "0")}</h2>
        <div className={styles.chartsContainer}>
          {/* Dynamically use the kpiType for the Chart */}
          <Chart key={kpiType} title={kpiType.replace("_", " ")} wellId={wellId} dataKey={kpiType} />
        </div>
      </div>
    </div>
  );
};


export default WellOverlay;