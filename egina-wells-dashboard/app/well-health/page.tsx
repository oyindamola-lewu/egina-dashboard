import React from "react";
import Link from "next/link";
import styles from "./styles.module.css";
import ArrowIconLeft from "@/components/ArrowIconLeft"; 
import ArrowIcon from "@/components/ArrowIcon";

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

export default function WellHealth() {
  const wells = Array.from({ length: 24 }, (_, i) => i + 1);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Well Health View</h1>
      <GridSection title="GOR Deviation" wells={wells} />
      <GridSection title="Water Breakthrough" wells={wells} />

      <GridSection title="Pressure Stability" wells={wells} />
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