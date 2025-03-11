import React from "react";
import Link from "next/link";
import styles from "./styles.module.css";
import ArrowIcon from "@/components/ArrowIcon"; // Adjust based on folder structure

interface CellProps {
  id: number;
  color?: string;
}

const Cell: React.FC<CellProps> = ({ id, color = "#4A4A4A" }) => {
  return (
    <div className={styles.cell} style={{ backgroundColor: color }}>
      {`W0${id.toString().padStart(2, "0")}`}
    </div>
  );
};

interface GridSectionProps {
  title: string;
  wells: number[];
}

const GridSection: React.FC<GridSectionProps> = ({ title, wells }) => {
  return (
    <div className={styles.gridSection}>
      <h2 className={styles.gridTitle}>{title}</h2>
      <div className={styles.grid}>
        {wells.map((id) => (
          <Cell key={id} id={id} />
        ))}
      </div>
    </div>
  );
};

export default function ProductionKPI() {
  const wells = Array.from({ length: 24 }, (_, i) => i + 1);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Production KPI View</h1>
      <GridSection title="Liquid Production Efficiency (LPE%)" wells={wells} />
      <GridSection title="Oil Production Efficiency (LPE%)" wells={wells} />
      <GridSection title="Gas Production Efficiency (LPE%)" wells={wells} />
      <Link href="/well-health">
      <button className={styles.floatingButton}>
          <ArrowIcon className={styles.icon} />
        </button>
      </Link>
    </div>
  );
}