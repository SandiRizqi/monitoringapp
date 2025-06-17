"use client";

import { useState } from "react";


const getTodayDate = () => {
  return new Date().toISOString().slice(0, 10);
};


export default function HotspotFilter() {
  // const [status, setStatus] = useState("HIGH");
  const [startDate, setStartDate] = useState(getTodayDate());
  const [endDate, setEndDate] = useState(getTodayDate());

  const handleDownload = () => {
    console.log("Download triggered with:", { startDate, endDate });
    //
    //
    //
  };

  return (
    <div className="flex items-center gap-1 max-w-xl my-2 justify-end">
      {/* <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border rounded px-3 py-2 text-sm text-gray-700 focus:outline-none cursor-pointer"
      >
        <option value="HIGH">HIGH</option>
        <option value="MEDIUM">MEDIUM</option>
        <option value="LOW">LOW</option>
      </select> */}

      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="border rounded px-3 py-2 text-sm text-gray-700 focus:outline-none cursor-pointer"
        placeholder="Start date"
      />

      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="border rounded px-3 py-2 text-sm text-gray-700 focus:outline-none cursor-pointer"
        placeholder="End date"
      />

      <button
        onClick={handleDownload}
        className="bg-indigo-600 text-white px-4 py-2 rounded text-sm cursor-pointer"
      >
        Download
      </button>
    </div>
  );
}
