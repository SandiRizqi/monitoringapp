import React from "react";

// interface Company {
//     name: string;
//     year: string;
//     documents: string[];
// }

export default function CompanyTable() {
    const companies = [
        { name: "PT A", events: 15 },
        { name: "PT B", events: 9 },
        { name: "PT C", events: 7 },
    ];

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Perusahaan</h2>
            <div className="space-y-2">
                {companies.map((company) => (
                    <div key={company.name} className="flex justify-between">
                        <span>{company.name}</span>
                        <span className="font-bold">{company.events}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}