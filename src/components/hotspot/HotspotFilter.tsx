"use client";

import { useConfig } from "../context/HotspotConfigProvider";




export default function HotspotFilter() {
  const {config, setConfig} = useConfig();

  const handleQuery = () => {
    console.log("Download triggered with:", {config});
  };

  function handleChange(value: string, key: string) {
  setConfig((prev) => ({ ...prev, [key]: value }));
}

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
        value={config.startdate}
        onChange={(e) => handleChange(e.target.value, "startdate")}
        className="border rounded px-3 py-2 text-sm text-gray-700 focus:outline-none cursor-pointer"
        placeholder="Start date"
      />

      <input
        type="date"
        value={config.enddate}
        onChange={(e) => handleChange(e.target.value, "enddate")}
        className="border rounded px-3 py-2 text-sm text-gray-700 focus:outline-none cursor-pointer"
        placeholder="End date"
      />

      <button
        onClick={handleQuery}
        className="bg-indigo-600 text-white px-4 py-2 rounded text-sm cursor-pointer"
      >
        Query
      </button>
    </div>
  );
}
