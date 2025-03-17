"use client";

import React from "react";
import styles from "./WellOverlay.module.css";
import Chart, { WellMetrics } from "./Chart";

interface WellOverlayProps {
  wellId: number | null;
  onClose: () => void;
}

const dataKeyMap: Record<string, keyof WellMetrics> = {
  "Production Trend": "liquid_production",
  //"Predicted Output": "oil_production",
};

const WellOverlay: React.FC<WellOverlayProps> = ({ wellId, onClose }) => {
  if (wellId === null) return null; // Don't render if no well is selected

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <button className={styles.closeButton} onClick={onClose}>✕</button>
        <h2 className={styles.title}>Well W{wellId.toString().padStart(3, "0")}</h2>
        <div className={styles.chartsContainer}>
          {Object.entries(dataKeyMap).map(([title, dataKey]) => (
            <Chart key={title} title={title} wellId={wellId} dataKey={dataKey} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WellOverlay;