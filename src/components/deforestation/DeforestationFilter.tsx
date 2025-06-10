"use client";

import { useState } from "react";

export default function DeforestationFilter() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleDownload = () => {
    console.log("Download triggered with:", { status, startDate, endDate });
    //
    //
    //
  };

  return (
    <div className="flex items-center gap-1 max-w-xl my-2 justify-end">
      
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="border rounded px-3 py-2 text-sm text-gray-700 focus:outline-none"
        placeholder="Start date"
      />

      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="border rounded px-3 py-2 text-sm text-gray-700 focus:outline-none"
        placeholder="End date"
      />

      <button
        onClick={handleDownload}
        className="bg-indigo-600 text-white px-4 py-2 rounded text-sm"
      >
        Download
      </button>
    </div>
  );
}
