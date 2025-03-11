import Link from "next/link";
import React from "react";

interface CellProps {
  id: number;
  color?: string;
}

const Cell: React.FC<CellProps> = ({ id, color = "#4A4A4A" }) => {
  return (
    <div
      className="w-20 h-20 border flex items-center justify-center text-white font-bold"
      style={{ backgroundColor: color }}
    >
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
    <div className="flex items-center mb-8">
      <h2 className="text-right font-semibold mr-4 w-48">{title}</h2>
      <div className="grid grid-cols-12 bg-white">
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
    <div className="p-8 bg-white text-black">
      <h1 className="text-center text-xl font-bold mb-6">Well Integrity View</h1>
      <GridSection title="Sand Risk" wells={wells} />
      <GridSection title="Choke Stability" wells={wells} />
      
      <Link href="/well-health">
        <button className="fixed left-4 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
        <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
      </Link>
    </div>
  );
}